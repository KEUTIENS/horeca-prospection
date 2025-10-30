<?php
require_once 'config/config.php';
requireLogin();
$pageTitle = 'Détail Prospect';
$db = getDbConnection();

$id = $_GET['id'] ?? 0;
if (!$id) redirect('prospects.php');

try {
    $stmt = $db->prepare("SELECT * FROM prospects WHERE id = ?");
    $stmt->execute([$id]);
    $prospect = $stmt->fetch();
    if (!$prospect) redirect('prospects.php');
    
    $stmt = $db->prepare("SELECT v.*, u.first_name, u.last_name FROM visits v LEFT JOIN users u ON v.user_id = u.id WHERE v.prospect_id = ? ORDER BY v.visited_at DESC");
    $stmt->execute([$id]);
    $visits = $stmt->fetchAll();
} catch (PDOException $e) {
    die("Erreur");
}

include 'includes/header.php';
include 'includes/sidebar.php';
?>
<div class="main-content">
    <div class="content">
        <div class="page-header">
            <div>
                <h1><?php echo escapeHtml($prospect['name']); ?></h1>
                <p class="text-muted"><?php echo getTypeLabel($prospect['type']); ?> - <?php echo escapeHtml($prospect['city']); ?></p>
            </div>
            <div class="action-buttons">
                <a href="new-visit.php?prospect_id=<?php echo $id; ?>" class="btn btn-primary">📝 Nouvelle visite</a>
                <a href="edit-prospect.php?id=<?php echo $id; ?>" class="btn btn-secondary">✏️ Modifier</a>
            </div>
        </div>
        
        <div class="dashboard-grid">
            <div class="card">
                <div class="card-header"><h3>Informations</h3></div>
                <div class="card-body">
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Statut</span>
                            <span class="badge badge-<?php echo $prospect['status']; ?>"><?php echo getStatusLabel($prospect['status']); ?></span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Adresse</span>
                            <span><?php echo escapeHtml($prospect['address']); ?>, <?php echo escapeHtml($prospect['postal_code']); ?> <?php echo escapeHtml($prospect['city']); ?></span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Téléphone</span>
                            <span><?php echo escapeHtml($prospect['phone']); ?></span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email</span>
                            <span><?php echo escapeHtml($prospect['email']); ?></span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Responsable</span>
                            <span><?php echo escapeHtml($prospect['manager_name']); ?></span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header"><h3>Historique des visites (<?php echo count($visits); ?>)</h3></div>
                <div class="card-body">
                    <?php if (empty($visits)): ?>
                        <p class="text-muted text-center">Aucune visite enregistrée</p>
                    <?php else: ?>
                        <?php foreach ($visits as $visit): ?>
                            <div class="visit-card">
                                <div class="visit-header">
                                    <span><?php echo formatDateTime($visit['visited_at']); ?></span>
                                    <?php if ($visit['score']): ?>
                                        <span class="score-badge"><?php echo $visit['score']; ?>⭐</span>
                                    <?php endif; ?>
                                </div>
                                <?php if ($visit['objective']): ?>
                                    <p><strong>Objectif:</strong> <?php echo escapeHtml($visit['objective']); ?></p>
                                <?php endif; ?>
                                <?php if ($visit['summary']): ?>
                                    <p><?php echo nl2br(escapeHtml($visit['summary'])); ?></p>
                                <?php endif; ?>
                                <p class="text-muted text-sm">Par <?php echo escapeHtml($visit['first_name'] . ' ' . $visit['last_name']); ?></p>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>
<?php include 'includes/footer.php'; ?>

