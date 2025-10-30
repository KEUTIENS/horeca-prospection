<?php
require_once 'config/config.php';
requireLogin();
$pageTitle = 'Statistiques';
$db = getDbConnection();

try {
    $stmt = $db->query("SELECT DATE_FORMAT(visited_at, '%Y-%m') as month, COUNT(*) as count FROM visits GROUP BY month ORDER BY month DESC LIMIT 12");
    $visits_by_month = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    
    $stmt = $db->query("SELECT type, COUNT(*) as count FROM prospects GROUP BY type");
    $prospects_by_type = $stmt->fetchAll();
    
    $stmt = $db->query("SELECT status, COUNT(*) as count FROM prospects GROUP BY status");
    $prospects_by_status = $stmt->fetchAll();
} catch (PDOException $e) {}

include 'includes/header.php';
include 'includes/sidebar.php';
?>
<div class="main-content">
    <div class="content">
        <div class="page-header">
            <h1>Statistiques</h1>
        </div>
        
        <div class="dashboard-grid">
            <div class="card">
                <div class="card-header"><h3>Visites par mois</h3></div>
                <div class="card-body">
                    <canvas id="visitsChart"></canvas>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header"><h3>Prospects par type</h3></div>
                <div class="card-body">
                    <canvas id="typesChart"></canvas>
                </div>
            </div>
        </div>
        
        <div class="card mt-4">
            <div class="card-header"><h3>Prospects par statut</h3></div>
            <div class="card-body">
                <canvas id="statusChart" style="max-height: 300px;"></canvas>
            </div>
        </div>
    </div>
</div>

<script>
const visitsData = <?php echo json_encode(array_reverse($visits_by_month, true)); ?>;
const typesData = <?php echo json_encode($prospects_by_type); ?>;
const statusData = <?php echo json_encode($prospects_by_status); ?>;

const visitsChart = new Chart(document.getElementById('visitsChart'), {
    type: 'line',
    data: {
        labels: Object.keys(visitsData),
        datasets: [{
            label: 'Visites',
            data: Object.values(visitsData),
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.4
        }]
    },
    options: { responsive: true, maintainAspectRatio: true }
});

const typesChart = new Chart(document.getElementById('typesChart'), {
    type: 'doughnut',
    data: {
        labels: typesData.map(d => d.type),
        datasets: [{
            data: typesData.map(d => d.count),
            backgroundColor: ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280']
        }]
    },
    options: { responsive: true, maintainAspectRatio: true }
});

const statusChart = new Chart(document.getElementById('statusChart'), {
    type: 'bar',
    data: {
        labels: statusData.map(d => d.status),
        datasets: [{
            label: 'Prospects',
            data: statusData.map(d => d.count),
            backgroundColor: ['#F59E0B', '#2563EB', '#10B981', '#EF4444']
        }]
    },
    options: { responsive: true, maintainAspectRatio: false }
});
</script>

<?php include 'includes/footer.php'; ?>

