import { query, initDatabase, closeDatabase } from './connection';
import { UserModel } from '../models/user.model';
import { ProspectModel } from '../models/prospect.model';
import { logger } from '../utils/logger';

async function seed() {
  try {
    logger.info('Starting database seed...');

    await initDatabase();

    // Create default company
    const companyResult = await query(
      `INSERT INTO companies (name) 
       VALUES ('Demo Company')
       ON CONFLICT DO NOTHING
       RETURNING id`
    );
    const companyId = companyResult.rows[0]?.id;

    logger.info(`Company created: ${companyId}`);

    // Create admin user
    const admin = await UserModel.create({
      email: 'admin@horeca-prospection.com',
      password: 'Admin123!',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      companyId
    });
    logger.info(`Admin user created: ${admin.email}`);

    // Create manager user
    const manager = await UserModel.create({
      email: 'manager@horeca-prospection.com',
      password: 'Manager123!',
      role: 'manager',
      firstName: 'Marie',
      lastName: 'Dupont',
      companyId
    });
    logger.info(`Manager user created: ${manager.email}`);

    // Create representative user
    const rep = await UserModel.create({
      email: 'rep@horeca-prospection.com',
      password: 'Rep123!',
      role: 'rep',
      firstName: 'Jean',
      lastName: 'Martin',
      phone: '+33612345678',
      companyId
    });
    logger.info(`Representative user created: ${rep.email}`);

    // Create sample prospects - ENRICHED DATA
    const prospects = [
      // HOTELS
      {
        name: 'Hôtel Le Grand Paris',
        type: 'hotel' as const,
        address: '12 Avenue des Champs-Élysées',
        postalCode: '75008',
        city: 'Paris',
        country: 'France',
        phone: '+33142257000',
        email: 'contact@legrandparis.fr',
        website: 'https://www.legrandparis.fr',
        managerName: 'Sophie Laurent',
        status: 'to_visit' as const,
        latitude: 48.8698,
        longitude: 2.3078,
        companyId,
        createdBy: rep.id
      },
      {
        name: 'Hôtel Plaza Athénée',
        type: 'hotel' as const,
        address: '25 Avenue Montaigne',
        postalCode: '75008',
        city: 'Paris',
        country: 'France',
        phone: '+33153677665',
        email: 'reservation@plaza-athenee.com',
        website: 'https://www.plaza-athenee.com',
        managerName: 'Jacques Lebrun',
        status: 'in_progress' as const,
        latitude: 48.8662,
        longitude: 2.3043,
        companyId,
        createdBy: rep.id
      },
      {
        name: 'Hôtel Ritz Paris',
        type: 'hotel' as const,
        address: '15 Place Vendôme',
        postalCode: '75001',
        city: 'Paris',
        country: 'France',
        phone: '+33143163030',
        email: 'info@ritzparis.com',
        website: 'https://www.ritzparis.com',
        managerName: 'Catherine Deneuve',
        status: 'converted' as const,
        latitude: 48.8677,
        longitude: 2.3287,
        companyId,
        createdBy: rep.id
      },
      
      // RESTAURANTS
      {
        name: 'Restaurant La Belle Époque',
        type: 'restaurant' as const,
        address: '45 Rue de Rivoli',
        postalCode: '75001',
        city: 'Paris',
        country: 'France',
        phone: '+33144556677',
        email: 'info@labelleepoque.fr',
        website: 'https://www.labelleepoque.fr',
        managerName: 'Pierre Dubois',
        status: 'to_visit' as const,
        latitude: 48.8606,
        longitude: 2.3376,
        companyId,
        createdBy: rep.id
      },
      {
        name: 'Le Gourmet Parisien',
        type: 'restaurant' as const,
        address: '34 Rue Saint-Antoine',
        postalCode: '75004',
        city: 'Paris',
        country: 'France',
        phone: '+33142785656',
        email: 'contact@gourmet-parisien.fr',
        website: 'https://www.gourmet-parisien.fr',
        managerName: 'Marc Dubois',
        status: 'in_progress' as const,
        latitude: 48.8550,
        longitude: 2.3644,
        companyId,
        createdBy: rep.id
      },
      {
        name: 'Brasserie Montparnasse',
        type: 'restaurant' as const,
        address: '102 Boulevard du Montparnasse',
        postalCode: '75014',
        city: 'Paris',
        country: 'France',
        phone: '+33143222190',
        email: 'info@brasserie-montparnasse.fr',
        managerName: 'Alain Ducasse',
        status: 'to_visit' as const,
        latitude: 48.8420,
        longitude: 2.3254,
        companyId,
        createdBy: rep.id
      },
      {
        name: 'Chez Julien',
        type: 'restaurant' as const,
        address: '1 Rue du Pont Louis-Philippe',
        postalCode: '75004',
        city: 'Paris',
        country: 'France',
        phone: '+33142784331',
        email: 'contact@chez-julien.fr',
        managerName: 'Julien Martin',
        status: 'in_progress' as const,
        latitude: 48.8564,
        longitude: 2.3563,
        companyId,
        createdBy: rep.id
      },
      {
        name: 'Le Comptoir du Relais',
        type: 'restaurant' as const,
        address: '9 Carrefour de l\'Odéon',
        postalCode: '75006',
        city: 'Paris',
        country: 'France',
        phone: '+33144270797',
        email: 'info@comptoirdurelais.fr',
        managerName: 'Yves Camdeborde',
        status: 'converted' as const,
        latitude: 48.8515,
        longitude: 2.3390,
        companyId,
        createdBy: rep.id
      },
      
      // TRAITEURS
      {
        name: 'Traiteur Excellence',
        type: 'traiteur' as const,
        address: '78 Boulevard Saint-Germain',
        postalCode: '75005',
        city: 'Paris',
        country: 'France',
        phone: '+33145678901',
        email: 'contact@traiteur-excellence.fr',
        managerName: 'Isabelle Moreau',
        status: 'to_visit' as const,
        latitude: 48.8520,
        longitude: 2.3470,
        companyId,
        createdBy: rep.id
      },
      {
        name: 'Maison Lenôtre',
        type: 'traiteur' as const,
        address: '44 Rue d\'Auteuil',
        postalCode: '75016',
        city: 'Paris',
        country: 'France',
        phone: '+33145241152',
        email: 'contact@lenotre.fr',
        website: 'https://www.lenotre.fr',
        managerName: 'Gaston Lenôtre',
        status: 'in_progress' as const,
        latitude: 48.8478,
        longitude: 2.2600,
        companyId,
        createdBy: rep.id
      },
      {
        name: 'Traiteur Dalloyau',
        type: 'traiteur' as const,
        address: '101 Rue du Faubourg Saint-Honoré',
        postalCode: '75008',
        city: 'Paris',
        country: 'France',
        phone: '+33142998000',
        email: 'contact@dalloyau.fr',
        website: 'https://www.dalloyau.fr',
        managerName: 'Charles Dalloyau',
        status: 'converted' as const,
        latitude: 48.8717,
        longitude: 2.3133,
        companyId,
        createdBy: rep.id
      },
      
      // ECOLES
      {
        name: 'Lycée Henri IV',
        type: 'ecole' as const,
        address: '23 Rue Clovis',
        postalCode: '75005',
        city: 'Paris',
        country: 'France',
        phone: '+33144321717',
        email: 'restauration@lycee-henri4.fr',
        managerName: 'François Bernard',
        status: 'to_visit' as const,
        latitude: 48.8467,
        longitude: 2.3472,
        companyId,
        createdBy: rep.id
      },
      {
        name: 'Lycée Louis-le-Grand',
        type: 'ecole' as const,
        address: '123 Rue Saint-Jacques',
        postalCode: '75005',
        city: 'Paris',
        country: 'France',
        phone: '+33144322770',
        email: 'restauration@louislegrand.fr',
        managerName: 'Marie Curie',
        status: 'in_progress' as const,
        latitude: 48.8489,
        longitude: 2.3431,
        companyId,
        createdBy: rep.id
      },
      {
        name: 'École Polytechnique',
        type: 'ecole' as const,
        address: 'Route de Saclay',
        postalCode: '91128',
        city: 'Palaiseau',
        country: 'France',
        phone: '+33169333333',
        email: 'restauration@polytechnique.edu',
        website: 'https://www.polytechnique.edu',
        managerName: 'Laurent Schwartz',
        status: 'converted' as const,
        latitude: 48.7128,
        longitude: 2.2069,
        companyId,
        createdBy: rep.id
      },
      
      // HOPITAUX
      {
        name: 'Hôpital Européen Georges-Pompidou',
        type: 'hopital' as const,
        address: '20 Rue Leblanc',
        postalCode: '75015',
        city: 'Paris',
        country: 'France',
        phone: '+33156093000',
        email: 'restauration@hegp.fr',
        managerName: 'Dr. Anne Petit',
        status: 'to_visit' as const,
        latitude: 48.8402,
        longitude: 2.2770,
        companyId,
        createdBy: rep.id
      },
      {
        name: 'Hôpital Pitié-Salpêtrière',
        type: 'hopital' as const,
        address: '47-83 Boulevard de l\'Hôpital',
        postalCode: '75013',
        city: 'Paris',
        country: 'France',
        phone: '+33142161000',
        email: 'restauration@aphp.fr',
        managerName: 'Dr. Jean-Marc Léger',
        status: 'in_progress' as const,
        latitude: 48.8399,
        longitude: 2.3631,
        companyId,
        createdBy: rep.id
      },
      {
        name: 'Hôpital Cochin',
        type: 'hopital' as const,
        address: '27 Rue du Faubourg Saint-Jacques',
        postalCode: '75014',
        city: 'Paris',
        country: 'France',
        phone: '+33158411234',
        email: 'restauration.cochin@aphp.fr',
        managerName: 'Dr. Sophie Dupont',
        status: 'to_visit' as const,
        latitude: 48.8379,
        longitude: 2.3378,
        companyId,
        createdBy: rep.id
      },
      
      // AUTRES - Variété
      {
        name: 'Casino de Paris',
        type: 'autre' as const,
        address: '16 Rue de Clichy',
        postalCode: '75009',
        city: 'Paris',
        country: 'France',
        phone: '+33149257052',
        email: 'contact@casinodeparis.fr',
        website: 'https://www.casinodeparis.fr',
        managerName: 'Michel Sardou',
        status: 'in_progress' as const,
        latitude: 48.8764,
        longitude: 2.3296,
        companyId,
        createdBy: rep.id
      },
      {
        name: 'Musée du Louvre',
        type: 'autre' as const,
        address: 'Rue de Rivoli',
        postalCode: '75001',
        city: 'Paris',
        country: 'France',
        phone: '+33140205050',
        email: 'info@louvre.fr',
        website: 'https://www.louvre.fr',
        managerName: 'Laurence des Cars',
        status: 'converted' as const,
        latitude: 48.8606,
        longitude: 2.3376,
        companyId,
        createdBy: rep.id
      }
    ];

    for (const prospectData of prospects) {
      const prospect = await ProspectModel.create(prospectData);
      logger.info(`Prospect created: ${prospect.name}`);
    }

    logger.info('✅ Database seed completed successfully');
    logger.info('');
    logger.info('📝 Default users created:');
    logger.info('   Admin:   admin@horeca-prospection.com / Admin123!');
    logger.info('   Manager: manager@horeca-prospection.com / Manager123!');
    logger.info('   Rep:     rep@horeca-prospection.com / Rep123!');

    await closeDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seed failed:', error);
    await closeDatabase();
    process.exit(1);
  }
}

seed();



