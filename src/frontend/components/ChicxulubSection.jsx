import React, { useRef, useEffect } from 'react';
import chicxulubImage from '/asteroidchicx.png'; // Updated image
import dinoIcon from '/dino.png';
import mundoIcon from '/mundo.png';
import destruidoIcon from '/destruido.png';

const ChicxulubSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const section = imageRef.current.closest('.chicxulub-section');
        if (!section) return;

        const windowHeight = window.innerHeight;

        // Calculate progress as the image container enters the viewport from bottom
        // and moves towards the top of the viewport.
        const imageContainer = imageRef.current.parentElement;
        const imageContainerRect = imageContainer.getBoundingClientRect();

        let progress = 0;
        if (imageContainerRect.top < windowHeight && imageContainerRect.bottom > 0) {
          // Progress from 0 (bottom of image container enters viewport) to 1 (top of image container leaves viewport)
          progress = 1 - (imageContainerRect.top + imageContainerRect.height) / (windowHeight + imageContainerRect.height);
          progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1
        }
        
        // Adjust intensity for a more noticeable effect
        const translateY = progress * 150; // Increased intensity
        const rotate = progress * 120; // Increased rotation
        const scale = 1 + (progress * 0.3); // Increased scale

        imageRef.current.style.transform = `translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`;
        imageRef.current.style.opacity = 0.3 + (progress * 0.7); // Fades in from 30% opacity
        imageRef.current.style.willChange = 'transform, opacity'; // Performance hint
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call to set position if already scrolled
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="chicxulub" className="chicxulub-section">
      <div className="chicxulub-content">
        <div className="chicxulub-image-container">
          <img ref={imageRef} src={chicxulubImage} alt="Asteroide Chicxulub" className="chicxulub-image" />
        </div>
        <div className="chicxulub-info">
          <h2>Asteroide Chicxulub</h2>
          <p>O asteroide Chicxulub é famoso por ser o principal candidato a ter causado o evento de extinção do Cretáceo-Paleogeno, que levou ao fim dos dinossauros não-avianos há cerca de 66 milhões de anos.</p>
          
          <div className="chicxulub-cards-container">
            <div className="chicxulub-card">
              <div className="chicxulub-card-icon">
                <img src={dinoIcon} alt="Ícone Dinossauro" />
              </div>
              <h3>Extinção dos Dinossauros</h3>
              <p>Causou o fim da era dos dinossauros não-avianos, abrindo caminho para a ascensão dos mamíferos.</p>
            </div>
            <div className="chicxulub-card">
              <div className="chicxulub-card-icon">
                <img src={mundoIcon} alt="Ícone Mundo" />
              </div>
              <h3>Quando Caiu</h3>
              <p>O impacto ocorreu há aproximadamente 66 milhões de anos, no final do período Cretáceo.</p>
            </div>
            <div className="chicxulub-card">
              <div className="chicxulub-card-icon">
                <img src={destruidoIcon} alt="Ícone Impacto" />
              </div>
              <h3>Onde Atingiu</h3>
              <p>Impactou a região da Península de Yucatán, no México, criando uma cratera de 180 km.</p>
            </div>
          </div>

          <p>Seu impacto criou a Cratera de Chicxulub, uma estrutura de impacto de aproximadamente 180 quilômetros de diâmetro, que hoje está parcialmente submersa e parcialmente enterrada sob sedimentos.</p>
        </div>
      </div>
    </section>
  );
};

export default ChicxulubSection;