<?php
require_once 'config/config.php';
requireLogin();
$pageTitle = 'Carte';
$db = getDbConnection();

try {
    $stmt = $db->query("SELECT id, name, type, city, status, latitude, longitude FROM prospects WHERE latitude IS NOT NULL AND longitude IS NOT NULL");
    $prospects = $stmt->fetchAll();
} catch (PDOException $e) {
    $prospects = [];
}

include 'includes/header.php';
include 'includes/sidebar.php';
?>
<div class="main-content">
    <div class="content">
        <div class="page-header">
            <h1>Carte des Prospects</h1>
            <p class="text-muted"><?php echo count($prospects); ?> prospect(s) géolocalisé(s)</p>
        </div>
        
        <div class="card">
            <div id="map" style="height: 600px; width: 100%;"></div>
        </div>
    </div>
</div>

<script>
const map = L.map('map').setView([48.8566, 2.3522], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

const prospects = <?php echo json_encode($prospects); ?>;

const statusColors = {
    'to_visit': '#F59E0B',
    'in_progress': '#2563EB',
    'converted': '#10B981',
    'lost': '#EF4444'
};

prospects.forEach(prospect => {
    if (prospect.latitude && prospect.longitude) {
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="width:16px;height:16px;border-radius:50%;background:${statusColors[prospect.status] || '#6B7280'};border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        
        L.marker([prospect.latitude, prospect.longitude], { icon })
            .bindPopup(`<strong>${prospect.name}</strong><br>${prospect.city}<br><a href="prospect-detail.php?id=${prospect.id}">Voir détails</a>`)
            .addTo(map);
    }
});

if (prospects.length > 0) {
    const bounds = L.latLngBounds(prospects.map(p => [p.latitude, p.longitude]));
    map.fitBounds(bounds, { padding: [50, 50] });
}
</script>

<?php include 'includes/footer.php'; ?>

