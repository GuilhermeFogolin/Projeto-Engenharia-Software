import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080';
const MIN_APOD_DATE = '1995-06-16';

const ApodSearchSection = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [imageData, setImageData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const maxSelectableDate = new Date().toISOString().split('T')[0];

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedDate) {
      setErrorMessage('Escolha uma data para buscar a imagem.');
      setImageData(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setImageData(null);

    const endpoint = `${API_BASE_URL}/api/v1/daily-images/${selectedDate}`;

    try {
      const response = await fetch(endpoint);

      if (response.status === 404) {
        setErrorMessage('Não encontramos imagem para a data informada.');
        return;
      }

      if (!response.ok) {
        throw new Error(`Falha ao buscar imagem (status ${response.status}).`);
      }

      const payload = await response.json();
      setImageData(payload);
    } catch (error) {
      console.error('Erro ao consultar imagem por data:', error);
      setErrorMessage('Não foi possível carregar a imagem. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="apod-busca" className="apod-search-section">
      <div className="apod-search-inner">
        <div className="apod-search-copy">
          <h2>Imagem astronômica por data</h2>
          <p>
            Consulte o acervo Astronomy Picture of the Day (APOD) e descubra o que o céu
            revelou em um dia marcante para você.
          </p>
          <form className="apod-search-form" onSubmit={handleSubmit}>
            <label htmlFor="apod-date">Escolha uma data</label>
            <div className="apod-search-controls">
              <input
                id="apod-date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={MIN_APOD_DATE}
                max={maxSelectableDate}
                aria-describedby="apod-date-helper"
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Buscando…' : 'Buscar imagem'}
              </button>
            </div>
            <span id="apod-date-helper" className="apod-search-helper">
              As imagens diárias estão disponíveis desde 16/06/1995. A NASA publica a foto
              por volta das 13h UTC.
            </span>
          </form>
          {errorMessage && <p className="apod-search-feedback apod-search-feedback--error">{errorMessage}</p>}
        </div>

        <div className="apod-search-result" aria-live="polite">
          {!imageData && !errorMessage && !isLoading && (
            <p className="apod-search-placeholder">
              Escolha uma data e visualize aqui a imagem capturada pela NASA naquele dia.
            </p>
          )}

          {isLoading && (
            <p className="apod-search-feedback">Carregando imagem selecionada…</p>
          )}

          {imageData && !isLoading && (
            <article className="apod-card">
              <div className="apod-card-media">
                {imageData.href ? (
                  <img src={imageData.href} alt={imageData.title || 'Imagem astronômica do dia selecionado'} />
                ) : (
                  <div className="apod-card-media--empty">Imagem não disponível</div>
                )}
              </div>
              <div className="apod-card-body">
                <h3>{imageData.title || 'Imagem astronômica'}</h3>
                {imageData.date && <span className="apod-card-date">{imageData.date}</span>}
                <p>{imageData.description || 'A NASA não forneceu descrição para esta imagem.'}</p>
                {imageData.credits && (
                  <span className="apod-card-credits">Créditos: {imageData.credits}</span>
                )}
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
};

export default ApodSearchSection;
