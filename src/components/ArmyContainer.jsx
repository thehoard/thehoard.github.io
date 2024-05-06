import React, { useRef, useEffect } from 'react'

function ArmyContainer({ army }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (!army || army.length === 0) return; // Si army est nul ou vide, le canvas n'est pas créé

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        const canvasSize = calculateA4CanvasSize()
        canvas.width = canvasSize.A4_WIDTH_PX
        canvas.height = canvasSize.A4_HEIGHT_PX

        // Dessiner un rectangle représentant la feuille A4
        ctx.strokeStyle = 'black'
        ctx.strokeRect(0, 0, canvas.width, canvas.height)

        const rotateAndDrawImage = (image) => { //fonction de redimensionnement et dessin de l'image par rapport à ses dimensions

            console.log("largeur naturelle : ", image.width)
            console.log("largeur A4 : ", canvas.height)
            console.log("hauteur naturelle : ", image.height)

            if (image.width > canvas.width) { // Si la future largeur de l'image dépasse celle du Canvas alors on tourne l'image de 90deg

                ctx.save() // on enregistre le contexte vertical du canvas
                ctx.translate(image.width, 0); // Translation pour positionner l'image
                ctx.rotate(Math.PI / 2); // Rotation de 90 degrés
                ctx.drawImage(image, 0, 0, image.height, image.width); // Dessin de l'image avec les dimensions modifiées
                ctx.restore() // on remet le canvas à la verticale après déssiné l'image.

            } else { // Sinon on la dessine verticalement
                ctx.drawImage(image, 0, 0, image.width, image.height)
            }
        }

        army.forEach((mini) => {

            for (let i = 0; i < mini.number; i++) {
                const image = new Image() // Instanciation d'une image

                image.onload = function () {
                    rotateAndDrawImage(image)
                }
                image.src = mini.image
            }
        });



    }, [army])

    const calculateA4CanvasSize = () => {
        // Dimensions d'une feuille A4 en mm
        const A4_WIDTH_MM = 210
        const A4_HEIGHT_MM = 297
        const SQUARE_MM = 25.4

        // Convertir les dimensions en pixels en fonction de la densité de pixels de l'écran
        const dpi = window.devicePixelRatio || 1
        const A4_WIDTH_PX = Math.floor(A4_WIDTH_MM * dpi * 3.7795) // 1mm = 3.7795 pixels
        const A4_HEIGHT_PX = Math.floor(A4_HEIGHT_MM * dpi * 3.7795) // 1mm = 3.7795 pixels
        const SQUARE_PX = Math.floor(SQUARE_MM * dpi * 3.7795)
        const TOTAL_SQUARES_A4 = Math.floor((A4_WIDTH_PX / SQUARE_PX) * (A4_HEIGHT_PX / SQUARE_PX))
        console.log("A4 hauteur en pixels : ", A4_HEIGHT_PX)
        console.log("carré en pixels : ", SQUARE_PX)
        console.log("nombre total de carrés : ", TOTAL_SQUARES_A4)
        console.log("nombre de carrés en largeur : ", A4_WIDTH_PX / SQUARE_PX)
        console.log("nombre de carrés en hauteur : ", A4_HEIGHT_PX / SQUARE_PX)

        // Définir la taille du canvas en pixels
        return { A4_WIDTH_PX, A4_HEIGHT_PX }
    }

    // si army est nul le composant ne s'affiche pas
    if (!army || army.length === 0) return null;

    return (
        <div id="armyContainer">
            <h2 id="armyContainerTitle">Armée</h2>
            <canvas ref={canvasRef} />
        </div>
    )
}

export default ArmyContainer
