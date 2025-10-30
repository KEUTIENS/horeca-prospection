<?php
$currentPage = basename($_SERVER['PHP_SELF']);
$user = getCurrentUser();
?>
<aside class="sidebar">
    <div class="sidebar-header">
        <h1 class="sidebar-title">HORECA</h1>
        <p style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Prospection</p>
    </div>
    
    <nav class="sidebar-menu">
        <ul>
            <li>
                <a href="dashboard.php" class="sidebar-item <?php echo $currentPage === 'dashboard.php' ? 'active' : ''; ?>">
                    <span>📊</span>
                    <span>Tableau de bord</span>
                </a>
            </li>
            <li>
                <a href="prospects.php" class="sidebar-item <?php echo in_array($currentPage, ['prospects.php', 'prospect-detail.php', 'new-prospect.php', 'edit-prospect.php']) ? 'active' : ''; ?>">
                    <span>👥</span>
                    <span>Prospects</span>
                </a>
            </li>
            <li>
                <a href="planning.php" class="sidebar-item <?php echo $currentPage === 'planning.php' ? 'active' : ''; ?>">
                    <span>📅</span>
                    <span>Planning</span>
                </a>
            </li>
            <li>
                <a href="visits.php" class="sidebar-item <?php echo in_array($currentPage, ['visits.php', 'new-visit.php']) ? 'active' : ''; ?>">
                    <span>📝</span>
                    <span>Rapports</span>
                </a>
            </li>
            <li>
                <a href="stats.php" class="sidebar-item <?php echo $currentPage === 'stats.php' ? 'active' : ''; ?>">
                    <span>📈</span>
                    <span>Statistiques</span>
                </a>
            </li>
            <li>
                <a href="map.php" class="sidebar-item <?php echo $currentPage === 'map.php' ? 'active' : ''; ?>">
                    <span>🗺️</span>
                    <span>Carte</span>
                </a>
            </li>
            <?php if (isAdmin()): ?>
            <li>
                <a href="users.php" class="sidebar-item <?php echo $currentPage === 'users.php' ? 'active' : ''; ?>">
                    <span>🛡️</span>
                    <span>Utilisateurs</span>
                </a>
            </li>
            <?php endif; ?>
        </ul>
    </nav>
    
    <div class="sidebar-footer">
        <div class="user-info">
            <div class="user-avatar">
                <?php echo strtoupper(substr($user['first_name'], 0, 1) . substr($user['last_name'], 0, 1)); ?>
            </div>
            <div class="user-details">
                <p class="user-name"><?php echo escapeHtml($user['first_name'] . ' ' . $user['last_name']); ?></p>
                <p class="user-role"><?php echo getRoleLabel($user['role']); ?></p>
            </div>
        </div>
        <a href="logout.php" class="sidebar-item">
            <span>🚪</span>
            <span>Déconnexion</span>
        </a>
    </div>
</aside>

