import React, { useRef, useEffect } from 'react'

function ArmyContainer({ army }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (!army || army.length === 0) return; // Si army est nul ou vide, le canvas n'est pas créé

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        // Dimensions d'une feuille A4 en mm
        const A4_WIDTH_MM = 210
        const A4_HEIGHT_MM = 297

        // Convertir les dimensions en pixels en fonction de la densité de pixels de l'écran
        const dpi = window.devicePixelRatio || 1
        const A4_WIDTH_PX = Math.floor(A4_WIDTH_MM * dpi * 3.7795) // 1mm = 3.7795 pixels
        const A4_HEIGHT_PX = Math.floor(A4_HEIGHT_MM * dpi * 3.7795) // 1mm = 3.7795 pixels
        console.log(A4_HEIGHT_PX)

        // Définir la taille du canvas en pixels
        canvas.width = A4_WIDTH_PX
        canvas.height = A4_HEIGHT_PX

        // Dessiner un rectangle représentant la feuille A4
        ctx.strokeStyle = 'black'
        ctx.strokeRect(0, 0, A4_WIDTH_PX, A4_HEIGHT_PX)

        const resizeAndDrawImage = (image) => { //fonction de redimensionnement et dessin de l'image par rapport à la hauteur
            const aspectRatio = image.width / image.height
            const resizedImageHeight = A4_HEIGHT_PX; // On calcule les futures dimensions de l'image
            const resizedImageWidth = (resizedImageHeight * aspectRatio)

            console.log("future largeur : ", resizedImageWidth)
            console.log("future hauteur : ", resizedImageWidth)

            console.log("hauteur naturelle : ", image.height)
            console.log("largeur naturelle : ", image.width)
            console.log("aspect ratio : ", aspectRatio)

            if (resizedImageWidth > A4_WIDTH_PX) { // Si la future largeur de l'image dépasse celle du Canvas alors on tourne l'image de 90deg
                image.height = A4_WIDTH_PX
                image.width = image.height
                // console.log("rotation")
                // console.log("hauteur modifiée : ", image.height)
                // console.log("largeur modifiée: ", image.width)
                ctx.translate(image.width, 0); // Translation pour positionner l'image
                ctx.rotate(Math.PI / 2); // Rotation de 90 degrés
                ctx.drawImage(image, 0, 0, image.height, image.width); // Dessin de l'image avec les dimensions modifiées
            } else { // Sinon on la dessine verticalement
                image.height = A4_HEIGHT_PX
                image.width = (image.height * aspectRatio)
                // console.log("hauteur modifiée : ", image.height)
                // console.log("largeur modifiée: ", image.width)
                ctx.drawImage(image, 0, 0, image.height, image.width)
            }
        }

        army.forEach((mini) => {

            for (let i = 0; i < mini.number; i++) {
                const image = new Image() // Instanciation d'une image

                image.onload = function () {
                    ctx.save() // on enregistre le contexte actuel du canvas (à la verticale)
                    resizeAndDrawImage(image)
                    ctx.restore()
                }
                image.src = mini.image
            }
        });



    }, [army])

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
