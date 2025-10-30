<?php
require_once 'config/config.php';
requireLogin();
$pageTitle = 'Nouvelle Tournée';
$db = getDbConnection();
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $date = $_POST['date'] ?? '';
    $prospect_ids = $_POST['prospect_ids'] ?? [];
    
    if (empty($date)) {
        $error = 'La date est obligatoire';
    } elseif (empty($prospect_ids)) {
        $error = 'Sélectionnez au moins un prospect';
    } else {
        try {
            $db->beginTransaction();
            
            $stmt = $db->prepare("INSERT INTO tours (user_id, name, date, status) VALUES (?, ?, ?, 'planned')");
            $stmt->execute([$_SESSION['user_id'], $name, $date]);
            $tour_id = $db->lastInsertId();
            
            $stmt = $db->prepare("INSERT INTO tour_steps (tour_id, prospect_id, step_order) VALUES (?, ?, ?)");
            foreach ($prospect_ids as $order => $prospect_id) {
                $stmt->execute([$tour_id, $prospect_id, $order + 1]);
            }
            
            $db->commit();
            redirect('planning.php');
        } catch (PDOException $e) {
            $db->rollBack();
            $error = 'Erreur lors de la création';
        }
    }
}

$prospects = [];
try {
    $stmt = $db->query("SELECT * FROM prospects WHERE status IN ('to_visit', 'in_progress') ORDER BY city, name");
    $prospects = $stmt->fetchAll();
} catch (PDOException $e) {}

include 'includes/header.php';
include 'includes/sidebar.php';
?>
<div class="main-content">
    <div class="content">
        <div class="page-header">
            <h1>Nouvelle Tournée</h1>
        </div>
        
        <?php if ($error): ?>
            <div class="alert alert-error"><?php echo escapeHtml($error); ?></div>
        <?php endif; ?>
        
        <form method="POST" class="card">
            <div class="card-body">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="name">Nom de la tournée</label>
                        <input type="text" id="name" name="name" class="form-control" placeholder="Ex: Tournée Paris Centre">
                    </div>
                    
                    <div class="form-group">
                        <label for="date">Date *</label>
                        <input type="date" id="date" name="date" required class="form-control" value="<?php echo date('Y-m-d'); ?>">
                    </div>
                </div>
                
                <div class="form-group full-width mt-4">
                    <label>Sélectionnez les prospects *</label>
                    <div style="max-height: 400px; overflow-y: auto; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px;">
                        <?php foreach ($prospects as $prospect): ?>
                            <div style="padding: 12px; border-bottom: 1px solid #F3F4F6;">
                                <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                                    <input type="checkbox" name="prospect_ids[]" value="<?php echo $prospect['id']; ?>" style="width: 18px; height: 18px;">
                                    <div style="flex: 1;">
                                        <strong><?php echo escapeHtml($prospect['name']); ?></strong>
                                        <div class="text-sm text-muted">
                                            <?php echo escapeHtml($prospect['address']); ?>, <?php echo escapeHtml($prospect['city']); ?>
                                        </div>
                                    </div>
                                    <span class="badge badge-<?php echo $prospect['status']; ?>">
                                        <?php echo getStatusLabel($prospect['status']); ?>
                                    </span>
                                </label>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
            
            <div class="card-footer">
                <button type="submit" class="btn btn-primary">Créer la tournée</button>
                <a href="planning.php" class="btn btn-secondary">Annuler</a>
            </div>
        </form>
    </div>
</div>
<?php include 'includes/footer.php'; ?>

