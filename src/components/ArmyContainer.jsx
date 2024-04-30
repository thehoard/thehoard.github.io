import React, { useRef, useEffect } from 'react';

const A4Canvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Taille A4 standard en pixels (210mm x 297mm à 96dpi)
        const width = 794; // (210mm * 96dpi) / 25.4mm
        const height = 1123; // (297mm * 96dpi) / 25.4mm

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

    }, []);

    return <canvas ref={canvasRef} />;
};

export default A4Canvas;