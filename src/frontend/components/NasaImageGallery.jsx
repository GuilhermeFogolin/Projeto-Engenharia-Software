import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080';

const NasaImageGallery = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchNasaImages = async () => {
      try {
        setError(null);
        const response = await fetch(`${API_BASE_URL}/api/v1/daily-images`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setImages(data);
      } catch (e) {
        if (e.name === 'AbortError') {
          return;
        }
        console.error("Failed to fetch NASA images:", e);
        setError("Não foi possível carregar as imagens da NASA. Tente novamente mais tarde.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchNasaImages();
    return () => controller.abort();
  }, []);

  return (
    <section id="gallery" className="gallery-section">
      <h2 className="gallery-title">Galeria de Imagens da NASA</h2>
      <p className="gallery-subtitle">Explore o cosmos através das lentes da NASA, com uma seleção de imagens astronômicas do dia.</p>

      {isLoading && <p className="gallery-feedback">Carregando destaques do dia…</p>}

      {error && <p className="error-message">{error}</p>}

      <div className="gallery-grid">
        {images.map((image, index) => (
          <div key={index} className="gallery-item">
            <img src={image.href} alt={image.title} className="gallery-image" />
            <div className="gallery-item-info">
              <h3 className="gallery-item-title">{image.title}</h3>
              <p className="gallery-item-desc">{image.description?.substring(0, 150)}...</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NasaImageGallery;