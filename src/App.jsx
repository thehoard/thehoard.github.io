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

        canvas.width = img.width;
        canvas.height = (img.height * 2) + 10;

        ctx.save();
        ctx.scale(1, -1);
        ctx.drawImage(img, 0, -img.height);
        ctx.restore();

        ctx.drawImage(img, 0, (img.height) + 10);

        const dataURL = canvas.toDataURL('image/jpeg');

        setImagePreview(dataURL);

        // const downloadLink = document.createElement('a');
        // downloadLink.href = dataURL;
        // downloadLink.download = 'mirrored_image.jpg';
        // downloadLink.click();


      };
      img.src = event.target.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h1>test minis printer</h1>
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
