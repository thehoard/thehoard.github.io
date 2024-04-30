import React, { useState } from 'react';
import './App.css';

function App() {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (imageChange) => {
    imageChange.preventDefault();

    const file = imageChange.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {

      const img = new Image();
      const baseImg = new Image();

      baseImg.onload = () => {

        let baseWidth = img.width * 0.4; // taille du pied, fixée pour le moment à 140% des dimensions de l'image
        let baseHeight = img.height * 0.3;
        let foldStroke = 10; // espace entre les images pour pouvoir plier le Mini

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = (img.width + baseWidth);
        canvas.height = ((img.height * 2) + (baseHeight * 2) + foldStroke);
        const centerXCanvas = ((canvas.width - img.width) / 2);
        const centerYCanvas = ((canvas.height - (img.height * 2)) / 2);

        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(1, -1);
        ctx.drawImage(img, centerXCanvas, (-centerYCanvas - img.height)); // image renversée
        ctx.restore();
        ctx.drawImage(img, centerXCanvas, (centerYCanvas + img.height)); // image normale
        ctx.drawImage(baseImg, 0, 0, canvas.width, baseHeight);
        ctx.drawImage(baseImg, 0, (canvas.height - baseHeight), canvas.width, baseHeight);

        const dataURL = canvas.toDataURL('image/jpeg');

        setImagePreview(dataURL);
      };

      img.src = event.target.result;
      baseImg.src = '../src/assets/Minibase.svg';
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h1>Minis-printer</h1>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      {imagePreview && (
        <div>
          <h2>Prévisualisation de l'image :</h2>
          <img src={imagePreview} alt="Prévisualisation" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        </div>
      )}
    </div>
  );
}

export default App;
