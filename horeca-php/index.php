<?php
/**
 * Page de Login
 * HORECA Prospection
 */

require_once 'config/config.php';

// Si déjà connecté, rediriger vers dashboard
if (isLoggedIn()) {
    redirect('dashboard.php');
}

$error = '';

// Traitement du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        $error = 'Veuillez remplir tous les champs';
    } else {
        try {
            $db = getDbConnection();
            $stmt = $db->prepare("SELECT * FROM users WHERE email = ? AND active = 1");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password'])) {
                // Login réussi
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['user_first_name'] = $user['first_name'];
                $_SESSION['user_last_name'] = $user['last_name'];
                $_SESSION['user_role'] = $user['role'];
                
                redirect('dashboard.php');
            } else {
                $error = 'Email ou mot de passe incorrect';
            }
        } catch (PDOException $e) {
            $error = 'Erreur de connexion';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="login-page">
    <div class="login-container">
        <div class="login-box">
            <div class="login-header">
                <h1>HORECA</h1>
                <p>Prospection Commerciale</p>
            </div>
            
            <?php if ($error): ?>
                <div class="alert alert-error">
                    <?php echo escapeHtml($error); ?>
                </div>
            <?php endif; ?>
            
            <form method="POST" action="" class="login-form">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        autofocus
                        value="<?php echo escapeHtml($_POST['email'] ?? ''); ?>"
                        placeholder="votre@email.com"
                    >
                </div>
                
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required
                        placeholder="••••••••"
                    >
                </div>
                
                <button type="submit" class="btn btn-primary btn-block">
                    Se connecter
                </button>
            </form>
            
            <div class="login-footer">
                <p class="text-muted">Comptes de démonstration :</p>
                <small class="text-muted">
                    admin@horeca-prospection.com / Admin123!<br>
                    manager@horeca-prospection.com / Admin123!<br>
                    commercial@horeca-prospection.com / Admin123!
                </small>
            </div>
        </div>
    </div>
</body>
</html>

