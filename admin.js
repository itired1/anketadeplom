const ADMIN_PASSWORD = "admin123";

function checkPassword() {
    const password = document.getElementById('adminPassword').value;
    const errorElement = document.getElementById('passwordError');
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('passwordSection').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        loadAdminData();
    } else {
        errorElement.style.display = 'block';
    }
}

function loadAdminData() {
    const stats = JSON.parse(localStorage.getItem('surveyStats')) || { 
        total: 0, 
        today: 0, 
        lastDate: new Date().toISOString().split('T')[0],
        history: {}
    };
    
    const today = new Date().toISOString().split('T')[0];
    
    if (stats.lastDate !== today) {
        stats.today = 0;
        stats.lastDate = today;
    }
    
    document.getElementById('adminTotal').textContent = stats.total;
    document.getElementById('adminToday').textContent = stats.today;
    
    const daysSinceStart = 30;
    document.getElementById('adminAvg').textContent = Math.round(stats.total / Math.max(daysSinceStart, 1));
    
    const lastUpdate = new Date().toLocaleString('ru-RU');
    document.getElementById('adminLastUpdate').textContent = lastUpdate;
    
    loadChart(stats);
}

function loadChart(stats) {
    const days = [];
    const clicks = [];
    
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        days.push(formatDate(date));
        clicks.push(stats.history && stats.history[dateStr] ? stats.history[dateStr] : 0);
    }
    
    const ctx = document.getElementById('clicksChart').getContext('2d');
    
    if (window.clicksChart) {
        window.clicksChart.destroy();
    }
    
    window.clicksChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Переходы на опрос',
                data: clicks,
                borderColor: 'rgb(138, 43, 226)',
                backgroundColor: 'rgba(138, 43, 226, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b3b3cc',
                        callback: function(value) {
                            return value;
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b3b3cc'
                    }
                }
            }
        }
    });
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}.${month}`;
}

function resetStats() {
    if (confirm('Вы уверены, что хотите сбросить всю статистику?')) {
        localStorage.setItem('surveyStats', JSON.stringify({
            total: 0,
            today: 0,
            lastDate: new Date().toISOString().split('T')[0],
            history: {}
        }));
        loadAdminData();
        alert('Статистика сброшена!');
    }
}

function addTestData() {
    const stats = JSON.parse(localStorage.getItem('surveyStats')) || {
        total: 0,
        today: 0,
        lastDate: new Date().toISOString().split('T')[0],
        history: {}
    };
    
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        if (!stats.history[dateStr]) {
            const randomClicks = Math.floor(Math.random() * 50) + 10;
            stats.history[dateStr] = randomClicks;
            stats.total += randomClicks;
            
            if (i === 0) {
                stats.today = randomClicks;
            }
        }
    }
    
    localStorage.setItem('surveyStats', JSON.stringify(stats));
    loadAdminData();
    alert('Тестовые данные добавлены!');
}

function exportStats() {
    const stats = JSON.parse(localStorage.getItem('surveyStats')) || {};
    const dataStr = JSON.stringify(stats, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `itiredmp3-stats-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const password = urlParams.get('password');
    
    if (password === ADMIN_PASSWORD) {
        checkPassword();
    }
});

setInterval(loadAdminData, 30000);