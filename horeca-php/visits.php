<?php
require_once 'config/config.php';
requireLogin();
$pageTitle = 'Rapports de Visite';
$db = getDbConnection();

try {
    $stmt = $db->query("SELECT v.*, p.name as prospect_name, p.city, u.first_name, u.last_name FROM visits v LEFT JOIN prospects p ON v.prospect_id = p.id LEFT JOIN users u ON v.user_id = u.id ORDER BY v.visited_at DESC");
    $visits = $stmt->fetchAll();
} catch (PDOException $e) {
    $visits = [];
}

include 'includes/header.php';
include 'includes/sidebar.php';
?>
<div class="main-content">
    <div class="content">
        <div class="page-header">
            <div>
                <h1>Rapports de Visite</h1>
                <p class="text-muted"><?php echo count($visits); ?> visite(s)</p>
            </div>
            <a href="new-visit.php" class="btn btn-primary">📝 Nouvelle visite</a>
        </div>
        
        <?php if (empty($visits)): ?>
            <div class="card">
                <div class="card-body text-center">
                    <p class="text-muted">Aucune visite enregistrée</p>
                </div>
            </div>
        <?php else: ?>
            <div class="visits-grid">
                <?php foreach ($visits as $visit): ?>
                    <div class="card visit-card">
                        <div class="card-header">
                            <h3><a href="prospect-detail.php?id=<?php echo $visit['prospect_id']; ?>"><?php echo escapeHtml($visit['prospect_name']); ?></a></h3>
                            <?php if ($visit['score']): ?>
                                <span class="score-badge"><?php echo $visit['score']; ?>⭐</span>
                            <?php endif; ?>
                        </div>
                        <div class="card-body">
                            <p class="text-muted"><?php echo formatDateTime($visit['visited_at']); ?> - <?php echo $visit['duration_minutes'] ?? 0; ?> min</p>
                            <?php if ($visit['objective']): ?>
                                <p><strong>Objectif:</strong> <?php echo escapeHtml($visit['objective']); ?></p>
                            <?php endif; ?>
                            <?php if ($visit['summary']): ?>
                                <p><?php echo nl2br(escapeHtml($visit['summary'])); ?></p>
                            <?php endif; ?>
                            <?php if ($visit['signed_by']): ?>
                                <p class="text-sm text-muted">Signé par: <?php echo escapeHtml($visit['signed_by']); ?></p>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>
<?php include 'includes/footer.php'; ?>

