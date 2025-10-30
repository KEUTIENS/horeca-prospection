<?php
/**
 * Configuration Base de Données
 * HORECA Prospection - Version PHP
 */

// À CONFIGURER selon votre hébergement OVH
define('DB_HOST', 'localhost');          // Généralement 'localhost' chez OVH
define('DB_NAME', 'votre_base');         // Nom de votre base MySQL
define('DB_USER', 'votre_user');         // Votre utilisateur MySQL
define('DB_PASS', 'votre_password');     // Votre mot de passe MySQL
define('DB_CHARSET', 'utf8mb4');

// Connexion à la base de données
function getDbConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        die("Erreur de connexion à la base de données : " . $e->getMessage());
    }
}

// Test de connexion (à supprimer en production)
// $db = getDbConnection();
// echo "Connexion réussie !";
?>

