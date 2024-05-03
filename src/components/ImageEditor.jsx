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
          drawCanvas(img, baseImg, selectedSize); //à chaque modification de l'image de base ou de la taille, drawImage est appelée
        };
        baseImg.src = '../src/assets/images/Minibase.svg';
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
    return { baseWidth, baseHeight }
  }

  const resizeImage = (img, baseWidth) => {
    const aspectRatio = img.width / img.height;
    const resizedImageWidth = baseWidth;
    const resizedImageHeight = resizedImageWidth / aspectRatio;

    const canvas = document.createElement('canvas');
    canvas.width = resizedImageWidth;
    canvas.height = resizedImageHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, resizedImageWidth, resizedImageHeight);

    const resizedImageDataUrl = canvas.toDataURL('image/jpeg');

    const resizedImage = new Image();
    resizedImage.width = resizedImageWidth;
    resizedImage.height = resizedImageHeight;
    resizedImage.src = resizedImageDataUrl;

    return resizedImage;
  }

  const drawCanvas = (img, baseImg, selectedSize) => {

    const { baseWidth, baseHeight } = calculateBaseSize(selectedSize)
    const foldStroke = 2 // l'espace de pliure est défini à 2 pixels, soit environ 0.5mm.

    const resizedImage = resizeImage(img, baseWidth) //on créé une nouvelle image redimensionnée

    resizedImage.onload = () => { //au chargement de l'image redimensionnée, on la dessine sur le canvas.

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = baseWidth
      canvas.height = ((resizedImage.height * 2) + (baseHeight * 2) + (foldStroke * 2))
      const centerYCanvas = ((canvas.height - ((resizedImage.height * 2) + (foldStroke * 2))) / 2)

      ctx.save()
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(1, -1)
      ctx.drawImage(resizedImage, 0, (-centerYCanvas - resizedImage.height - foldStroke))
      ctx.restore()
      ctx.drawImage(resizedImage, 0, (centerYCanvas + resizedImage.height + foldStroke * 2))
      ctx.drawImage(baseImg, 0, 0, canvas.width, baseHeight)
      ctx.drawImage(baseImg, 0, (canvas.height - baseHeight + foldStroke), canvas.width, baseHeight)

      const dataURL = canvas.toDataURL('image/jpeg')

      setImagePreview(dataURL)
    }
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
            <label><input type="radio" name="size" value='0.25' onChange={handleSizeChange} /> Minuscule (1/4 carré)</label>
            <label><input type="radio" name="size" value='0.5' onChange={handleSizeChange} /> Petit (0.5 carré)</label>
            <label><input type="radio" name="size" value='1' onChange={handleSizeChange} /> Moyen (1 carré)</label>
            <label><input type="radio" name="size" value='4' onChange={handleSizeChange} /> Grand (4 carrés)</label>
            <label><input type="radio" name="size" value='9' onChange={handleSizeChange} /> Énorme (9 carrés)</label>
            <label><input type="radio" name="size" value='16' onChange={handleSizeChange} /> Gargantuesque (16 carrés)</label>
            <div id="numberSelector">
              <label id="numberSelectionLabel"><br />Nombre de Minis à intégrer :<br /><input type="number" value={repeatValue} onChange={handleRepeatChange} /></label>
            </div>
            <button onClick={downloadImage}>Télécharger le mini</button>
            <button onClick={addImageToArmy}>Intégrer le Mini à l'armée</button>
          </div>
          <div id="miniPreview">
            <h3>Prévisualisation du mini :</h3>
            <img src={imagePreview} alt="Prévisualisation" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageEditor
