<?php
/**
 * Liste des Prospects
 * HORECA Prospection
 */

require_once 'config/config.php';
requireLogin();

$pageTitle = 'Prospects';
$db = getDbConnection();

// Paramètres de recherche/filtres
$search = $_GET['search'] ?? '';
$type_filter = $_GET['type'] ?? '';
$status_filter = $_GET['status'] ?? '';
$city_filter = $_GET['city'] ?? '';

// Construction de la requête
$sql = "SELECT * FROM prospects WHERE 1=1";
$params = [];

if ($search) {
    $sql .= " AND (name LIKE ? OR city LIKE ? OR manager_name LIKE ?)";
    $search_param = "%$search%";
    $params[] = $search_param;
    $params[] = $search_param;
    $params[] = $search_param;
}

if ($type_filter) {
    $sql .= " AND type = ?";
    $params[] = $type_filter;
}

if ($status_filter) {
    $sql .= " AND status = ?";
    $params[] = $status_filter;
}

if ($city_filter) {
    $sql .= " AND city LIKE ?";
    $params[] = "%$city_filter%";
}

$sql .= " ORDER BY created_at DESC";

try {
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $prospects = $stmt->fetchAll();
} catch (PDOException $e) {
    $error = "Erreur lors du chargement des prospects";
    $prospects = [];
}

include 'includes/header.php';
include 'includes/sidebar.php';
?>

<div class="main-content">
    <div class="content">
        <div class="page-header">
            <div>
                <h1>Prospects & Clients</h1>
                <p class="text-muted"><?php echo count($prospects); ?> prospect(s) trouvé(s)</p>
            </div>
            <a href="new-prospect.php" class="btn btn-primary">
                ➕ Nouveau prospect
            </a>
        </div>
        
        <!-- Filtres -->
        <div class="card mb-4">
            <div class="card-body">
                <form method="GET" action="" class="filter-form">
                    <div class="form-row">
                        <div class="form-group">
                            <input 
                                type="text" 
                                name="search" 
                                placeholder="Rechercher..." 
                                value="<?php echo escapeHtml($search); ?>"
                                class="form-control"
                            >
                        </div>
                        
                        <div class="form-group">
                            <select name="type" class="form-control">
                                <option value="">Tous les types</option>
                                <option value="hotel" <?php echo $type_filter === 'hotel' ? 'selected' : ''; ?>>Hôtel</option>
                                <option value="restaurant" <?php echo $type_filter === 'restaurant' ? 'selected' : ''; ?>>Restaurant</option>
                                <option value="traiteur" <?php echo $type_filter === 'traiteur' ? 'selected' : ''; ?>>Traiteur</option>
                                <option value="ecole" <?php echo $type_filter === 'ecole' ? 'selected' : ''; ?>>École</option>
                                <option value="hopital" <?php echo $type_filter === 'hopital' ? 'selected' : ''; ?>>Hôpital</option>
                                <option value="autre" <?php echo $type_filter === 'autre' ? 'selected' : ''; ?>>Autre</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <select name="status" class="form-control">
                                <option value="">Tous les statuts</option>
                                <option value="to_visit" <?php echo $status_filter === 'to_visit' ? 'selected' : ''; ?>>À visiter</option>
                                <option value="in_progress" <?php echo $status_filter === 'in_progress' ? 'selected' : ''; ?>>En cours</option>
                                <option value="converted" <?php echo $status_filter === 'converted' ? 'selected' : ''; ?>>Converti</option>
                                <option value="lost" <?php echo $status_filter === 'lost' ? 'selected' : ''; ?>>Perdu</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn btn-secondary">🔍 Filtrer</button>
                        
                        <?php if ($search || $type_filter || $status_filter || $city_filter): ?>
                            <a href="prospects.php" class="btn btn-outline">❌ Réinitialiser</a>
                        <?php endif; ?>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Liste des prospects -->
        <?php if (empty($prospects)): ?>
            <div class="card">
                <div class="card-body text-center">
                    <p class="text-muted">Aucun prospect trouvé</p>
                    <a href="new-prospect.php" class="btn btn-primary mt-3">Créer le premier prospect</a>
                </div>
            </div>
        <?php else: ?>
            <div class="card">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Type</th>
                                <th>Ville</th>
                                <th>Contact</th>
                                <th>Statut</th>
                                <th>Note</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($prospects as $prospect): ?>
                                <tr>
                                    <td>
                                        <a href="prospect-detail.php?id=<?php echo $prospect['id']; ?>" class="prospect-link">
                                            <strong><?php echo escapeHtml($prospect['name']); ?></strong>
                                        </a>
                                    </td>
                                    <td>
                                        <span class="badge badge-type"><?php echo getTypeLabel($prospect['type']); ?></span>
                                    </td>
                                    <td><?php echo escapeHtml($prospect['city']); ?></td>
                                    <td>
                                        <?php if ($prospect['phone']): ?>
                                            <div class="text-sm"><?php echo escapeHtml($prospect['phone']); ?></div>
                                        <?php endif; ?>
                                        <?php if ($prospect['email']): ?>
                                            <div class="text-sm text-muted"><?php echo escapeHtml($prospect['email']); ?></div>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <span class="badge badge-<?php echo $prospect['status']; ?>">
                                            <?php echo getStatusLabel($prospect['status']); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <?php if ($prospect['note_avg'] > 0): ?>
                                            <span class="score-badge"><?php echo number_format($prospect['note_avg'], 1); ?>⭐</span>
                                        <?php else: ?>
                                            <span class="text-muted">-</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <a href="prospect-detail.php?id=<?php echo $prospect['id']; ?>" class="btn btn-sm btn-outline" title="Voir">👁️</a>
                                            <a href="edit-prospect.php?id=<?php echo $prospect['id']; ?>" class="btn btn-sm btn-outline" title="Modifier">✏️</a>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php include 'includes/footer.php'; ?>

