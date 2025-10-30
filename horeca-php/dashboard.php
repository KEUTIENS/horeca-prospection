<?php
/**
 * Tableau de Bord
 * HORECA Prospection
 */

require_once 'config/config.php';
requireLogin();

$pageTitle = 'Tableau de bord';
$user = getCurrentUser();
$db = getDbConnection();

// Statistiques rapides
$stats = [
    'total_prospects' => 0,
    'to_visit' => 0,
    'in_progress' => 0,
    'converted' => 0,
    'visits_this_week' => 0,
    'avg_score' => 0
];

try {
    // Total prospects
    $stmt = $db->query("SELECT COUNT(*) as total FROM prospects");
    $stats['total_prospects'] = $stmt->fetch()['total'];
    
    // Prospects par statut
    $stmt = $db->query("SELECT status, COUNT(*) as count FROM prospects GROUP BY status");
    while ($row = $stmt->fetch()) {
        $stats[$row['status']] = $row['count'];
    }
    
    // Visites cette semaine
    $stmt = $db->query("SELECT COUNT(*) as count FROM visits WHERE WEEK(visited_at) = WEEK(NOW()) AND YEAR(visited_at) = YEAR(NOW())");
    $stats['visits_this_week'] = $stmt->fetch()['count'];
    
    // Score moyen
    $stmt = $db->query("SELECT AVG(score) as avg_score FROM visits WHERE score IS NOT NULL");
    $result = $stmt->fetch();
    $stats['avg_score'] = $result['avg_score'] ? round($result['avg_score'], 1) : 0;
    
    // Dernières visites
    $stmt = $db->query("
        SELECT v.*, p.name as prospect_name, p.city, u.first_name, u.last_name
        FROM visits v
        LEFT JOIN prospects p ON v.prospect_id = p.id
        LEFT JOIN users u ON v.user_id = u.id
        ORDER BY v.visited_at DESC
        LIMIT 5
    ");
    $recent_visits = $stmt->fetchAll();
    
    // Top prospects
    $stmt = $db->query("
        SELECT p.*, COUNT(v.id) as visits_count, AVG(v.score) as avg_score
        FROM prospects p
        LEFT JOIN visits v ON p.id = v.prospect_id
        WHERE v.score IS NOT NULL
        GROUP BY p.id
        ORDER BY avg_score DESC, visits_count DESC
        LIMIT 5
    ");
    $top_prospects = $stmt->fetchAll();
    
} catch (PDOException $e) {
    $error = "Erreur lors du chargement des statistiques";
}

include 'includes/header.php';
include 'includes/sidebar.php';
?>

<div class="main-content">
    <div class="content">
        <div class="page-header">
            <h1>Bonjour, <?php echo escapeHtml($user['first_name']); ?> 👋</h1>
            <p class="text-muted">Voici un aperçu de votre activité</p>
        </div>
        
        <!-- Statistiques KPIs -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: #EBF5FF;">
                    <span style="color: #2563EB;">👥</span>
                </div>
                <div class="stat-content">
                    <p class="stat-label">Total Prospects</p>
                    <p class="stat-value"><?php echo $stats['total_prospects']; ?></p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: #FEF3C7;">
                    <span style="color: #F59E0B;">⏳</span>
                </div>
                <div class="stat-content">
                    <p class="stat-label">À visiter</p>
                    <p class="stat-value"><?php echo $stats['to_visit'] ?? 0; ?></p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: #D1FAE5;">
                    <span style="color: #10B981;">✅</span>
                </div>
                <div class="stat-content">
                    <p class="stat-label">Convertis</p>
                    <p class="stat-value"><?php echo $stats['converted'] ?? 0; ?></p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: #E0E7FF;">
                    <span style="color: #6366F1;">📝</span>
                </div>
                <div class="stat-content">
                    <p class="stat-label">Visites / Semaine</p>
                    <p class="stat-value"><?php echo $stats['visits_this_week']; ?></p>
                </div>
            </div>
        </div>
        
        <!-- Grille 2 colonnes -->
        <div class="dashboard-grid">
            <!-- Dernières visites -->
            <div class="card">
                <div class="card-header">
                    <h2>Activité récente</h2>
                </div>
                <div class="card-body">
                    <?php if (empty($recent_visits)): ?>
                        <p class="text-muted text-center">Aucune visite enregistrée</p>
                    <?php else: ?>
                        <div class="activity-list">
                            <?php foreach ($recent_visits as $visit): ?>
                                <div class="activity-item">
                                    <div class="activity-icon">📍</div>
                                    <div class="activity-content">
                                        <p class="activity-title">
                                            <strong><?php echo escapeHtml($visit['prospect_name']); ?></strong>
                                            <?php if ($visit['score']): ?>
                                                <span class="badge badge-score"><?php echo $visit['score']; ?>⭐</span>
                                            <?php endif; ?>
                                        </p>
                                        <p class="activity-meta text-muted">
                                            <?php echo formatDateTime($visit['visited_at']); ?>
                                            <?php if ($visit['first_name']): ?>
                                                - par <?php echo escapeHtml($visit['first_name'] . ' ' . $visit['last_name']); ?>
                                            <?php endif; ?>
                                        </p>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- Top prospects -->
            <div class="card">
                <div class="card-header">
                    <h2>Meilleurs prospects</h2>
                </div>
                <div class="card-body">
                    <?php if (empty($top_prospects)): ?>
                        <p class="text-muted text-center">Aucun prospect noté</p>
                    <?php else: ?>
                        <div class="prospects-list">
                            <?php foreach ($top_prospects as $prospect): ?>
                                <div class="prospect-item">
                                    <div class="prospect-info">
                                        <p class="prospect-name">
                                            <a href="prospect-detail.php?id=<?php echo $prospect['id']; ?>">
                                                <?php echo escapeHtml($prospect['name']); ?>
                                            </a>
                                        </p>
                                        <p class="text-muted text-sm">
                                            <?php echo $prospect['visits_count']; ?> visite(s)
                                        </p>
                                    </div>
                                    <div class="prospect-score">
                                        <?php if ($prospect['avg_score']): ?>
                                            <span class="score-badge"><?php echo number_format($prospect['avg_score'], 1); ?>⭐</span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <!-- Actions rapides -->
        <div class="quick-actions">
            <a href="new-prospect.php" class="btn btn-primary">
                ➕ Nouveau prospect
            </a>
            <a href="new-visit.php" class="btn btn-secondary">
                📝 Nouvelle visite
            </a>
            <a href="planning.php" class="btn btn-secondary">
                📅 Planifier une tournée
            </a>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>

