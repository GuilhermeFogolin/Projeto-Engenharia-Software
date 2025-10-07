import { useState, useEffect, use } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import {BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const bgVideo = import.meta.env.VITE_BG_VIDEO_URL;

// --- DADOS MOCKADOS ---
// Substitua isso pela sua chamada de API real
const mockApiData = [
  { nome: "Asteroid A", e_potencialmente_perigoso: true, data_aproximacao: "2023-01-15", velocidade_relativa: { quilometros_por_hora: "35000" }, diametro_estimado: { metros: { estimated_diameter_max: 300 } } },
  { nome: "Asteroid B", e_potencialmente_perigoso: false, data_aproximacao: "2023-05-20", velocidade_relativa: { quilometros_por_hora: "45000" }, diametro_estimado: { metros: { estimated_diameter_max: 150 } } },
  { nome: "Asteroid C", e_potencialmente_perigoso: true, data_aproximacao: "2024-02-10", velocidade_relativa: { quilometros_por_hora: "25000" }, diametro_estimado: { metros: { estimated_diameter_max: 500 } } },
  { nome: "Asteroid D", e_potencialmente_perigoso: false, data_aproximacao: "2024-08-01", velocidade_relativa: { quilometros_por_hora: "55000" }, diametro_estimado: { metros: { estimated_diameter_max: 80 } } },
  { nome: "Asteroid E", e_potencialmente_perigoso: false, data_aproximacao: "2025-01-01", velocidade_relativa: { quilometros_por_hora: "48000" }, diametro_estimado: { metros: { estimated_diameter_max: 220 } } },
  { nome: "Asteroid F", e_potencialmente_perigoso: true, data_aproximacao: "2025-11-30", velocidade_relativa: { quilometros_por_hora: "65000" }, diametro_estimado: { metros: { estimated_diameter_max: 800 } } },
];

// --- COMPONENTES DE GRÁFICO ---

// Gráfico 1: Contagem de asteroides por ano
const AsteroidsByYearChart = ({ data }) => {
  const yearCounts = data.reduce((acc, item) => {
    const year = new Date(item.data_aproximacao).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(yearCounts).map(year => ({
    year: year,
    count: yearCounts[year],
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="year" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
        <Bar dataKey="count" name="Asteroides" fill="#B7AD4F" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Gráfico 2: Distribuição de Velocidade
const VelocityDistributionChart = ({ data }) => {
    const velocityData = data.map(item => ({
        name: item.nome,
        velocity: parseFloat(item.velocidade_relativa.quilometros_por_hora)
    }));
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" hide />
                <YAxis stroke="#888" />
                <Tooltip formatter={(value) => `${value.toLocaleString('pt-BR')} km/h`} contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
                <Bar dataKey="velocity" name="Velocidade" fill="#B7AD4F" />
            </BarChart>
        </ResponsiveContainer>
    );
};


// Gráfico 3: Distribuição de Tamanho
const SizeDistributionChart = ({ data }) => {
    const sizeData = data.map(item => ({
        name: item.nome,
        diameter: item.diametro_estimado.metros.estimated_diameter_max
    }));
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sizeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" hide />
                <YAxis stroke="#888" />
                <Tooltip formatter={(value) => `${Math.round(value)} m`} contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
                <Bar dataKey="diameter" name="Diâmetro Máx." fill="#B7AD4F" />
            </BarChart>
        </ResponsiveContainer>
    );
};


// Gráfico 4: Proporção de Asteroides Perigosos
const HazardousPieChart = ({ data }) => {
  const hazardousCount = data.filter(item => item.e_potencialmente_perigoso).length;
  const nonHazardousCount = data.length - hazardousCount;
  const chartData = [
    { name: 'Potencialmente Perigosos', value: hazardousCount },
    { name: 'Não Perigosos', value: nonHazardousCount },
  ];
  const COLORS = ['#8e1515', '#B7AD4F'];

  // Função personalizada para renderizar valor e porcentagem centralizados
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
      >
        {`${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie 
          data={chartData} 
          dataKey="value" 
          nameKey="name" 
          cx="50%" 
          cy="50%" 
          outerRadius={80} 
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#B7AD4F', border: '1px solid #444' }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

function App() {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    // Simula uma chamada de API
    setApiData(mockApiData);
    
  }, []);

  return (
    <div className="app-container">
      <div className="content">
        <div className="hero">
          <div className="bg-layer">
            <video className="bg-video" src={bgVideo} autoPlay loop muted playsInline />
          </div>
        <header className="header">
          <div className="logo">Logo</div>
          <nav className="nav">
            <a href="#curiosidades">Curiosidades</a>
            <a href="#asteroides">Asteroides</a>
            <a href="#sobre-nos">Sobre nós</a>
          </nav>
        </header>
        <main className="main-content">
          <h1>Acenda sua curiosidade, <br /> Amplie seu universo!</h1>
          <button className="cta-button">Conheça mais</button>
        </main>
        </div>

        {/* Segunda seção ("página" abaixo) */}
        <section id="asteroides" className="section-asteroids">
          <h2 className="asteroids-title">Já se perguntou como são formados os asteroides?</h2>
            <div className="asteroid-cards">
              <div className="asteroid-card">
                <div className="icon-wrapper">
                {/* Novo ícone planeta com anel */}
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Planeta principal */}
                  <circle cx="45" cy="45" r="22" fill="#201717" stroke="#b44444" strokeWidth="3" />
                  {/* Faixas internas do planeta */}
                  <circle cx="45" cy="45" r="16" stroke="#8d2f2f" strokeWidth="2" strokeDasharray="6 6" />
                  {/* Anel externo inclinado */}
                  <ellipse cx="45" cy="45" rx="38" ry="14" transform="rotate(-18 45 45)" stroke="#b44444" strokeWidth="3" />
                  {/* Segmento brilhante do anel (efeito) */}
                  <path d="M18 47C26 52 54 59 70 50" stroke="#f3c64d" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
                  {/* Pequenas luas */}
                  <circle cx="63" cy="32" r="5" fill="#f3c64d" />
                  <circle cx="30" cy="60" r="4" fill="#f3c64d" />
                  <circle cx="55" cy="63" r="3.5" fill="#f3c64d" />
                </svg>
              </div>
              <h3>Sobras da formação dos planetas</h3>
              <p>Asteroides são restos da nuvem de poeira e gás que formou o Sistema Solar há 4,6 bilhões de anos.</p>
            </div>
            <div className="asteroid-card">
              <div className="icon-wrapper">
                {/* Ícone rocha / asteroide facetado */}
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 14L66 28L72 46L63 66L47 74L30 68L18 50L22 30L38 16L50 14Z" stroke="#b44444" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M38 16L47 30L63 28" stroke="#8d2f2f" strokeWidth="2" />
                  <path d="M47 30L55 46L63 66" stroke="#8d2f2f" strokeWidth="2" />
                  <path d="M47 30L33 46L30 68" stroke="#8d2f2f" strokeWidth="2" />
                  <path d="M33 46L55 46" stroke="#b44444" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="57" cy="37" r="3.5" fill="#f3c64d" />
                  <circle cx="40" cy="56" r="4" fill="#f3c64d" />
                </svg>
              </div>
              <h3>Blocos incompletos</h3>
              <p>Não viraram planetas porque a gravidade de Júpiter e colisões impediram que se juntassem.</p>
            </div>
            <div className="asteroid-card">
              <div className="icon-wrapper">
                {/* Ícone estilo sistema com órbitas e 4 corpos */}
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Órbita interna */}
                  <ellipse cx="45" cy="45" rx="14" ry="9" transform="rotate(-20 45 45)" stroke="#b44444" strokeWidth="3" />
                  {/* Órbita média */}
                  <ellipse cx="45" cy="45" rx="22" ry="14" transform="rotate(-20 45 45)" stroke="#b44444" strokeWidth="3" />
                  {/* Órbita externa */}
                  <ellipse cx="45" cy="45" rx="30" ry="20" transform="rotate(-20 45 45)" stroke="#b44444" strokeWidth="3" />
                  {/* Planetas / corpos */}
                  <circle cx="60" cy="37" r="5" fill="#f3c64d" />
                  <circle cx="33" cy="32" r="4.8" fill="#f3c64d" />
                  <circle cx="30" cy="55" r="5" fill="#f3c64d" />
                  <circle cx="62" cy="56" r="6" fill="#f3c64d" />
                  {/* Núcleo sugerido (semi transparente) */}
                  <circle cx="45" cy="45" r="4" fill="#f3c64d" opacity="0.75" />
                </svg>
              </div>
              <h3>Cápsulas do tempo</h3>
              <p>Guardam material original do início do Sistema Solar, revelando como ele se formou.</p>
            </div>
          </div>
        </section>

        {/* Separador visual */}
        <div className="section-separator">
          <div className="separator-line"></div>
        </div>


        {/* Terceira seção - análise de dados */}
        <section id="asteroides" className="analysis-section">
          <div className="analysis-text">
            <h2>Desde o tamanho, <br/> até risco de <span className="about-title-accent">colisão.</span></h2>
            <p>Analisamos como esses corpos celestes se comportam e quais merecem mais atenção.</p>
          </div>
          <div className="analysis-charts">
            <div className="chart-container">
              <h3>Ameaça de asteroides por ano</h3>
              <p className="chart-subtitle">Fonte: NASA NeoWs API</p>
              <AsteroidsByYearChart data={apiData} />
            </div>
            <div className="chart-container">
              <h3>Distribuição de velocidade</h3>
              <p className="chart-subtitle">Fonte: NASA NeoWs API</p>
              <VelocityDistributionChart data={apiData} />
            </div>
            <div className="chart-container">
              <h3>Distribuição de tamanho</h3>
              <p className="chart-subtitle">Fonte: NASA NeoWs API</p>
              <SizeDistributionChart data={apiData} />
            </div>
            <div className="chart-container">
              <h3>Risco Potencial</h3>
              <p className="chart-subtitle">Fonte: NASA NeoWs API</p>
              <HazardousPieChart data={apiData} />
            </div>
          </div>
        </section>
        
        {/* Terceira seção: Sobre nós */}
        <section id="sobre-nos" className="section-about">
          <div className="about-inner">
            <div className="about-text">
              <h2 className="about-title">
                <span className="about-title-main">Sobre </span>
                <span className="about-title-accent">nós</span>
              </h2>
              <p className="about-desc">
                Descrição sobre nós: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.
              </p>
              <p className="about-desc">
                Este espaço pode receber informações adicionais sobre a equipe, missão e objetivos do projeto.
              </p>
            </div>
            <div className="about-media">
              <div className="about-placeholder">
                <div className="about-placeholder-gradient" />
                <span className="about-placeholder-label">Imagem futura</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
