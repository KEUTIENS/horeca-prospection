<?php
require_once 'config/config.php';
requireLogin();
$pageTitle = 'Nouveau Prospect';
$db = getDbConnection();
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $type = $_POST['type'] ?? 'autre';
    $address = trim($_POST['address'] ?? '');
    $postal_code = trim($_POST['postal_code'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $country = trim($_POST['country'] ?? 'France');
    $phone = trim($_POST['phone'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $website = trim($_POST['website'] ?? '');
    $manager_name = trim($_POST['manager_name'] ?? '');
    $status = $_POST['status'] ?? 'to_visit';
    
    if (empty($name)) {
        $error = 'Le nom est obligatoire';
    } else {
        try {
            $stmt = $db->prepare("INSERT INTO prospects (name, type, address, postal_code, city, country, phone, email, website, manager_name, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $type, $address, $postal_code, $city, $country, $phone, $email, $website, $manager_name, $status, $_SESSION['user_id']]);
            $success = 'Prospect créé avec succès';
            redirect('prospects.php');
        } catch (PDOException $e) {
            $error = 'Erreur lors de la création';
        }
    }
}

include 'includes/header.php';
include 'includes/sidebar.php';
?>
<div class="main-content">
    <div class="content">
        <div class="page-header">
            <h1>Nouveau Prospect</h1>
        </div>
        
        <?php if ($error): ?>
            <div class="alert alert-error"><?php echo escapeHtml($error); ?></div>
        <?php endif; ?>
        
        <form method="POST" class="card">
            <div class="card-body">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="name">Nom de l'établissement *</label>
                        <input type="text" id="name" name="name" required class="form-control" value="<?php echo escapeHtml($_POST['name'] ?? ''); ?>">
                    </div>
                    
                    <div class="form-group">
                        <label for="type">Type *</label>
                        <select id="type" name="type" class="form-control">
                            <option value="hotel">Hôtel</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="traiteur">Traiteur</option>
                            <option value="ecole">École</option>
                            <option value="hopital">Hôpital</option>
                            <option value="autre">Autre</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="address">Adresse</label>
                        <input type="text" id="address" name="address" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label for="postal_code">Code postal</label>
                        <input type="text" id="postal_code" name="postal_code" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label for="city">Ville</label>
                        <input type="text" id="city" name="city" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label for="country">Pays</label>
                        <input type="text" id="country" name="country" value="France" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Téléphone</label>
                        <input type="tel" id="phone" name="phone" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label for="website">Site web</label>
                        <input type="url" id="website" name="website" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label for="manager_name">Nom du responsable</label>
                        <input type="text" id="manager_name" name="manager_name" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label for="status">Statut</label>
                        <select id="status" name="status" class="form-control">
                            <option value="to_visit">À visiter</option>
                            <option value="in_progress">En cours</option>
                            <option value="converted">Converti</option>
                            <option value="lost">Perdu</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="card-footer">
                <button type="submit" class="btn btn-primary">Créer le prospect</button>
                <a href="prospects.php" class="btn btn-secondary">Annuler</a>
            </div>
        </form>
    </div>
</div>
<?php include 'includes/footer.php'; ?>

