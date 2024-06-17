import React, { useState } from 'react'
import ReactCrop from './components/ReactCrop.tsx'
import ImageEditor from './components/ImageEditor'
import ArmyContainer from './components/ArmyContainer.jsx'

function App() {

  const [imageUrl, setImageUrl] = useState('')
  const [army, setArmy] = useState([])

  return (
    <div>
      <div className="flex flex-row items-center justify-evenly m-10">
        <a href="https://thehoard.co/" target="_blank">
          <img src="../src/assets/images/Th-Logo-long-blanc.png" alt="Logo The hoard" className="w-3/6" />
        </a>
        <h1 className="w-2/6 p-10 pt-14 text-center text-3xl" id="mainTitle">Minis-printer</h1>
      </div>
      <div className="inline-flex justify-center">
        <ReactCrop onBlobUrlChange={setImageUrl} />
        <ImageEditor onArmyChange={setArmy} imageUrl={imageUrl} />
      </div>
      <ArmyContainer army={army} />
    </div>
  )
}

export default App
