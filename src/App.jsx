import React, { useState } from 'react'
import './App.css'
import ReactCrop from './components/ReactCrop.tsx'
import ImageEditor from './components/ImageEditor'
import ArmyContainer from './components/ArmyContainer.jsx'

function App() {

  const [imageUrl, setImageUrl] = useState('')
  const [army, setArmy] = useState([])

  return (
    <div>
      <h1 id="mainTitle">Minis-printer</h1>
      <div id="cropContainer">
        <ReactCrop onBlobUrlChange={setImageUrl} />
        <ImageEditor onArmyChange={setArmy} imageUrl={imageUrl}/>
      </div>
      <ArmyContainer army={army} />
    </div>
  )
}

export default App
