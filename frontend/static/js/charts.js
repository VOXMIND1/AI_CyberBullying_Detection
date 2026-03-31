// VoxMind - Charts & Visualizations
// Extend this file to add Chart.js graphs to the dashboard.
// Example: toxicity trend over time, risk distribution pie chart, etc.

// Currently the dashboard uses plain CSS bars.
// To add Chart.js:
//   1. Add CDN in dashboard.html: <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js">
//   2. Add a <canvas id="trendChart"> in dashboard.html
//   3. Initialize here:
//
// const ctx = document.getElementById('trendChart').getContext('2d');
// const trendChart = new Chart(ctx, {
//   type: 'line',
//   data: { labels: [], datasets: [{ label: 'Toxicity %', data: [], borderColor: '#ff3b30' }] },
//   options: { responsive: true, animation: false }
// });
//
// Then call trendChart.data.labels.push(ts) and trendChart.update() on each message.
