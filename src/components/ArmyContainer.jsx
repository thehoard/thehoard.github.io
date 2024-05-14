import React, { useRef, useEffect } from 'react';

function ArmyContainer({ army }) {
    const canvasRef = useRef(null);
    let rowNumber = 0
    let imageIteration = 0
    let placeY = null
    let placeX = null
    let remainingRowWidth = null

    useEffect(() => {
        if (!army || army.length === 0) return; // Si army est nul ou vide, le canvas n'est pas créé

        army.sort((a, b) => a.imageHeight - b.imageHeight);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const canvasSize = calculateA4CanvasSize();
        canvas.width = canvasSize.A4_WIDTH_PX;
        canvas.height = canvasSize.A4_HEIGHT_PX;

        // Dessiner un rectangle représentant la feuille A4
        ctx.strokeStyle = 'black';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);


        army.forEach((mini) => {
            const image = new Image() // Instanciation de l'image du Mini
            image.onload = function () {
                let rows = RowsCalculator(mini, canvas, image, remainingRowWidth)
                let imagesPerRow = rows.imagesPerRow

                for (let i = 0; i < mini.number; i++) { // boucle de dessin du même mini
                    rotateAndDrawImage(image, imagesPerRow, canvas);
                }
            }
            image.src = mini.image;
        });

    }, [army]);

    const calculateA4CanvasSize = () => {
        // Dimensions d'une feuille A4 en mm
        const A4_WIDTH_MM = 210;
        const A4_HEIGHT_MM = 297;

        // Convertir les dimensions en pixels en fonction de la densité de pixels de l'écran
        const dpi = window.devicePixelRatio || 1;
        const A4_WIDTH_PX = Math.floor(A4_WIDTH_MM * dpi * 3.7795); // 1mm = 3.7795 pixels
        const A4_HEIGHT_PX = Math.floor(A4_HEIGHT_MM * dpi * 3.7795); // 1mm = 3.7795 pixels
        console.log("A4 canvs width : ", A4_WIDTH_PX)

        // Définir la taille du canvas en pixels
        return { A4_WIDTH_PX, A4_HEIGHT_PX };
    };

    const rotateAndDrawImage = (image, imagesPerRow, canvas) => { //fonction de redimensionnement et dessin de l'image par rapport à ses dimensions

        const ctx = canvasRef.current.getContext('2d'); // Obtenez le contexte 2D du canvas ici
        const placement = placementCalculator(image, placeX, placeY, imagesPerRow, canvas, remainingRowWidth)
        placeX = placement.placeX
        placeY = placement.placeY

        if (image.width > canvas.width) { // Si la future largeur de l'image dépasse celle du Canvas alors on tourne l'image de 90deg
            ctx.save(); // on enregistre le contexte vertical du canvas
            ctx.translate(image.width, 0); // Translation pour positionner l'image
            ctx.rotate(Math.PI / 2); // Rotation de 90 degrés
            ctx.drawImage(image, placeX, placeY, image.height, image.width); // Dessin de l'image avec les dimensions modifiées
            ctx.restore(); // on remet le canvas à la verticale après dessiné l'image.
        } else { // Sinon on la dessine verticalement
            ctx.drawImage(image, placeX, placeY, image.width, image.height);
        }
    };

    const RowsCalculator = (mini, canvas, image) => {
        const imagesPerRow = Math.floor(canvas.width / image.width)
        const numberOfRows = Math.ceil(mini.number / imagesPerRow)
        return { numberOfRows, imagesPerRow }
    }

    const placementCalculator = (image, placeX, placeY, imagesPerRow, canvas, remainingRowWidth) => {

        if (imageIteration >= imagesPerRow) {
            rowNumber++
            placeY = image.height * rowNumber
            placeX = 0
            imageIteration = 0
            remainingRowWidth = null
        }
        else {
            placeX = image.width * imageIteration
            imageIteration++
            remainingRowWidth = canvas.width - (placeX + image.width)
            // console.log("remainingRowWidth : ", remainingRowWidth)
            // console.log("rowNumber : ", rowNumber)
            // console.log("image height : ", image.height)
            // console.log("placeY : ", placeY)
        }
        return { placeX, placeY }
    }

    // si army est nul le composant ne s'affiche pas
    if (!army || army.length === 0) return null;

    return (
        <div id="armyContainer">
            <h2 id="armyContainerTitle">Armée</h2>
            <canvas ref={canvasRef} />
        </div>
    );
}

export default ArmyContainer;
