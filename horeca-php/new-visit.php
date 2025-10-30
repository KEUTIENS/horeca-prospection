<?php
require_once 'config/config.php';
requireLogin();
$pageTitle = 'Nouvelle Visite';
$db = getDbConnection();

$prospect_id = $_GET['prospect_id'] ?? 0;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $prospect_id = $_POST['prospect_id'] ?? 0;
    
    if (!$prospect_id) {
        $error = 'Veuillez sélectionner un prospect';
    } else {
        try {
            $stmt = $db->prepare("INSERT INTO visits (prospect_id, user_id, visited_at, duration_minutes, objective, summary, score, signed_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $prospect_id,
                $_SESSION['user_id'],
                $_POST['visited_at'],
                $_POST['duration_minutes'] ?: null,
                $_POST['objective'] ?: null,
                $_POST['summary'] ?: null,
                $_POST['score'] ?: null,
                $_POST['signed_by'] ?: null
            ]);
            redirect('prospect-detail.php?id=' . $prospect_id);
        } catch (PDOException $e) {
            $error = 'Erreur';
        }
    }
}

$prospects = [];
try {
    $stmt = $db->query("SELECT id, name, city FROM prospects ORDER BY name");
    $prospects = $stmt->fetchAll();
} catch (PDOException $e) {}

include 'includes/header.php';
include 'includes/sidebar.php';
?>
<div class="main-content">
    <div class="content">
        <div class="page-header">
            <h1>Nouvelle Visite</h1>
        </div>
        
        <?php if ($error): ?>
            <div class="alert alert-error"><?php echo escapeHtml($error); ?></div>
        <?php endif; ?>
        
        <form method="POST" class="card">
            <div class="card-body">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="prospect_id">Prospect *</label>
                        <select id="prospect_id" name="prospect_id" required class="form-control">
                            <option value="">Sélectionnez...</option>
                            <?php foreach ($prospects as $p): ?>
                                <option value="<?php echo $p['id']; ?>" <?php echo $prospect_id == $p['id'] ? 'selected' : ''; ?>>
                                    <?php echo escapeHtml($p['name']); ?> (<?php echo escapeHtml($p['city']); ?>)
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="visited_at">Date et heure *</label>
                        <input type="datetime-local" id="visited_at" name="visited_at" required class="form-control" value="<?php echo date('Y-m-d\TH:i'); ?>">
                    </div>
                    
                    <div class="form-group">
                        <label for="duration_minutes">Durée (minutes)</label>
                        <input type="number" id="duration_minutes" name="duration_minutes" class="form-control" min="1">
                    </div>
                    
                    <div class="form-group">
                        <label for="score">Note (1-5)</label>
                        <select id="score" name="score" class="form-control">
                            <option value="">-</option>
                            <option value="1">⭐ 1/5</option>
                            <option value="2">⭐⭐ 2/5</option>
                            <option value="3">⭐⭐⭐ 3/5</option>
                            <option value="4">⭐⭐⭐⭐ 4/5</option>
                            <option value="5">⭐⭐⭐⭐⭐ 5/5</option>
                        </select>
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="objective">Objectif</label>
                        <textarea id="objective" name="objective" rows="2" class="form-control"></textarea>
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="summary">Résumé</label>
                        <textarea id="summary" name="summary" rows="4" class="form-control"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="signed_by">Signé par</label>
                        <input type="text" id="signed_by" name="signed_by" class="form-control">
                    </div>
                </div>
            </div>
            
            <div class="card-footer">
                <button type="submit" class="btn btn-primary">Enregistrer</button>
                <a href="visits.php" class="btn btn-secondary">Annuler</a>
            </div>
        </form>
    </div>
</div>
<?php include 'includes/footer.php'; ?>

