import React, { useState, useEffect } from 'react';

function ImageEditor({ imageUrl }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [baseImg, setBaseImg] = useState(null);

  useEffect(() => {
    const baseImage = new Image();
    baseImage.onload = () => { //chargement de l'image de la base
      setBaseImg(baseImage);
    };
    baseImage.src = '../src/assets/images/Minibase.svg';
  }, []);

  useEffect(() => {
    if (imageUrl && baseImg) {
      const img = new Image();

      img.onload = () => {
        const baseWidth = img.width * 0.4; //définition de la taille automatique de la base et de des espaces de pliures
        const baseHeight = img.height * 0.3;
        const foldStroke = img.height * 0.01;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = (img.width + baseWidth);
        canvas.height = ((img.height * 2) + (baseHeight * 2) + (foldStroke * 2));
        const centerXCanvas = ((canvas.width - img.width) / 2);
        const centerYCanvas = ((canvas.height - ((img.height * 2) + (foldStroke * 2))) / 2);

        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(1, -1);
        ctx.drawImage(img, centerXCanvas, (-centerYCanvas - img.height - foldStroke));
        ctx.restore();
        ctx.drawImage(img, centerXCanvas, (centerYCanvas + img.height + foldStroke * 2));
        ctx.drawImage(baseImg, 0, 0, canvas.width, baseHeight);
        ctx.drawImage(baseImg, 0, (canvas.height - baseHeight + foldStroke), canvas.width, baseHeight);

        const dataURL = canvas.toDataURL('image/jpeg');

        setImagePreview(dataURL);
      };

      img.src = imageUrl;
    }
  }, [imageUrl, baseImg]);

  const downloadImage = () => {
    const downloadLink = document.createElement('a');
    downloadLink.href = imagePreview;
    downloadLink.download = 'image.jpg';
    downloadLink.click();
  };


  return (
    <div>
      {imagePreview && (
        <div id="miniPreview">
          <h2>Prévisualisation du mini :</h2>
          <img src={imagePreview} alt="Prévisualisation" style={{ maxWidth: '100%', maxHeight: '400px' }} />
          <div id="cropControls">
            <button onClick={downloadImage}>Télécharger le mini</button>
            <button>Intégrer le Mini à l'armée</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageEditor;
