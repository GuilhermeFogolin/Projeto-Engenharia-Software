import { useState, useEffect } from 'react'
import ChicxulubSection from './components/ChicxulubSection';
import ApodSearchSection from './components/ApodSearchSection';
import NasaImageGallery from './components/NasaImageGallery';
import './App.css';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  LabelList,
} from 'recharts'

const bgVideo = import.meta.env.VITE_BG_VIDEO_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080';
const MIN_NASA_DATE = '1995-03-01';

const formatDateToLabel = (dateString) => {
  if (!dateString) {
    return '';
  }

  const safeDate = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(safeDate.getTime())) {
    return dateString;
  }

  return safeDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const getDefaultSearchDate = () => {
  const now = new Date();
  // Usamos "ontem" para garantir que a NASA já tenha publicado o boletim diário completo
  now.setUTCDate(now.getUTCDate() - 1);
  return now.toISOString().split('T')[0];
};

const safelyParseNumber = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const renderBarLabel = (suffix = '', fractionDigits = 0) => (props) => {
  const { x, y, width, value } = props;

  if (value === null || value === undefined) {
    return null;
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return null;
  }

  const formatted = numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill="#f5f5f5"
      textAnchor="middle"
      fontSize={12}
    >
      {`${formatted}${suffix}`}
    </text>
  );
};

const ChartEmptyState = ({ message }) => (
  <div className="chart-empty-state">{message}</div>
);

const formatAsteroidNameForAxis = (name) => {
  if (!name) {
    return 'Asteroide';
  }

  return name.length <= 18 ? name : `${name.slice(0, 15)}…`;
};

const normalizeAsteroidPayload = (payload, selectedDate) => {
  if (!payload) {
    return { asteroids: [], summary: null };
  }

  const asteroidsMap = payload.asteroides || {};
  const asteroids = Object.values(asteroidsMap)
    .map((asteroid) => {
      const approaches = Array.isArray(asteroid.dados_aproximacao)
        ? asteroid.dados_aproximacao
        : [];
      const approachForDate =
        approaches.find((approach) => approach.data_aproximacao === selectedDate) ||
        approaches[0] ||
        null;

      const velocity = approachForDate
        ? safelyParseNumber(
            approachForDate?.velocidade_relativa?.quilometros_por_hora,
          )
        : 0;

      const missDistanceLunar = approachForDate
        ? safelyParseNumber(approachForDate?.distancia_perdida?.lunar)
        : 0;

      return {
        id: asteroid.id || asteroid.id_referencia_neo || asteroid.nome,
        nome: asteroid.nome || asteroid.id_referencia_neo || 'Asteroide',
        e_potencialmente_perigoso: Boolean(asteroid.e_potencialmente_perigoso),
        diametro_max_m: safelyParseNumber(
          asteroid.diametro_estimado?.metros?.estimated_diameter_max,
        ),
        velocidade_kmh: velocity,
        data_aproximacao: approachForDate?.data_aproximacao || null,
        miss_distance_lunar: missDistanceLunar,
        nome_abreviado: formatAsteroidNameForAxis(
          asteroid.nome || asteroid.id_referencia_neo,
        ),
      };
    })
    .filter((asteroid) => Boolean(asteroid.data_aproximacao));

  return {
    asteroids,
    summary: payload.resumo || null,
  };
};

const CloseApproachDistanceChart = ({ data }) => {
  const categories = [
    {
      key: 'menor-1',
      label: '< 1 Distância Lunar',
      predicate: (value) => value > 0 && value < 1,
    },
    {
      key: 'entre-1-5',
      label: '1 a 5 Distâncias Lunares',
      predicate: (value) => value >= 1 && value <= 5,
    },
    {
      key: 'acima-5',
      label: '> 5 Distâncias Lunares',
      predicate: (value) => value > 5,
    },
  ];

  const chartData = categories.map((category) => ({
    range: category.label,
    count: data.reduce(
      (acc, asteroid) =>
        acc + (category.predicate(asteroid.miss_distance_lunar) ? 1 : 0),
      0,
    ),
  }));

  const hasValues = chartData.some((entry) => entry.count > 0);

  if (!hasValues) {
    return (
      <ChartEmptyState message="Nenhum asteroide permitido para calcular a distância mínima nesta data." />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        margin={{ top: 16, right: 12, left: 8, bottom: 48 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis
          dataKey="range"
          stroke="#888"
          tick={{ fill: '#aaa', fontSize: 12 }}
        >
          <Label value="Faixa (distâncias lunares)" offset={-4} position="insideBottom" fill="#aaa" />
        </XAxis>
        <YAxis
          stroke="#888"
          allowDecimals={false}
          tick={{ fill: '#aaa', fontSize: 12 }}
        >
          <Label
            value="Quantidade de asteroides"
            angle={-90}
            position="insideLeft"
            fill="#aaa"
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <Tooltip
          formatter={(value) => [
            `${value} asteroide${value === 1 ? '' : 's'}`,
            'Quantidade',
          ]}
          contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
        />
        <Bar dataKey="count" name="Asteroides" fill="#B7AD4F">
          <LabelList dataKey="count" content={renderBarLabel()} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const VelocityDistributionChart = ({ data }) => {
  const velocityData = data
    .filter((asteroid) => asteroid.velocidade_kmh > 0)
    .map((asteroid) => ({
      name: asteroid.nome,
      displayName: asteroid.nome_abreviado,
      velocity: asteroid.velocidade_kmh,
    }));

  if (!velocityData.length) {
    return (
      <ChartEmptyState message="Nenhuma velocidade registrada para os asteroides desta data." />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={velocityData}
        margin={{ top: 16, right: 24, left: 16, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis
          dataKey="displayName"
          tickLine={false}
          axisLine={false}
          tick={false}
          height={20}
        >
          <Label
            value="Asteroides"
            offset={-2}
            position="insideBottom"
            fill="#aaa"
          />
        </XAxis>
        <YAxis stroke="#888" tick={{ fill: '#aaa', fontSize: 12 }}>
          <Label
            value="Velocidade (km/h)"
            angle={-90}
            position="insideLeft"
            fill="#aaa"
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <Tooltip
          formatter={(value) => [
            `${Number(value).toLocaleString('pt-BR', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })} km/h`,
            'Velocidade',
          ]}
          labelFormatter={(label, payload) => payload?.[0]?.payload?.nome || label}
          contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
        />
        <Bar dataKey="velocity" name="Velocidade" fill="#B7AD4F" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const SizeDistributionChart = ({ data }) => {
  const sizeData = data
    .filter((asteroid) => asteroid.diametro_max_m > 0)
    .map((asteroid) => ({
      name: asteroid.nome,
      displayName: asteroid.nome_abreviado,
      diameter: asteroid.diametro_max_m,
    }));

  if (!sizeData.length) {
    return (
      <ChartEmptyState message="Sem medições de diâmetro disponíveis para esta data." />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={sizeData}
        margin={{ top: 16, right: 24, left: 16, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis
          dataKey="displayName"
          tickLine={false}
          axisLine={false}
          tick={false}
          height={20}
        >
          <Label
            value="Asteroides"
            offset={-2}
            position="insideBottom"
            fill="#aaa"
          />
        </XAxis>
        <YAxis stroke="#888" tick={{ fill: '#aaa', fontSize: 12 }}>
          <Label
            value="Diâmetro máximo (m)"
            angle={-90}
            position="insideLeft"
            fill="#aaa"
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <Tooltip
          formatter={(value) => [
            `${Number(value).toLocaleString('pt-BR', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })} m`,
            'Diâmetro máximo',
          ]}
          labelFormatter={(label, payload) => payload?.[0]?.payload?.nome || label}
          contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
        />
        <Bar dataKey="diameter" name="Diâmetro Máximo" fill="#B7AD4F" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const HazardousPieChart = ({ data }) => {
  if (!data.length) {
    return (
      <ChartEmptyState message="Sem asteroides registrados para avaliar risco." />
    );
  }

  const hazardousCount = data.filter((item) => item.e_potencialmente_perigoso).length;
  const nonHazardousCount = data.length - hazardousCount;

  const chartData = [
    { name: 'Potencialmente Perigosos', value: hazardousCount },
    { name: 'Não Perigosos', value: nonHazardousCount },
  ];

  const COLORS = ['#8e1515', '#B7AD4F'];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    value,
  }) => {
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
        <Tooltip
          formatter={(value, name) => [
            `${value} asteroide${value === 1 ? '' : 's'}`,
            name,
          ]}
          contentStyle={{
            backgroundColor: '#111',
            border: '1px solid #444',
            color: '#B7AD4F',
            fontWeight: 500,
          }}
          itemStyle={{ color: '#B7AD4F' }}
          labelStyle={{ color: '#B7AD4F', fontWeight: 600 }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

function App() {
  const [asteroids, setAsteroids] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getDefaultSearchDate());
  const [isLoadingAsteroids, setIsLoadingAsteroids] = useState(false);
  const [asteroidError, setAsteroidError] = useState(null);
  const [showLunarInfo, setShowLunarInfo] = useState(false);

  const formattedDateLabel = formatDateToLabel(selectedDate);
  const maxSelectableDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!selectedDate) {
      return undefined;
    }

    const controller = new AbortController();

    const fetchAsteroids = async () => {
      setIsLoadingAsteroids(true);
      setAsteroidError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/asteroides/${selectedDate}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(
            `Não foi possível recuperar os dados (código ${response.status}).`,
          );
        }

        const payload = await response.json();
        const { asteroids: normalizedAsteroids, summary: normalizedSummary } =
          normalizeAsteroidPayload(payload, selectedDate);

        if (!controller.signal.aborted) {
          setAsteroids(normalizedAsteroids);
          setSummary(normalizedSummary);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error('Erro ao buscar asteroides:', error);
        setAsteroidError(
          error.message || 'Erro inesperado ao carregar os dados dos asteroides.',
        );
        setAsteroids([]);
        setSummary(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingAsteroids(false);
        }
      }
    };

    fetchAsteroids();

    return () => controller.abort();
  }, [selectedDate]);

  const handleDateChange = (event) => {
    const { value } = event.target;
    setSelectedDate(value || getDefaultSearchDate());
  };

  const toggleLunarInfo = () => {
    setShowLunarInfo((prev) => !prev);
  };

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
            <div className="analysis-controls">
              <label htmlFor="asteroid-date">Selecione uma data</label>
              <input
                id="asteroid-date"
                type="date"
                value={selectedDate}
                min={MIN_NASA_DATE}
                max={maxSelectableDate}
                onChange={handleDateChange}
              />
              <span className="analysis-hint">
                A NASA atualiza esses dados diariamente. Escolha qualquer data disponível.
              </span>
            </div>
            {summary && (
              <div className="analysis-summary">
                <div className="analysis-summary-item">
                  <span className="analysis-summary-value">
                    {Number(summary.total_asteroides || 0).toLocaleString('pt-BR')}
                  </span>
                  <span className="analysis-summary-label">asteroides detectados</span>
                </div>
                <div className="analysis-summary-item">
                  <span className="analysis-summary-value">
                    {Number(summary.asteroides_potencialmente_perigosos || 0).toLocaleString('pt-BR')}
                  </span>
                  <span className="analysis-summary-label">
                    potencialmente perigosos ({Number(summary.porcentagem_perigosos || 0).toLocaleString('pt-BR')}%)
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="analysis-charts">
            {isLoadingAsteroids && (
              <div className="analysis-feedback">Carregando dados astrométricos...</div>
            )}

            {!isLoadingAsteroids && asteroidError && (
              <div className="analysis-feedback analysis-feedback--error">
                {asteroidError}
              </div>
            )}

            {!isLoadingAsteroids && !asteroidError && (
              <>
                <div className="chart-container">
                  <div className="chart-heading">
                    <h3>
                      Faixas de distância mínima (distâncias lunares) — dados de {formattedDateLabel}
                    </h3>
                    <button
                      type="button"
                      className="chart-info-trigger"
                      onClick={toggleLunarInfo}
                      aria-expanded={showLunarInfo}
                      aria-controls="lunar-distance-help"
                    >
                      ℹ
                    </button>
                  </div>
                  {showLunarInfo && (
                    <p id="lunar-distance-help" className="chart-info-helper">
                      Uma distância lunar representa a distância média entre a Terra e a Lua, aproximadamente 384&nbsp;400 quilômetros.
                    </p>
                  )}
                  <p className="chart-subtitle">Fonte: NASA NeoWs API</p>
                  <CloseApproachDistanceChart data={asteroids} />
                </div>
                <div className="chart-container">
                  <h3>Distribuição de velocidade (km/h) — dados de {formattedDateLabel}</h3>
                  <p className="chart-subtitle">Fonte: NASA NeoWs API</p>
                  <VelocityDistributionChart data={asteroids} />
                </div>
                <div className="chart-container">
                  <h3>Distribuição de tamanho (m) — dados de {formattedDateLabel}</h3>
                  <p className="chart-subtitle">Fonte: NASA NeoWs API</p>
                  <SizeDistributionChart data={asteroids} />
                </div>
                <div className="chart-container">
                  <h3>Risco potencial (percentual) — dados de {formattedDateLabel}</h3>
                  <p className="chart-subtitle">Fonte: NASA NeoWs API</p>
                  <HazardousPieChart data={asteroids} />
                </div>
              </>
            )}
          </div>
        </section>
        
  <ApodSearchSection />

  <div className="section-separator">
    <div className="separator-line"></div>
  </div>

  <ChicxulubSection />

  {/* Separador visual */}
        <div className="section-separator">
          <div className="separator-line"></div>
        </div>

        <NasaImageGallery />

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
