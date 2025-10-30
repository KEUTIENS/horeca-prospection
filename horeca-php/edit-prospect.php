<?php
require_once 'config/config.php';
requireLogin();
$pageTitle = 'Modifier Prospect';
$db = getDbConnection();

$id = $_GET['id'] ?? 0;
if (!$id) redirect('prospects.php');

$error = '';
$success = '';

try {
    $stmt = $db->prepare("SELECT * FROM prospects WHERE id = ?");
    $stmt->execute([$id]);
    $prospect = $stmt->fetch();
    if (!$prospect) redirect('prospects.php');
} catch (PDOException $e) {
    die("Erreur");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    
    if (empty($name)) {
        $error = 'Le nom est obligatoire';
    } else {
        try {
            $stmt = $db->prepare("UPDATE prospects SET name=?, type=?, address=?, postal_code=?, city=?, country=?, phone=?, email=?, website=?, manager_name=?, status=? WHERE id=?");
            $stmt->execute([
                $name,
                $_POST['type'] ?? 'autre',
                trim($_POST['address'] ?? ''),
                trim($_POST['postal_code'] ?? ''),
                trim($_POST['city'] ?? ''),
                trim($_POST['country'] ?? 'France'),
                trim($_POST['phone'] ?? ''),
                trim($_POST['email'] ?? ''),
                trim($_POST['website'] ?? ''),
                trim($_POST['manager_name'] ?? ''),
                $_POST['status'] ?? 'to_visit',
                $id
            ]);
            redirect('prospect-detail.php?id=' . $id);
        } catch (PDOException $e) {
            $error = 'Erreur lors de la modification';
        }
    }
} else {
    $_POST = $prospect;
}

include 'includes/header.php';
include 'includes/sidebar.php';
?>
<div class="main-content">
    <div class="content">
        <div class="page-header">
            <h1>Modifier: <?php echo escapeHtml($prospect['name']); ?></h1>
        </div>
        
        <?php if ($error): ?>
            <div class="alert alert-error"><?php echo escapeHtml($error); ?></div>
        <?php endif; ?>
        
        <form method="POST" class="card">
            <div class="card-body">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="name">Nom *</label>
                        <input type="text" id="name" name="name" required class="form-control" value="<?php echo escapeHtml($_POST['name'] ?? ''); ?>">
                    </div>
                    <div class="form-group">
                        <label for="type">Type</label>
                        <select id="type" name="type" class="form-control">
                            <option value="hotel" <?php echo $_POST['type'] === 'hotel' ? 'selected' : ''; ?>>Hôtel</option>
                            <option value="restaurant" <?php echo $_POST['type'] === 'restaurant' ? 'selected' : ''; ?>>Restaurant</option>
                            <option value="traiteur" <?php echo $_POST['type'] === 'traiteur' ? 'selected' : ''; ?>>Traiteur</option>
                            <option value="ecole" <?php echo $_POST['type'] === 'ecole' ? 'selected' : ''; ?>>École</option>
                            <option value="hopital" <?php echo $_POST['type'] === 'hopital' ? 'selected' : ''; ?>>Hôpital</option>
                            <option value="autre" <?php echo $_POST['type'] === 'autre' ? 'selected' : ''; ?>>Autre</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="address">Adresse</label>
                        <input type="text" id="address" name="address" class="form-control" value="<?php echo escapeHtml($_POST['address'] ?? ''); ?>">
                    </div>
                    <div class="form-group">
                        <label for="postal_code">Code postal</label>
                        <input type="text" id="postal_code" name="postal_code" class="form-control" value="<?php echo escapeHtml($_POST['postal_code'] ?? ''); ?>">
                    </div>
                    <div class="form-group">
                        <label for="city">Ville</label>
                        <input type="text" id="city" name="city" class="form-control" value="<?php echo escapeHtml($_POST['city'] ?? ''); ?>">
                    </div>
                    <div class="form-group">
                        <label for="phone">Téléphone</label>
                        <input type="tel" id="phone" name="phone" class="form-control" value="<?php echo escapeHtml($_POST['phone'] ?? ''); ?>">
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" class="form-control" value="<?php echo escapeHtml($_POST['email'] ?? ''); ?>">
                    </div>
                    <div class="form-group">
                        <label for="manager_name">Responsable</label>
                        <input type="text" id="manager_name" name="manager_name" class="form-control" value="<?php echo escapeHtml($_POST['manager_name'] ?? ''); ?>">
                    </div>
                    <div class="form-group">
                        <label for="status">Statut</label>
                        <select id="status" name="status" class="form-control">
                            <option value="to_visit" <?php echo $_POST['status'] === 'to_visit' ? 'selected' : ''; ?>>À visiter</option>
                            <option value="in_progress" <?php echo $_POST['status'] === 'in_progress' ? 'selected' : ''; ?>>En cours</option>
                            <option value="converted" <?php echo $_POST['status'] === 'converted' ? 'selected' : ''; ?>>Converti</option>
                            <option value="lost" <?php echo $_POST['status'] === 'lost' ? 'selected' : ''; ?>>Perdu</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button type="submit" class="btn btn-primary">Enregistrer</button>
                <a href="prospect-detail.php?id=<?php echo $id; ?>" class="btn btn-secondary">Annuler</a>
            </div>
        </form>
    </div>
</div>
<?php include 'includes/footer.php'; ?>

