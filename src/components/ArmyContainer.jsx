import React, { useRef, useEffect } from 'react'

function ArmyContainer({ army }) {
    const canvasRef = useRef(null)
    let currentHeight = 0
    let currentWidth = 0

    const calculateA4CanvasSize = () => {
        // Dimensions d'une feuille A4 en mm
        const A4_WIDTH_MM = 210
        const A4_HEIGHT_MM = 297

        // Convertir les dimensions en pixels en fonction de la densité de pixels de l'écran
        const dpi = window.devicePixelRatio || 1
        const A4_WIDTH_PX = Math.floor(A4_WIDTH_MM * dpi * 3.7795) // 1mm = 3.7795 pixels
        const A4_HEIGHT_PX = Math.floor(A4_HEIGHT_MM * dpi * 3.7795) // 1mm = 3.7795 pixels

        // Définir la taille du canvas en pixels
        return { A4_WIDTH_PX, A4_HEIGHT_PX }
    }

    useEffect(() => {
        if (!army || army.length === 0) return // Si army est nul ou vide, le canvas n'est pas créé

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        const canvasSize = calculateA4CanvasSize()
        canvas.width = canvasSize.A4_WIDTH_PX
        canvas.height = canvasSize.A4_HEIGHT_PX

        // Dessiner un rectangle représentant la feuille A4
        ctx.strokeStyle = 'black'
        ctx.strokeRect(0, 0, canvas.width, canvas.height)

        army.forEach((mini) => {
            const image = new Image() // Instanciation de l'image du Mini
            image.onload = function () {
                for (let i = 0; i <= mini.number; i++) { // boucle de dessin du même mini
                    let cursor = cursorCalculator(image, canvas, currentHeight, currentWidth)
                    console.log(i)
                    currentHeight = cursor.currentHeight
                    currentWidth = cursor.currentWidth
                    DrawImage(image, cursor)
                }
            }
            image.src = mini.image
        })

    }, [army])

    const cursorCalculator = (image, canvas, currentHeight, currentWidth) => {

        let Y = currentHeight * image.height
        let X = currentWidth * image.width
        currentHeight++

        if (Y + image.height > canvas.height) {
            Y = 0
            currentHeight = 1
            currentWidth++
        }

        return { X, Y, currentHeight, currentWidth }

    }


    const DrawImage = (image, cursor) => {
        const ctx = canvasRef.current.getContext('2d')
        console.log(cursor)
        ctx.save()
        ctx.drawImage(image, cursor.X, cursor.Y, image.width, image.height)
        ctx.restore()
    }


    const downloadImage = () => {
        const canvas = canvasRef.current;
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = 'army.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // si army est nul le composant ne s'affiche pas
    if (!army || army.length === 0) return null

    return (
        <div id="armyContainer">
            <h2 id="armyContainerTitle">Armée</h2>
            <canvas ref={canvasRef} />
            {/* <button onClick={downloadImage}>Télécharger l'armée</button> */}
        </div>
    )
}

export default ArmyContainer
