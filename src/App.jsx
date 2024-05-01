import React, { useState } from 'react';
import './App.css';
import ReactCrop from './components/ReactCrop.tsx';
import ImageEditor from './components/ImageEditor';
import ArmyContainer from './components/ArmyContainer.jsx';

function App() {

  const [imageUrl, setImageUrl] = useState('');

  function handleImageChange(newImageUrl) {
    setImageUrl(newImageUrl);
  }

  return (
    <div>
      <h1 id="mainTitle">Minis-printer</h1>
      <div id="cropContainer">
        <ReactCrop onBlobUrlChange={handleImageChange} />
        <ImageEditor imageUrl={imageUrl} />
      </div>
        <ArmyContainer />
    </div>
  );
}

export default App;
