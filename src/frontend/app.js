document.addEventListener('DOMContentLoaded', () => {
    const chartContainer = document.getElementById('diameterChart');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Função para buscar e processar os dados da API da NASA
    async function fetchData() {
        // Use a chave de demonstração. Você pode obter a sua em api.nasa.gov
        const API_KEY = 'DEMO_KEY';
        // Endpoint da API que retorna aproximações próximas da Terra em um período de 7 dias
        const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=2025-08-25&end_date=2025-08-31&api_key=342GGLEA69cncFbbTGwXky7cIghXOiLQuIFfmpDi`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Falha na resposta da rede.');
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
        
        // A API retorna um objeto com chaves de data. Precisamos extrair todos os asteroides.
        const neoByDate = data.near_earth_objects;
        for (const date in neoByDate) {
            neoByDate[date].forEach(asteroid => {
                allAsteroids.push(asteroid);
            });
        }
        
        // Extrair o diâmetro máximo estimado em metros
        const diameters = allAsteroids.map(asteroid => 
            asteroid.estimated_diameter.meters.estimated_diameter_max
        );
        
        if (diameters.length === 0) {
            loadingMessage.textContent = 'Nenhum asteroide encontrado para o período.';
            return;
        }

        // Criar as faixas (bins) para o histograma
        const maxDiameter = Math.max(...diameters);
        const binSize = 50; // Cada barra representa uma faixa de 50 metros
        const binCount = Math.ceil(maxDiameter / binSize);
        const histogramBins = new Array(binCount).fill(0);
        
        // Contar quantos asteroides caem em cada faixa
        diameters.forEach(d => {
            const binIndex = Math.floor(d / binSize);
            if (binIndex < binCount) {
                histogramBins[binIndex]++;
            }
        });
        
        loadingMessage.style.display = 'none';
        
        // Rotular as faixas
        const labels = histogramBins.map((_, i) => `${i * binSize} - ${(i + 1) * binSize} m`);
        
        createChart(labels, histogramBins);
    }

    // Função para criar o gráfico usando Chart.js
    function createChart(labels, data) {
        new Chart(chartContainer, {
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

    fetchData();
});