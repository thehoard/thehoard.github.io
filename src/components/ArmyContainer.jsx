import React, { useRef, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import { A4_HEIGHT_PX, A4_WIDTH_PX, A4_HEIGHT_MM, A4_WIDTH_MM, mmToPx } from '../utils/util'

const PRINT_MARGIN = mmToPx(10);

const createNewCanvas = (containerRef) => {
    const newCanvas = document.createElement('canvas')
    newCanvas.width = A4_WIDTH_PX
    newCanvas.height = A4_HEIGHT_PX
    newCanvas.style.border = '1px solid black'
    containerRef.current.appendChild(newCanvas)
    const context = newCanvas.getContext('2d')
    context.fillStyle = 'white'
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
    let currentLineMaxHeight = 0
    let currentXPos = PRINT_MARGIN
    let currentYPos = PRINT_MARGIN

    useEffect(() => {
        if (!army || army.length === 0) return

        clearCanvases(containerRef, canvasRef) // Suppression des canvas précédents pour éviter les répétitions en cas d'ajout d'image
        let canvas = createNewCanvas(containerRef)
        canvasRef.current.push(canvas)

        army.forEach((mini) => {
            const image = new Image()

            image.onload = function () {
                for (let i = 1; i <= mini.number; i++) { // boucle de dessin du même mini
                    let nextXPos = currentXPos
                    let nextYPos = currentYPos

                    if (nextXPos + image.width > canvas.width - PRINT_MARGIN) {
                        nextXPos = PRINT_MARGIN
                        nextYPos += currentLineMaxHeight
                        currentLineMaxHeight = 0
                    }

                    if (nextYPos + image.height > canvas.height - PRINT_MARGIN) { //remise à zéro de la hauteur du curseur
                        nextXPos = PRINT_MARGIN
                        nextYPos = PRINT_MARGIN
                        //création d'un nouveau canvas
                        const newCanvas = createNewCanvas(containerRef)
                        canvasRef.current.push(newCanvas)
                    }

                    const ctx = canvasRef.current[canvasRef.current.length - 1].getContext('2d') //on sélectionne le dernier canvas dessiné pour y inscrire l'image
                    ctx.drawImage(image, nextXPos, nextYPos, image.width, image.height)

                    currentXPos = nextXPos + image.width
                    currentYPos = nextYPos
                    currentLineMaxHeight = Math.max(currentLineMaxHeight, image.height)
                }
            }

            image.src = mini.image
        })

    }, [army])

    const downloadArmy = () => {
        const doc = new jsPDF('portrait', 'mm', 'a4');

        canvasRef.current.forEach((canvas, index) => {
            const imgData = canvas.toDataURL('image/png');
            if (index > 0) {
                doc.addPage();
            }
            doc.addImage(imgData, 'PNG', 5, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
        });

        doc.save('Armée.pdf');
    }

    if (!army || army.length === 0) return null

    return (

        <div className="flex flex-col items-center">
            <h2 className="w-5/6 md:w-2/6 p-5 pt-8 mb-4 text-center text-xl mainTitle">Armée</h2>
            <button type="button" className="btn" onClick={downloadArmy}>Télécharger l'armée</button>
            <div id="flex flex-col items-center flex-wrap" ref={containerRef}></div>
        </div>
    )
}

export default ArmyContainer
