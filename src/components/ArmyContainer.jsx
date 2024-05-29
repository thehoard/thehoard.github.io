import React, { useRef, useEffect } from 'react'
import { jsPDF } from 'jspdf'

// Dimensions d'une feuille A4 en mm
const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

const calculateA4CanvasSize = () => {
    const dpi = window.devicePixelRatio || 1
    const A4_WIDTH_PX = Math.floor(A4_WIDTH_MM * dpi * 3.7795) // 1mm = 3.7795 pixels
    const A4_HEIGHT_PX = Math.floor(A4_HEIGHT_MM * dpi * 3.7795) // 1mm = 3.7795 pixels

    return { A4_WIDTH_PX, A4_HEIGHT_PX }
}

const createNewCanvas = (containerRef) => {
    const newCanvas = document.createElement('canvas')
    const canvasSize = calculateA4CanvasSize()
    newCanvas.width = canvasSize.A4_WIDTH_PX
    newCanvas.height = canvasSize.A4_HEIGHT_PX
    newCanvas.style.border = '1px solid black'
    containerRef.current.appendChild(newCanvas)
    const context = newCanvas.getContext('2d')
    context.fillStyle = '#FCF5E5'
    context.fillRect(0, 0, newCanvas.width, newCanvas.height)
    return newCanvas
}

const clearCanvases = (containerRef, canvasRef) => {
    while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
    }
    canvasRef.current = []
}

function ArmyContainer({ army }) {

    const containerRef = useRef(null)
    const canvasRef = useRef([])

    useEffect(() => {
        if (!army || army.length === 0) return

        clearCanvases(containerRef, canvasRef) // Suppression des canvas précédents pour éviter les répétitions en cas d'ajout d'image
        let canvas = createNewCanvas(containerRef)
        canvasRef.current.push(canvas)
        let currentHeight = 0
        let currentWidth = 0
        let previousImageWidth = null

        army.forEach((mini) => {
            const image = new Image()
            image.onload = function () {
                for (let i = 1; i <= mini.number; i++) { // boucle de dessin du même mini
                    let cursor = cursorCalculator(image, currentHeight, currentWidth, previousImageWidth, canvas)
                    const ctx = canvasRef.current[canvasRef.current.length - 1].getContext('2d') //on sélectionne le dernier canvas dessiné pour y inscrire l'image
                    ctx.drawImage(image, cursor.X, cursor.Y, image.width, image.height)
                    currentHeight = cursor.currentHeight
                    currentWidth = cursor.currentWidth
                    previousImageWidth = image.width
                }
            }
            image.src = mini.image
        })

    }, [army])

    const cursorCalculator = (image, currentHeight, currentWidth, previousImageWidth, canvas) => {
        let Y = currentHeight
        let X = currentWidth

        if (currentHeight + image.height > canvas.height) { //remise à zéro de la hauteur du curseur
            Y = 0
            currentHeight = 0
            currentWidth += previousImageWidth || image.width
        }

        if (currentWidth + previousImageWidth > canvas.width) { //création d'un nouveau canvas
            const newCanvas = createNewCanvas(containerRef)
            canvasRef.current.push(newCanvas)
            currentHeight = 0
            currentWidth = 0
            previousImageWidth = null
        }

        Y = currentHeight
        X = currentWidth
        currentHeight += image.height

        return { X, Y, currentHeight, currentWidth }
    }

    const downloadArmy = () => {
        const doc = new jsPDF('portrait', 'mm', 'a4');

        canvasRef.current.forEach((canvas, index) => {
            const imgData = canvas.toDataURL('image/png');
            if (index > 0) {
                doc.addPage();
            }
            doc.addImage(imgData, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
        });

        doc.save('Armée.pdf');
    }

    if (!army || army.length === 0) return null

    return (
        <div>
            <div id="canvasControls">
                <h2 id="armyContainerTitle">Armée</h2>
                <button type="button" class="btn btn-primary btn-lg btn-block" onClick={downloadArmy}>Télécharger l'armée</button>
            </div>
            <div id="armyContainer" ref={containerRef}></div>
        </div>
    )
}

export default ArmyContainer
