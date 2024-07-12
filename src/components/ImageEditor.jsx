import React, { useState, useEffect } from 'react'
import { mmToPx, A4_HEIGHT_PX_MARGINS } from '../utils/util'
import Pica from 'pica'

const pica = Pica()
const INCHES_TO_MM = 25.4 // Les bases D&D sont exprimées en pouces, on les traduit en MM

const calculateBaseSize = (selectedSize) => {
  const SQUARE_PX = mmToPx(INCHES_TO_MM)
  const baseWidth = SQUARE_PX * (selectedSize / 2)
  const baseHeight = baseWidth / 2
  return { baseWidth, baseHeight }
}

const resizetoA4MaxHeight = (aspectRatio, baseWidth, A4_HEIGHT_PX_MARGINS) => {
  let resizedImageHeight = A4_HEIGHT_PX_MARGINS - baseWidth * 2
  let resizedImageWidth = baseWidth * aspectRatio
  return { resizedImageHeight, resizedImageWidth }
}

function ImageEditor({ imageUrl, onArmyChange }) {
  const [imagePreview, setImagePreview] = useState(null)
  const [baseImg, setBaseImg] = useState(null)
  const [baseImgSrc, setBaseImgSrc] = useState('../src/assets/images/Minibase-grass.svg')
  const [army, setArmy] = useState([])
  const [selectedSize, setSelectedSize] = useState(1)
  const [repeatValue, setRepeatValue] = useState(1)
  const [resizedImageHeight, setResizedImageHeight] = useState(null)
  const [resizedImageWidth, setResizedImageWidth] = useState(null)

  useEffect(() => {
    if (imageUrl) {
      const img = new Image()
      img.onload = () => {
        const baseImg = new Image()
        baseImg.onload = () => {
          setBaseImg(baseImg)
          drawCanvas(img, baseImg, selectedSize)
        }
        baseImg.src = baseImgSrc
      }
      img.src = imageUrl
    }
  }, [imageUrl, selectedSize, baseImgSrc])

  const resizeImage = (img, baseWidth) => {
    const aspectRatio = img.width / img.height
    let resizedImageWidth = baseWidth
    let resizedImageHeight = resizedImageWidth / aspectRatio

    if (resizedImageHeight + baseWidth * 2 > A4_HEIGHT_PX_MARGINS) {
      let newSizes = resizetoA4MaxHeight(aspectRatio, baseWidth, A4_HEIGHT_PX_MARGINS)
      resizedImageHeight = newSizes.resizedImageHeight
      resizedImageWidth = newSizes.resizedImageWidth
    }

    setResizedImageHeight(resizedImageHeight)
    setResizedImageWidth(resizedImageWidth)

    const offScreenCanvas = document.createElement('canvas')
    offScreenCanvas.width = resizedImageWidth
    offScreenCanvas.height = resizedImageHeight
    const offScreenCtx = offScreenCanvas.getContext('2d')
    offScreenCtx.drawImage(img, 0, 0, resizedImageWidth, resizedImageHeight)

    const resizedImageDataUrl = offScreenCanvas.toDataURL('image/png')
    return resizedImageDataUrl
  }

  const processImageWithPica = async (img) => {
    const offScreenCanvas = document.createElement('canvas')
    offScreenCanvas.width = img.width
    offScreenCanvas.height = img.height
    const offScreenCtx = offScreenCanvas.getContext('2d')
    offScreenCtx.drawImage(img, 0, 0)

    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height

    await pica.resize(offScreenCanvas, canvas, {
      unsharpAmount: 160,
      unsharpRadius: 0.6,
      unsharpThreshold: 1
    })

    const resizedImageDataUrl = canvas.toDataURL('image/png')
    return resizedImageDataUrl
  }

  const drawCanvas = (img, baseImg, selectedSize) => {
    const { baseWidth, baseHeight } = calculateBaseSize(selectedSize)
    const foldStroke = 2

    const resizedImageSrc = resizeImage(img, baseWidth)
    const resizedImage = new Image()

    resizedImage.onload = () => {
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
      ctx.drawImage(resizedImage, centerXCanvas, (-centerYCanvas - resizedImage.height - foldStroke))
      ctx.restore()
      ctx.drawImage(resizedImage, centerXCanvas, (centerYCanvas + resizedImage.height + foldStroke * 2))
      ctx.drawImage(baseImg, 0, 0, canvas.width, baseHeight)
      ctx.drawImage(baseImg, 0, (canvas.height - baseHeight + foldStroke), canvas.width, baseHeight)
      ctx.save()

      const dataURL = canvas.toDataURL('image/png')
      setImagePreview(dataURL)
    }

    resizedImage.src = resizedImageSrc
  }

  const downloadImage = () => {
    const downloadLink = document.createElement('a')
    downloadLink.href = imagePreview
    downloadLink.download = 'image.png'
    downloadLink.click()
  }

  const addImageToArmy = async () => {
    const img = new Image()
    img.onload = async () => {

      const resizedImageSrc = await processImageWithPica(img)

      const newMini = {
        image: resizedImageSrc,
        number: repeatValue,
        imageWidth: resizedImageWidth
      }

      const sortedArmy = [...army, newMini].sort((a, b) => b.imageWidth - a.imageWidth)
      setArmy(sortedArmy)
      onArmyChange(sortedArmy)
    }
    img.src = imagePreview
  }

  const handleBaseChange = (event) => {
    const newBaseSrc = event.target.value
    const baseSrcString = `../src/assets/images/Minibase${newBaseSrc}.svg`
    setBaseImgSrc(baseSrcString)
  }

  return (
    <div>
      {imagePreview && (
        <div className="flex flex-row justify-center flex-wrap">
          <div className="
            flex flex-col items-center 
            mr-20 ml-20 md:mr-auto md:ml-auto 3xl:mr-80 3xl:ml-80"
          >
            <p className="text-4xl md:text-5xl 3xl:text-8xl sectionTitle mb-4">Personnalisation</p>
            <h2 className="text-2xl 2xl:text-4xl 3xl:text-5xl 3xl:m-10 customizationSection">Choix de la taille</h2>
            <label className="xl: text-xl 3xl:text-4xl"><input type="radio" className="xl:w-4 xl:h-4" name="size" value='0.25' onChange={event => setSelectedSize(event.target.value)} /> Minuscule (1/4 carré)</label>
            <label className="xl: text-xl 3xl:text-4xl"><input type="radio" className="xl:w-4 xl:h-4" name="size" value='0.5' onChange={event => setSelectedSize(event.target.value)} /> Petit (0.5 carré)</label>
            <label className="xl: text-xl 3xl:text-4xl"><input type="radio" className="xl:w-4 xl:h-4" name="size" value='1' onChange={event => setSelectedSize(event.target.value)} defaultChecked /> Moyen (1 carré)</label>
            <label className="xl: text-xl 3xl:text-4xl"><input type="radio" className="xl:w-4 xl:h-4" name="size" value='4' onChange={event => setSelectedSize(event.target.value)} /> Grand (4 carrés)</label>
            <label className="xl: text-xl 3xl:text-4xl"><input type="radio" className="xl:w-4 xl:h-4" name="size" value='8' onChange={event => setSelectedSize(event.target.value)} /> Énorme (8 carrés)</label>
            <div className="flex flex-col items-center m-2">
              <h2 className="text-2xl 2xl:text-4xl 3xl:text-5xl 3xl:mt-12 customizationSection">Choix du terrain</h2>
              <div className="flex flex-row rounded-md m-5 p-2 baseSelectorContainer 3xl:p-4">
                <label>
                  <input type="radio" name="terrain" value='-grass' className="hidden" onChange={handleBaseChange} />
                  <img src="../src/assets/images/Minibase-grass.svg" alt="Herbe" className="w-12 h-12 3xl:w-24 3xl:h-24 object-cover cursor-pointer m-1" />
                </label>
                <label>
                  <input type="radio" name="terrain" value='-sand' className="hidden" onChange={handleBaseChange} />
                  <img src="../src/assets/images/Minibase-sand.svg" alt="Sable" className="w-12 h-12 3xl:w-24 3xl:h-24 object-cover cursor-pointer m-1" />
                </label>
                <label>
                  <input type="radio" name="terrain" value='-cobblestone' className="hidden" onChange={handleBaseChange} />
                  <img src="../src/assets/images/Minibase-cobblestone.svg" alt="Pavés" className="w-12 h-12 3xl:w-24 3xl:h-24 object-cover cursor-pointer m-1" />
                </label>
                <label>
                  <input type="radio" name="terrain" value='-lava' className="hidden" onChange={handleBaseChange} />
                  <img src="../src/assets/images/Minibase-lava.svg" alt="Lave" className="w-12 h-12 3xl:w-24 3xl:h-24 object-cover cursor-pointer m-1" />
                </label>
                <label>
                  <input type="radio" name="terrain" value='-white' className="hidden" onChange={handleBaseChange} />
                  <img src="../src/assets/images/Minibase-white.svg" alt="Blanc" className="w-12 h-12 3xl:w-24 3xl:h-24 object-cover cursor-pointer m-1" />
                </label>
              </div>
            </div>

            <label className="
              flex flex-col items-center text-center customizationSection 
              m-2 3xl:m-12
              text-xl 2xl:text-4xl 3xl:text-5xl"
            >Nombre de Minis à enrôler
              <input type="number"
                className="appearance-none text-center text-3xl w-1/5 rounded-md numberInput 3xl:mt-6"
                value={repeatValue}
                onChange={event => setRepeatValue(event.target.value)}
              />
            </label>

            <button type="button" className="btn" onClick={addImageToArmy}>Enrôler dans l'armée</button>
          </div>
          <div className="flex flex-col items-center w-96 xl:h-fixed30 2xl:h-fixed35">
            <p className="text-4xl md:text-5xl 3xl:text-8xl sectionTitle">Prévisualisation</p>
            <button type="button" className="btn" onClick={downloadImage}>Télécharger le mini seul</button>
            <img src={imagePreview} alt="Prévisualisation" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageEditor
