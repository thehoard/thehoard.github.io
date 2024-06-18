import React, { useState, useRef, useEffect } from 'react'
import ReactCrop, {
  Crop,
  PixelCrop,
} from 'react-image-crop'
import { canvasPreview } from './CanvasPreview'
import { useDebounceEffect } from '../../node_modules/react-image-crop/src/demo/useDebounceEffect'
import 'react-image-crop/dist/ReactCrop.css'

interface ReactCropProps {
  onBlobUrlChange: (blobUrl: string) => void
}

export default function ImageCropper({ onBlobUrlChange }: ReactCropProps) {
  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    setCrop({
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5,
    })
  }

  useEffect(() => {
    if (completedCrop && imgRef.current && previewCanvasRef.current) {
      const image = imgRef.current

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      const offscreen = new OffscreenCanvas(
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      )
      const ctx = offscreen.getContext('2d')
      if (!ctx) {
        throw new Error('No 2d context')
      }

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        offscreen.width,
        offscreen.height
      )
      if (offscreen.height > 0 && offscreen.width > 0) { //cette condition permet d'éviter la mise à jour du state alors que l'utilisateur n'a pas encore croppé l'image
        offscreen.convertToBlob({ type: 'image/png' }).then(blob => {
          const urlCreator = window.URL || window.webkitURL
          const imageUrl = urlCreator.createObjectURL(blob)

          // on remonte l'image croppée au composant App à chaque changement du crop
          onBlobUrlChange(imageUrl)
        })
      }
    }
  }, [completedCrop])

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
        )
      }
    },
    100,
    [completedCrop],
  )

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(e.dataTransfer.files[0])
      e.dataTransfer.clearData()
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  function handleDropZoneClick() {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center">
      {!imgSrc && (
        <div className="flex flex-wrap justify-center items-center">
          <div className="flex justify-between items-center w-5/6 xl:w-3/5 3xl:p-44 p-10 sm:p-14 md:p-20 xl:p-24 2xl:p-24" id="welcomeContainer">
            <img className="w-1/3 mb-4 sm:w-1/4 md:w-2/5 lg:w-2/6 xl:w-1/3 2xl:w-2/5 3xl:w-2/6" id="welcomeGoblin" src='../src/assets/images/welcome-goblin.png' alt="gobelin souriant"></img>
            <p className="text-xs sm:text-lg md:text-2xl lg:text-3xl xl:text-3xl 3xl:text-6xl w-full h-full text-center" id="welcomeText">Un gobelin vous salue : <br />
              "L'Aventure vous attend voyageur ! Mais tout aventurier doit avoir des compagnons à ses cotés et adversaires à affronter.
              Je vais les créer pour vous : Commencez par faire passer une image dans le portail pour la personnaliser et l'ajouter à un parchemin que vous pourrez imprimer.
              Rassurez-vous : vous pourrez en mettre plusieurs"</p>
          </div>
          <div
            className="overflow-hidden w-4/6 xl:w-2/5 3xl:w-2/6 sm:w-2/4 mt-4 md:mt-0"
            id="portalControl"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleDropZoneClick}
          >
            <img src="../src/assets/images/portail.png" id="filePortal" alt="zone d'upload du fichier"></img>
            <input
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      )}
      {imgSrc && (
        <div className="flex flex-col items-center w-96">
          <p className="text-4xl md:text-6xl 3xl:text-8xl text-center sectionTitle">Créature</p>
          <button className="btn w-md" onClick={handleDropZoneClick}>Changer de créature</button>
          <input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {!!imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          minHeight={100}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            className="imgUploadCrop"
            src={imgSrc}
            onLoad={onImageLoad}
            style={{ width: '320px' }}
          />
        </ReactCrop>
      )}
      {!!completedCrop && (
        <>
          <div style={{ display: 'none' }}>
            <canvas
              ref={previewCanvasRef}
              width={completedCrop.width}
              height={completedCrop.height}
            />
          </div>
        </>
      )}
    </div>
  )
}
