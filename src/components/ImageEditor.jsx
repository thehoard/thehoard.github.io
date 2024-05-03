import React, { useState, useEffect } from 'react'

function ImageEditor({ imageUrl, onArmyChange }) {
  const [imagePreview, setImagePreview] = useState(null)
  const [baseImg, setBaseImg] = useState(null)
  const [army, setArmy] = useState([])
  const [idCount, setIdCount] = useState(1)
  const [selectedSize, setSelectedSize] = useState(1)
  const [repeatValue, setRepeatValue] = useState(1)

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        const baseImg = new Image();
        baseImg.onload = () => { //chargement de l'image de la base
          setBaseImg(baseImg);
          drawCanvas(img, baseImg, selectedSize); // Appelez drawCanvas avec img et baseImg
        };
        baseImg.src = '../src/assets/images/Minibase.svg'; // Assurez-vous que le chemin est correct
      };
      img.src = imageUrl;
    }
  }, [imageUrl, selectedSize]);

  const mmToPx = (sizeInMm) => {
    const dpi = window.devicePixelRatio || 1
    return Math.floor(sizeInMm * dpi * 3.7795) // 1mm = 3.7795 pixels
  }

  const calculateBaseSize = (selectedSize) => {
    const SQUARE_PX = mmToPx(25.4)
    const baseWidth = SQUARE_PX * selectedSize
    const baseHeight = baseWidth / 2
    return {baseWidth, baseHeight}
  }


  const drawCanvas = (img, baseImg, selectedSize) => {

    console.log(selectedSize)

    const { baseWidth, baseHeight } = calculateBaseSize(selectedSize)
    const foldStroke = 4 // l'espace de pliure est défini à 4 pixels, soit environ 1mm.

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = (img.width + baseWidth)
    canvas.height = ((img.height * 2) + (baseHeight * 2) + (foldStroke * 2))
    const centerXCanvas = ((canvas.width - img.width) / 2)
    const centerYCanvas = ((canvas.height - ((img.height * 2) + (foldStroke * 2))) / 2)

    ctx.save()
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.scale(1, -1)
    ctx.drawImage(img, centerXCanvas, (-centerYCanvas - img.height - foldStroke))
    ctx.restore()
    ctx.drawImage(img, centerXCanvas, (centerYCanvas + img.height + foldStroke * 2))
    ctx.drawImage(baseImg, 0, 0, canvas.width, baseHeight)
    ctx.drawImage(baseImg, 0, (canvas.height - baseHeight + foldStroke), canvas.width, baseHeight)

    const dataURL = canvas.toDataURL('image/jpeg')

    setImagePreview(dataURL)
  }


  const downloadImage = () => {
    const downloadLink = document.createElement('a')
    downloadLink.href = imagePreview
    downloadLink.download = 'image.jpg'
    downloadLink.click()
  }

  // Fonction pour ajouter un nouveau Mini au tableau qui servira de base à l'édition du canvas A4.
  const addImageToArmy = () => {
    const newMini = {
      id: idCount,
      image: imagePreview,
      number: repeatValue,
      size: selectedSize,
    }
    const newArmy = [...army, newMini]
    setArmy(newArmy)
    setIdCount(idCount + 1)
    onArmyChange(newArmy)
  }


  const handleRepeatChange = (event) => {
    setRepeatValue(event.target.value)
  }

  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value)
  }


  return (
    <div>
      {imagePreview && (
        <div id="armyControls">
          <div id="armyButtons">
            <h2>Choix de la taille</h2>
            <label><input type="radio" name="size" value="0.25" onChange={handleSizeChange} /> Minuscule (60 cm)</label>
            <label><input type="radio" name="size" value="1" onChange={handleSizeChange} /> Petit (1.2m)</label>
            <label><input type="radio" name="size" value="1" onChange={handleSizeChange} /> Moyen (2.5m)</label>
            <label><input type="radio" name="size" value="4" onChange={handleSizeChange} /> Grand (4.5m)</label>
            <label><input type="radio" name="size" value="9" onChange={handleSizeChange} /> Énorme (9m)</label>
            <label><input type="radio" name="size" value="16" onChange={handleSizeChange} /> Gargantuesque (9m et +)</label>
            <div id="numberSelector">
              <label id="numberSelectionLabel">Nombre de Minis à intégrer :<br /><input type="number" value={repeatValue} onChange={handleRepeatChange} /></label>
            </div>
            <button onClick={downloadImage}>Télécharger le mini</button>
            <button onClick={addImageToArmy}>Intégrer le Mini à l'armée</button>
          </div>
          <div id="miniPreview">
            <h3>Prévisualisation du mini :</h3>
            <img src={imagePreview} alt="Prévisualisation" style={{ maxWidth: '100%', maxHeight: '400px' }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageEditor
