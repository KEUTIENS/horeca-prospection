<?php
require_once 'config/config.php';
requireLogin();
$pageTitle = 'Détail Tournée';
$db = getDbConnection();

$id = $_GET['id'] ?? 0;
if (!$id) redirect('planning.php');

try {
    $stmt = $db->prepare("SELECT t.*, u.first_name, u.last_name FROM tours t LEFT JOIN users u ON t.user_id = u.id WHERE t.id = ?");
    $stmt->execute([$id]);
    $tour = $stmt->fetch();
    if (!$tour) redirect('planning.php');
    
    $stmt = $db->prepare("SELECT ts.*, p.name, p.address, p.city, p.phone FROM tour_steps ts LEFT JOIN prospects p ON ts.prospect_id = p.id WHERE ts.tour_id = ? ORDER BY ts.step_order");
    $stmt->execute([$id]);
    $steps = $stmt->fetchAll();
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
                <h1><?php echo escapeHtml($tour['name'] ?: 'Tournée #' . $tour['id']); ?></h1>
                <p class="text-muted">
                    <?php echo formatDate($tour['date']); ?> - 
                    <?php echo escapeHtml($tour['first_name'] . ' ' . $tour['last_name']); ?>
                </p>
            </div>
            <span class="badge badge-<?php echo $tour['status']; ?>">
                <?php echo getStatusLabel($tour['status']); ?>
            </span>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3>Étapes de la tournée (<?php echo count($steps); ?>)</h3>
            </div>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Prospect</th>
                            <th>Adresse</th>
                            <th>Téléphone</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($steps as $step): ?>
                            <tr>
                                <td><strong><?php echo $step['step_order']; ?></strong></td>
                                <td>
                                    <a href="prospect-detail.php?id=<?php echo $step['prospect_id']; ?>">
                                        <?php echo escapeHtml($step['name']); ?>
                                    </a>
                                </td>
                                <td><?php echo escapeHtml($step['address']); ?>, <?php echo escapeHtml($step['city']); ?></td>
                                <td><?php echo escapeHtml($step['phone']); ?></td>
                                <td>
                                    <span class="badge badge-<?php echo $step['status']; ?>">
                                        <?php echo getStatusLabel($step['status']); ?>
                                    </span>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="mt-4">
            <a href="planning.php" class="btn btn-secondary">← Retour au planning</a>
        </div>
    </div>
</div>
<?php include 'includes/footer.php'; ?>

