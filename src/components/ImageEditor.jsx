import React, { useState, useEffect } from 'react'
import { mmToPx, A4_HEIGHT_PX } from '../utils/util'

const INCHES_TO_MM = 25.4 //les bases D&D sont exprimées en pouces, on les traduit en MM

const calculateBaseSize = (selectedSize) => { //calcul de la taille en pixel de la base
  const SQUARE_PX = mmToPx(INCHES_TO_MM)
  const baseWidth = SQUARE_PX * (selectedSize / 2)
  const baseHeight = baseWidth / 2
  return { baseWidth, baseHeight }
}

const resizetoA4MaxHeight = (aspectRatio, baseWidth, A4_HEIGHT_PX) => { // fonction de redimensionnement de l'image si elle dépasse la hauteur A4
  let resizedImageHeight = A4_HEIGHT_PX - baseWidth * 2
  let resizedImageWidth = baseWidth * aspectRatio
  return { resizedImageHeight, resizedImageWidth }
}

function ImageEditor({ imageUrl, onArmyChange }) {
  const [imagePreview, setImagePreview] = useState(null)
  const [baseImg, setBaseImg] = useState(null)
  const [army, setArmy] = useState([])
  const [selectedSize, setSelectedSize] = useState(1)
  const [repeatValue, setRepeatValue] = useState(1)
  const [resizedImageHeight, setResizedImageHeight] = useState(null)
  const [resizedImageWidth, setResizedImageWidth] = useState(null)

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

  const resizeImage = (img, baseWidth) => {

    const aspectRatio = img.width / img.height; // on calcule la taille de l'image en préservant le ratio du crop
    let resizedImageWidth = baseWidth;
    let resizedImageHeight = resizedImageWidth / aspectRatio;

    if (resizedImageHeight + baseWidth * 2 > A4_HEIGHT_PX) { // Si l'image est trop haute pour du A4 on la recalcule sous cette contrainte
      let newSizes = resizetoA4MaxHeight(aspectRatio, baseWidth, A4_HEIGHT_PX)
      resizedImageHeight = newSizes.resizedImageHeight;
      resizedImageWidth = newSizes.resizedImageWidth;
    }

    setResizedImageHeight(resizedImageHeight)
    setResizedImageWidth(resizedImageWidth)

    const canvas = document.createElement('canvas'); // création d'un canvas pour dessiner l'image redimensionnée
    canvas.width = resizedImageWidth;
    canvas.height = resizedImageHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, resizedImageWidth, resizedImageHeight);

    const resizedImageDataUrl = canvas.toDataURL('image/jpeg'); //enregistrement d'un URL pour l'image redimensionnée

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

    resizedImage.onload = () => { //au chargement de l'image redimensionnée, on la dessine sur le canvas de prévisualisation.

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = baseWidth
      canvas.height = ((resizedImage.height * 2) + (baseHeight * 2) + (foldStroke * 2))
      const centerYCanvas = ((canvas.height - ((resizedImage.height * 2) + (foldStroke * 2))) / 2)
      const centerXCanvas = (canvas.width - resizedImage.width) / 2

      ctx.save()
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(1, -1)
      ctx.drawImage(resizedImage, centerXCanvas, (-centerYCanvas - resizedImage.height - foldStroke)) //dessin de l'image inversée
      ctx.restore()
      ctx.drawImage(resizedImage, centerXCanvas, (centerYCanvas + resizedImage.height + foldStroke * 2)) //dessin de l'image normale
      ctx.drawImage(baseImg, 0, 0, canvas.width, baseHeight) //dessin des bases
      ctx.drawImage(baseImg, 0, (canvas.height - baseHeight + foldStroke), canvas.width, baseHeight)
      ctx.save()

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
      image: imagePreview,
      number: repeatValue,
      imageWidth: resizedImageWidth
    }
    // Tri des minis en fonction de la largeur de l'image
    const sortedArmy = [...army, newMini].sort((a, b) => b.imageWidth - a.imageWidth)
    setArmy(sortedArmy)
    onArmyChange(sortedArmy)
    console.log(sortedArmy)
  }

  return (
    <div>
      {imagePreview && (
        <div id="armyControls">
          <div id="armyButtons">
            <h2>Choix de la taille</h2>
            <label><input type="radio" name="size" value='0.25' onChange={event => setSelectedSize(event.target.value)} /> Minuscule (1/4 carré)</label>
            <label><input type="radio" name="size" value='0.5' onChange={event => setSelectedSize(event.target.value)} /> Petit (0.5 carré)</label>
            <label><input type="radio" name="size" value='1' onChange={event => setSelectedSize(event.target.value)} /> Moyen (1 carré)</label>
            <label><input type="radio" name="size" value='4' onChange={event => setSelectedSize(event.target.value)} /> Grand (4 carrés)</label>
            <label><input type="radio" name="size" value='8' onChange={event => setSelectedSize(event.target.value)} /> Énorme (8 carrés)</label>
            <div id="numberSelector">
              <label id="numberSelectionLabel"><br />Choix du terrain :<br /></label>
              <label>
                <input type="radio" name="terrain" value='-grass' class="baseSelectorRadio" onChange={handleBaseChange} />
                <img src="../src/assets/images/Minibase-grass.svg" alt="Herbe" class="baseSelector"/>
              </label>
              <label>
                <input type="radio" name="terrain" value='-sand' class="baseSelectorRadio" onChange={handleBaseChange} />
                <img src="../src/assets/images/Minibase-sand.svg" alt="Sable" class="baseSelector"/>
              </label>
              <label>
                <input type="radio" name="terrain" value='-cobblestone' class="baseSelectorRadio" onChange={handleBaseChange} />
                <img src="../src/assets/images/Minibase-cobblestone.svg" alt="Pavés" class="baseSelector"/>
              </label>
              <label>
                <input type="radio" name="terrain" value='-lava' class="baseSelectorRadio" onChange={handleBaseChange} />
                <img src="../src/assets/images/Minibase-lava.svg" alt="Lave" class="baseSelector"/>
              </label>
            </div>
            <div id="numberSelector">
              <label id="numberSelectionLabel"><br />Nombre de Minis à intégrer :<br /><input type="number" value={repeatValue} onChange={event => setRepeatValue(event.target.value)} /></label>
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
