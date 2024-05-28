const PIXELS_IN_MM = 3.7795
export const A4_WIDTH_MM = 210 // Dimensions d'une feuille A4 en mm
export const A4_HEIGHT_MM = 297
export const dpi = window.devicePixelRatio || 1
export const A4_WIDTH_PX = Math.floor(A4_WIDTH_MM * dpi * PIXELS_IN_MM)
export const A4_HEIGHT_PX = Math.floor(A4_HEIGHT_MM * dpi * PIXELS_IN_MM)

export const mmToPx = (sizeInMm) => {
    return Math.floor(sizeInMm * dpi * PIXELS_IN_MM)
}






