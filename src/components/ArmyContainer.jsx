import React, { useRef, useEffect } from 'react'

function ArmyContainer({ army }) {
    const canvasRef = useRef(null)
    let imageIteration = 0
    let placeY = 0
    let placeX = 0
    let totalHeight = 0
    let rowHeight = []

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
            console.log("CHANGE")
            const image = new Image() // Instanciation de l'image du Mini
            image.onload = function () {
                for (let i = 0; i < mini.number; i++) { // boucle de dessin du même mini
                    rotateAndDrawImage(image, canvas)
                    console.log("itérations boucle : ", i)
                }
                ctx.save()
                console.log("teub")
            }
            image.src = mini.image
        })

    }, [army])

    const placementCalculator = (image, placeX, placeY, canvas) => {

        console.log("placeX + imagewidth : ", placeX + image.width)

        if (canvas.width < (placeX + image.width * 2)) { // saut de ligne
            console.log("canvas width boucle : ", canvas.width)
            console.log("saut de ligne")
            placeX = 0 //on replace les images à gauche du canvas
            imageIteration = 0 // on réinitilise l'incrémentation de placement horizontale
            placeY = placeY + Math.max(...rowHeight)
            console.log("totalHeight : ", totalHeight) // on récupère la hauteur de l'image la plus haute du rang et on l'incrémente
            rowHeight = [] // on réinitialise la hauteur du rang
        } else {
            if (imageIteration !== 0) {
                placeX = image.width + placeX
            }

            imageIteration++
            rowHeight.push(image.height)
        }
        return { placeX, placeY }
    }


    const rotateAndDrawImage = (image, canvas) => { //fonction de redimensionnement et dessin de l'image par rapport à ses dimensions
        console.log("rotate and Draw")
        const ctx = canvasRef.current.getContext('2d')
        const placement = placementCalculator(image, placeX, placeY, canvas)
        placeX = placement.placeX
        placeY = placement.placeY
        console.log("place X dessin : ", placeX)
        console.log("place Y dessin : ", placeY)
        if (image.width > canvas.width) { // Si la future largeur de l'image dépasse celle du Canvas alors on tourne l'image de 90deg
            ctx.save() // on enregistre le contexte vertical du canvas
            ctx.translate(image.width, 0) // Translation pour positionner l'image
            ctx.rotate(Math.PI / 2) // Rotation de 90 degrés
            ctx.drawImage(image, placeX, placeY, image.height, image.width) // Dessin de l'image avec les dimensions modifiées
            ctx.restore() // on remet le canvas à la verticale après dessiné l'image.
        } else { // Sinon on la dessine verticalement
            console.log("dessin")
            ctx.drawImage(image, placeX, placeY, image.width, image.height)
        }
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
