document.addEventListener('DOMContentLoaded', () => {
    const chartContainer = document.getElementById('diameterChart');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const startDateInput = document.getElementById('startDate');
    const fetchButton = document.getElementById('fetchButton');

    let myChart = null; // Variável para a instância do gráfico

    // Definir uma data padrão (7 dias atrás a partir de hoje)
    const today = new Date();
    const defaultStartDate = new Date(today);
    defaultStartDate.setDate(today.getDate() - 7);
    startDateInput.value = defaultStartDate.toISOString().split('T')[0];

    // Função para atualizar o gráfico com base na data selecionada
    function updateChart() {
        const startDate = startDateInput.value;
        if (!startDate) {
            alert("Por favor, selecione uma data de início.");
            return;
        }
        
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + 7); // Adiciona 7 dias
        
        // Formatar a data final para o formato YYYY-MM-DD
        const endDateFormatted = end.toISOString().split('T')[0];
        
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        
        fetchData(startDate, endDateFormatted);
    }
    
    // Função para buscar e processar os dados da API da NASA
    async function fetchData(startDate, endDate) {
        const API_KEY = 'DEMO_KEY';
        const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Falha na resposta da rede ou limite de requisições excedido.');
            }
            const data = await response.json();
            
            processData(data);
        } catch (error) {
            loadingMessage.style.display = 'none';
            errorMessage.style.display = 'block';
            console.error('Erro:', error);
        }
    }

    // Função para extrair os diâmetros e criar os dados para o histograma
    function processData(data) {
        const allAsteroids = [];
        const neoByDate = data.near_earth_objects;
        
        if (!neoByDate || Object.keys(neoByDate).length === 0) {
            loadingMessage.textContent = 'Nenhum asteroide encontrado para o período.';
            return;
        }

        for (const date in neoByDate) {
            neoByDate[date].forEach(asteroid => {
                allAsteroids.push(asteroid);
            });
        }
        
        const diameters = allAsteroids.map(asteroid => 
            asteroid.estimated_diameter.meters.estimated_diameter_max
        );
        
        if (diameters.length === 0) {
            loadingMessage.textContent = 'Nenhum asteroide encontrado para o período.';
            return;
        }

        const maxDiameter = Math.max(...diameters);
        const binSize = 50;
        const binCount = Math.ceil(maxDiameter / binSize);
        const histogramBins = new Array(binCount).fill(0);
        
        diameters.forEach(d => {
            const binIndex = Math.floor(d / binSize);
            if (binIndex < binCount) {
                histogramBins[binIndex]++;
            }
        });
        
        loadingMessage.style.display = 'none';
        const labels = histogramBins.map((_, i) => `${i * binSize} - ${(i + 1) * binSize} m`);
        
        createChart(labels, histogramBins);
    }
    
    // Função para criar/atualizar o gráfico usando Chart.js
    function createChart(labels, data) {
        // Se o gráfico já existe, destrua-o para criar um novo
        if (myChart) {
            myChart.destroy();
        }
        
        myChart = new Chart(chartContainer, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Número de Asteroides',
                    data: data,
                    backgroundColor: 'rgba(0, 51, 102, 0.8)',
                    borderColor: 'rgba(0, 51, 102, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Diâmetro Estimado (m)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Contagem de Asteroides'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Chamada inicial para carregar o gráfico quando a página é aberta
    updateChart();
    
    // Adicionar um evento de clique no botão para atualizar o gráfico
    fetchButton.addEventListener('click', updateChart);
});