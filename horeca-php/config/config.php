<?php
/**
 * Configuration Générale
 * HORECA Prospection - Version PHP
 */

// Démarrer la session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Configuration du site
define('SITE_NAME', 'HORECA Prospection');
define('SITE_URL', 'http://votre-domaine.com'); // À modifier

// Fuseau horaire
date_default_timezone_set('Europe/Paris');

// Inclure la connexion base de données
require_once __DIR__ . '/database.php';

// Fonctions utilitaires
function redirect($url) {
    header("Location: $url");
    exit();
}

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        redirect('index.php');
    }
}

function isAdmin() {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

function requireAdmin() {
    requireLogin();
    if (!isAdmin()) {
        redirect('dashboard.php');
    }
}

function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }
    
    return [
        'id' => $_SESSION['user_id'],
        'email' => $_SESSION['user_email'],
        'first_name' => $_SESSION['user_first_name'],
        'last_name' => $_SESSION['user_last_name'],
        'role' => $_SESSION['user_role']
    ];
}

function formatDate($date) {
    return date('d/m/Y', strtotime($date));
}

function formatDateTime($datetime) {
    return date('d/m/Y H:i', strtotime($datetime));
}

function escapeHtml($text) {
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

function getStatusLabel($status) {
    $labels = [
        'to_visit' => 'À visiter',
        'in_progress' => 'En cours',
        'converted' => 'Converti',
        'lost' => 'Perdu',
        'planned' => 'Planifiée',
        'completed' => 'Terminée',
        'cancelled' => 'Annulée',
        'pending' => 'En attente',
        'done' => 'Terminé',
        'skipped' => 'Ignoré'
    ];
    
    return $labels[$status] ?? $status;
}

function getTypeLabel($type) {
    $labels = [
        'hotel' => 'Hôtel',
        'restaurant' => 'Restaurant',
        'traiteur' => 'Traiteur',
        'ecole' => 'École',
        'hopital' => 'Hôpital',
        'autre' => 'Autre'
    ];
    
    return $labels[$type] ?? $type;
}

function getRoleLabel($role) {
    $labels = [
        'admin' => 'Administrateur',
        'manager' => 'Manager',
        'commercial' => 'Commercial'
    ];
    
    return $labels[$role] ?? $role;
}
?>

