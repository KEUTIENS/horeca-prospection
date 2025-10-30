import { Worker, Queue } from 'bullmq';
import axios from 'axios';
import IORedis from 'ioredis';
import { ProspectModel } from '../models/prospect.model';
import { logger } from '../utils/logger';

const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null
});

export const aiEnrichmentQueue = new Queue('ai-enrichment', { connection });

interface EnrichmentJob {
  prospectId: string;
  name: string;
  address?: string;
  website?: string;
}

async function enrichProspectWithAI(data: EnrichmentJob): Promise<any> {
  try {
    const { name, address, website } = data;

    const prompt = `
Tu es un assistant qui enrichit des données de prospects pour des commerciaux dans le secteur HORECA (Hôtels, Restaurants, Traiteurs, Écoles, Hôpitaux).

Informations du prospect:
- Nom: ${name}
${address ? `- Adresse: ${address}` : ''}
${website ? `- Site web: ${website}` : ''}

Tâche:
1. Recherche des informations publiques disponibles sur cet établissement
2. Fournis les informations suivantes au format JSON:
   - managerName: nom du gérant/directeur (si trouvé)
   - openingHours: jours et heures d'ouverture
   - closingDays: jours de fermeture
   - specialties: spécialités ou type de cuisine
   - capacity: capacité estimée (couverts, chambres, etc.)
   - socialMedia: liens réseaux sociaux
   - rating: note/réputation si disponible
   - relevanceScore: score de 0 à 10 indiquant la pertinence pour la prospection

Réponds uniquement avec un objet JSON valide, sans texte supplémentaire.
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant spécialisé dans l\'enrichissement de données B2B pour le secteur HORECA.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse JSON response
    const enrichedData = JSON.parse(content);

    return enrichedData;
  } catch (error: any) {
    logger.error('AI enrichment error:', error.message);
    throw error;
  }
}

// Create worker
export const aiWorker = new Worker<EnrichmentJob>(
  'ai-enrichment',
  async (job) => {
    logger.info(`Processing AI enrichment for prospect: ${job.data.prospectId}`);

    try {
      const enrichedData = await enrichProspectWithAI(job.data);

      // Update prospect with enriched data
      await ProspectModel.markAiEnriched(
        job.data.prospectId,
        {
          ...enrichedData,
          enrichedAt: new Date().toISOString(),
          provider: 'openai'
        },
        enrichedData.relevanceScore
      );

      logger.info(`AI enrichment completed for prospect: ${job.data.prospectId}`);

      return { success: true, data: enrichedData };
    } catch (error: any) {
      logger.error(`AI enrichment failed for prospect ${job.data.prospectId}:`, error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 2,
    limiter: {
      max: 10,
      duration: 60000 // 10 requests per minute
    }
  }
);

aiWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed`);
});

aiWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed:`, err);
});

// Queue a new enrichment job
export async function queueEnrichment(prospectId: string, name: string, address?: string, website?: string) {
  await aiEnrichmentQueue.add(
    'enrich',
    {
      prospectId,
      name,
      address,
      website
    },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    }
  );

  logger.info(`Enrichment job queued for prospect: ${prospectId}`);
}

logger.info('AI Enrichment Worker started');



