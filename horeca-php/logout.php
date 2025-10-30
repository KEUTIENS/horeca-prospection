<?php
/**
 * Déconnexion
 * HORECA Prospection
 */

require_once 'config/config.php';

// Détruire la session
session_destroy();

// Rediriger vers la page de login
redirect('index.php');
?>

