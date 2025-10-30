<?php
require_once 'config/config.php';
requireLogin();
$pageTitle = 'Planning';
$db = getDbConnection();

try {
    $stmt = $db->query("SELECT t.*, u.first_name, u.last_name, COUNT(ts.id) as steps_count FROM tours t LEFT JOIN users u ON t.user_id = u.id LEFT JOIN tour_steps ts ON t.id = ts.tour_id GROUP BY t.id ORDER BY t.date DESC, t.created_at DESC");
    $tours = $stmt->fetchAll();
} catch (PDOException $e) {
    $tours = [];
}

include 'includes/header.php';
include 'includes/sidebar.php';
?>
<div class="main-content">
    <div class="content">
        <div class="page-header">
            <div>
                <h1>Planning des Tournées</h1>
                <p class="text-muted"><?php echo count($tours); ?> tournée(s)</p>
            </div>
            <a href="new-tour.php" class="btn btn-primary">📅 Nouvelle tournée</a>
        </div>
        
        <?php if (empty($tours)): ?>
            <div class="card">
                <div class="card-body text-center">
                    <p class="text-muted">Aucune tournée planifiée</p>
                    <a href="new-tour.php" class="btn btn-primary mt-3">Créer la première tournée</a>
                </div>
            </div>
        <?php else: ?>
            <div class="card">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Date</th>
                                <th>Commercial</th>
                                <th>Prospects</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($tours as $tour): ?>
                                <tr>
                                    <td><strong><?php echo escapeHtml($tour['name'] ?: 'Tournée #' . $tour['id']); ?></strong></td>
                                    <td><?php echo formatDate($tour['date']); ?></td>
                                    <td><?php echo escapeHtml($tour['first_name'] . ' ' . $tour['last_name']); ?></td>
                                    <td><?php echo $tour['steps_count']; ?> étape(s)</td>
                                    <td>
                                        <span class="badge badge-<?php echo $tour['status']; ?>">
                                            <?php echo getStatusLabel($tour['status']); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <a href="tour-detail.php?id=<?php echo $tour['id']; ?>" class="btn btn-sm btn-outline">👁️ Voir</a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>
<?php include 'includes/footer.php'; ?>

