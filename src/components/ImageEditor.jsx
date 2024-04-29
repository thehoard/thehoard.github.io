import React, { useState, useEffect } from 'react';

function ImageEditor({ imageUrl }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [baseImg, setBaseImg] = useState(null);

  useEffect(() => {
    // Charger l'image de base lors du montage initial du composant
    const baseImage = new Image();
    baseImage.onload = () => {
      setBaseImg(baseImage);
    };
    baseImage.src = '../src/assets/images/Minibase.svg';
  }, []);

  useEffect(() => {
    if (imageUrl && baseImg) {
      const img = new Image();

      img.onload = () => {
        const baseWidth = img.width * 0.4;
        const baseHeight = img.height * 0.3;
        const foldStroke = img.height * 0.02;

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
        ctx.drawImage(img, centerXCanvas, (centerYCanvas + img.height + foldStroke));
        ctx.drawImage(baseImg, 0, 0, canvas.width, baseHeight);
        ctx.drawImage(baseImg, 0, (canvas.height - baseHeight), canvas.width, baseHeight);

        const dataURL = canvas.toDataURL('image/jpeg');

        setImagePreview(dataURL);
      };

      img.src = imageUrl;
    }
  }, [imageUrl, baseImg]);

  return (
    <div>
      {imagePreview && (
        <div>
          <h2>Prévisualisation de l'image :</h2>
          <img src={imagePreview} alt="Prévisualisation" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        </div>
      )}
    </div>
  );
}

export default ImageEditor;
