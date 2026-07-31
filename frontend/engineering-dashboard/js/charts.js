/**
 * charts.js — Chart.js Analytics with Dark Theme
 */

Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = '#1e293b';
Chart.defaults.font.family = 'Inter';

function initCharts() {
  // Only init if user is logged in
  if (typeof Auth !== 'undefined' && !Auth.isLoggedIn()) return;
  
  // Query Volume Chart (Bar)
  const queryCanvas = document.getElementById('queryChart');
  if (queryCanvas) {
    new Chart(queryCanvas, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          { label: 'Successful', data: [420, 380, 510, 470, 540, 280, 350], backgroundColor: 'rgba(99, 102, 241, 0.7)', borderColor: '#6366f1', borderWidth: 1, borderRadius: 6 },
          { label: 'Failed', data: [25, 18, 32, 22, 28, 12, 15], backgroundColor: 'rgba(239, 68, 68, 0.7)', borderColor: '#ef4444', borderWidth: 1, borderRadius: 6 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: '#1e293b' }, beginAtZero: true, ticks: { color: '#94a3b8' } } }
      }
    });
  }
  
  // Response Distribution (Doughnut)
  const responseCanvas = document.getElementById('responseChart');
  if (responseCanvas) {
    new Chart(responseCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Successful (94.2%)', 'Client Errors (3.1%)', 'Server Errors (1.8%)', 'Timeouts (0.9%)'],
        datasets: [{ data: [94.2, 3.1, 1.8, 0.9], backgroundColor: ['#6366f1', '#f59e0b', '#ef4444', '#64748b'], borderColor: '#151c2c', borderWidth: 3 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '70%',
        plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
      }
    });
  }
  
  // Response Time Trend (Line)
  const rtCanvas = document.getElementById('responseTimeChart');
  if (rtCanvas) {
    const ctx = rtCanvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
    new Chart(rtCanvas, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        datasets: [{ label: 'Avg Response Time (ms)', data: [520, 480, 410, 350, 340], borderColor: '#10b981', backgroundColor: gradient, fill: true, tension: 0.4, pointBackgroundColor: '#10b981', pointBorderColor: '#10b981', pointRadius: 5, pointHoverRadius: 8 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { grid: { display: false } }, y: { grid: { color: '#1e293b' }, ticks: { callback: val => val + 'ms' } } }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initCharts);
