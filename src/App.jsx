import { useState } from 'react'
import './App.css'

function App() {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (imageChange) => {
    imageChange.preventDefault();

    const file = imageChange.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h1>Upload de l'image</h1>
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
