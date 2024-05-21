import React, { useState, useRef, useEffect } from 'react'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from 'react-image-crop'
import { canvasPreview } from './CanvasPreview'
import { useDebounceEffect } from '../../node_modules/react-image-crop/src/demo/useDebounceEffect'
import 'react-image-crop/dist/ReactCrop.css'

interface ReactCropProps {
  onBlobUrlChange: (blobUrl: string) => void
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageCropper({ onBlobUrlChange }: ReactCropProps) {
  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
  const blobUrlRef = useRef('')
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
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height))
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
    <div className="Crop-Container">
      <div
        className="Crop-Controls"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleDropZoneClick}
        style={{
          border: '2px dashed #cccccc',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer'
        }}
      >
        <p>Drag & Drop an image here or click to select a file</p>
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      </div>
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
            src={imgSrc}
            onLoad={onImageLoad}
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
