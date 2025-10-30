<?php
require_once 'config/config.php';
requireAdmin();
$pageTitle = 'Utilisateurs';
$db = getDbConnection();

try {
    $stmt = $db->query("SELECT * FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll();
} catch (PDOException $e) {
    $users = [];
}

include 'includes/header.php';
include 'includes/sidebar.php';
?>
<div class="main-content">
    <div class="content">
        <div class="page-header">
            <div>
                <h1>Gestion des Utilisateurs</h1>
                <p class="text-muted"><?php echo count($users); ?> utilisateur(s)</p>
            </div>
            <a href="new-user.php" class="btn btn-primary">➕ Nouvel utilisateur</a>
        </div>
        
        <div class="card">
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Téléphone</th>
                            <th>Statut</th>
                            <th>Créé le</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($users as $user): ?>
                            <tr>
                                <td><strong><?php echo escapeHtml($user['first_name'] . ' ' . $user['last_name']); ?></strong></td>
                                <td><?php echo escapeHtml($user['email']); ?></td>
                                <td><span class="badge badge-type"><?php echo getRoleLabel($user['role']); ?></span></td>
                                <td><?php echo escapeHtml($user['phone']); ?></td>
                                <td>
                                    <?php if ($user['active']): ?>
                                        <span class="badge badge-converted">Actif</span>
                                    <?php else: ?>
                                        <span class="badge badge-lost">Inactif</span>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo formatDate($user['created_at']); ?></td>
                                <td>
                                    <a href="edit-user.php?id=<?php echo $user['id']; ?>" class="btn btn-sm btn-outline">✏️</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<?php include 'includes/footer.php'; ?>

