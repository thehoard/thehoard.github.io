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
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let baseWidth = 500;
        let baseHeight = 500;
        let foldStroke = 10; //espace entre les images pour pouvoir plier le Mini

        canvas.width = (img.width + baseWidth);
        canvas.height = ((img.height * 2) + (baseHeight * 2) + foldStroke);
        const centerXCanvas = ((canvas.width - img.width) / 2);
        const centerYCanvas = ((canvas.height - (img.height * 2)) / 2);

        ctx.save();
        ctx.scale(1, -1);
        ctx.drawImage(img, centerXCanvas, (-centerYCanvas - img.height)); //image renversée
        ctx.restore();
        ctx.drawImage(img, centerXCanvas, (centerYCanvas + img.height + foldStroke)); //image normale

        const dataURL = canvas.toDataURL('image/jpeg');

        setImagePreview(dataURL);

      };
      img.src = event.target.result;
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
