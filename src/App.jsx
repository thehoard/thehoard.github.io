import React, { useState } from 'react'
import ReactCrop from './components/ReactCrop.tsx'
import ImageEditor from './components/ImageEditor'
import ArmyContainer from './components/ArmyContainer.jsx'

function App() {

  const [imageUrl, setImageUrl] = useState('')
  const [army, setArmy] = useState([])

  return (
    <div>
      <div className="
        flex flex-wrap items-center justify-around
        mr-auto ml-auto 
        w-5/6 md:w-4/6 lg:w-3/6 xl:w-5/6"
      >
        <a href="https://thehoard.co/" target="_blank" className="flex mb-4 w-5/6 xl:w-2/6 2xl:w-3/6 3xl:w-3/6">
          <img src="../src/assets/images/Th-Logo-long-blanc.png" alt="Logo The hoard" className="w-full" />
        </a>
        <h1 className="
          text-center mainTitle
          p-5 pt-8 mb-4 text-xl 
          w-5/6 md:w-4/6 xl:w-2/6 3xl:w-2/5 
          3xl:p-20 3xl:pt-24 
          2xl:text-2xl 3xl:text-5xl"
        >Minis-printer</h1>
      </div>
      <div className="inline-flex justify-center h-fit w-full flex-wrap">
        <ReactCrop onBlobUrlChange={setImageUrl} />
        <ImageEditor onArmyChange={setArmy} imageUrl={imageUrl} />
      </div>
      <ArmyContainer army={army} />
    </div>
  )
}

export default App
