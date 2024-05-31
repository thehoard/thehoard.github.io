import React, { useState } from 'react'
import './App.scss'
import ReactCrop from './components/ReactCrop.tsx'
import ImageEditor from './components/ImageEditor'
import ArmyContainer from './components/ArmyContainer.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {

  const [imageUrl, setImageUrl] = useState('')
  const [army, setArmy] = useState([])

  return (
    <div>
      <div className="logoContainer">
        <img src="../src/assets/images/Th-Logo-long-blanc.png" alt="Logo The hoard" className="mainLogo" />
        <h1 id="mainTitle">Minis-printer</h1>
      </div>
      <div id="interfaceContainer">
        <ReactCrop onBlobUrlChange={setImageUrl} />
        <ImageEditor onArmyChange={setArmy} imageUrl={imageUrl} />
      </div>
      <ArmyContainer army={army} />
    </div>
  )
}

export default App
