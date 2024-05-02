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

        // Définir la taille du canvas en pixels
        canvas.width = A4_WIDTH_PX
        canvas.height = A4_HEIGHT_PX

        // Dessiner un rectangle représentant la feuille A4
        ctx.strokeStyle = 'black'
        ctx.strokeRect(0, 0, A4_WIDTH_PX, A4_HEIGHT_PX)
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
