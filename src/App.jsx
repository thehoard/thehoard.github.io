import React, { useState } from 'react';
import './App.css';
import ReactCrop from './components/ReactCrop.tsx';
import ImageEditor from './components/ImageEditor';

function App() {

  const [imageUrl, setImageUrl] = useState('');

  function handleImageChange(newImageUrl) {
    setImageUrl(newImageUrl);
    console.log(imageUrl);
  }

  return (
    <div>
      <ReactCrop onBlobUrlChange={handleImageChange} />
      {imageUrl && <img src={imageUrl} alt="Cropped Image" />}
      <ImageEditor imageUrl={imageUrl}/>
    </div>
  );
}

export default App;
