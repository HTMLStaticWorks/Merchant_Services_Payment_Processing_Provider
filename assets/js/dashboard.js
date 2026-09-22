document.addEventListener('DOMContentLoaded', () => {
  // Navigation Logic
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-target]');
  const dashboardSections = document.querySelectorAll('.dashboard-section');
  const topbarTitle = document.getElementById('topbarTitle');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Ignore if it's a real link (like logout)
      if (!link.hasAttribute('data-target')) return;
      e.preventDefault();
      
      const targetId = link.getAttribute('data-target');
      
      // Update active link
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Update active section
      dashboardSections.forEach(sec => sec.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');

      // Update Title
      topbarTitle.innerText = link.innerText.trim();

      // Close mobile sidebar if open
      document.getElementById('sidebar').classList.remove('open');
    });
  });

  // Mobile Sidebar Toggle
  const openBtn = document.getElementById('openSidebar');
  const closeBtn = document.getElementById('closeSidebar');
  const sidebar = document.getElementById('sidebar');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }

  // Chart.js Mock Data
  const ctx = document.getElementById('volumeChart');
  if (ctx) {
    
    // Check theme to color chart appropriately
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Oct 1', 'Oct 5', 'Oct 10', 'Oct 15', 'Oct 20', 'Oct 25', 'Oct 30'],
        datasets: [{
          label: 'Gross Volume ($)',
          data: [10200, 11500, 10800, 12100, 12450, 14000, 13200],
          borderColor: '#06b6d4', // Accent Color
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#06b6d4'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return '$' + context.parsed.y.toLocaleString();
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: gridColor, drawBorder: false },
            ticks: {
              color: textColor,
              callback: function(value) {
                return '$' + (value / 1000) + 'k';
              }
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: textColor }
          }
        }
      }
    });

    // Handle Theme Change updates for chart
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        // Simple reload to let chart re-render with new CSS variables
        // In a real app, update chart instance properties.
        setTimeout(() => location.reload(), 300); 
      });
    });
  }
});
