import React, { useState, useEffect, useRef } from 'react';

function ImageEditor({ imageUrl }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [baseImg, setBaseImg] = useState(null);
  const [Minis, setMinis] = useState([]);
  const [idCount, setIdCount] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [repeatValue, setRepeatValue] = useState(1);


  useEffect(() => {
    const baseImage = new Image();
    baseImage.onload = () => { //chargement de l'image de la base
      setBaseImg(baseImage);
    };
    baseImage.src = '../src/assets/images/Minibase.svg';
  }, []);

  useEffect(() => {
    if (imageUrl && baseImg) {
      const img = new Image();

      img.onload = () => {
        const baseWidth = img.width * 0.4; //définition de la taille automatique de la base et des espaces de pliures
        const baseHeight = img.height * 0.3;
        const foldStroke = img.height * 0.01;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = (img.width + baseWidth);
        canvas.height = ((img.height * 2) + (baseHeight * 2) + (foldStroke * 2));
        const centerXCanvas = ((canvas.width - img.width) / 2);
        const centerYCanvas = ((canvas.height - ((img.height * 2) + (foldStroke * 2))) / 2);

        ctx.save();
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(1, -1);
        ctx.drawImage(img, centerXCanvas, (-centerYCanvas - img.height - foldStroke));
        ctx.restore();
        ctx.drawImage(img, centerXCanvas, (centerYCanvas + img.height + foldStroke * 2));
        ctx.drawImage(baseImg, 0, 0, canvas.width, baseHeight);
        ctx.drawImage(baseImg, 0, (canvas.height - baseHeight + foldStroke), canvas.width, baseHeight);

        const dataURL = canvas.toDataURL('image/jpeg');

        setImagePreview(dataURL);
      };

      img.src = imageUrl;
    }
  }, [imageUrl, baseImg]);

  const downloadImage = () => {
    const downloadLink = document.createElement('a');
    downloadLink.href = imagePreview;
    downloadLink.download = 'image.jpg';
    downloadLink.click();
  };

  // Fonction pour ajouter un nouveau Mini au tableau qui servira de base à l'édition du canvas A4.
  const addImageToList = () => {
    const newMini = {
      id: idCount,
      image: imagePreview, // Fichier image courant au moment de l'appel de la méthode.
      number: repeatValue, // nombre de Minis intégrés à l'armée
      size: selectedSize, //Taille des Minis ajoutés à l'armée
    };
    setMinis([...Minis, newMini])
    setIdCount(idCount + 1) // Incrémente l'ID pour le prochain objet.
    console.log(Minis)
  };

  // Gestionnaire de la taille du Mini
  const handleSizeChange = (event) => {
    setSelectedSize(event.target.value)
  }

  const handleRepeatChange = (event) => {
    setRepeatValue(event.target.value)
  }


  return (
    <div>
      {imagePreview && (
        <div id="cropContainer">
          <div id="armyButtons">
            <label><input type="radio" name="size" value="XXXS" onChange={handleSizeChange} /> Fine (inférieur à 15cm)</label>
            <label><input type="radio" name="size" value="XXS" onChange={handleSizeChange} /> Minuscule (15 à 30 cm)</label>
            <label><input type="radio" name="size" value="XS" onChange={handleSizeChange} /> Très petit (30cm à 60cm)</label>
            <label><input type="radio" name="size" value="S" onChange={handleSizeChange} /> Petit (60cm à 1.5m)</label>
            <label><input type="radio" name="size" value="M" onChange={handleSizeChange} /> Moyen (1.5m à 3m)</label>
            <label><input type="radio" name="size" value="L" onChange={handleSizeChange} /> Grand (3m à 6m)</label>
            <label><input type="radio" name="size" value="XL" onChange={handleSizeChange} /> Très grand (6m à 12m)</label>
            <label><input type="radio" name="size" value="XXL" onChange={handleSizeChange} /> Gargantuesque (12m à 24m)</label>
            <label><input type="radio" name="size" value="XXXL" onChange={handleSizeChange} /> Colossal (24m et plus)</label>
            <div id="numberSelector">
              <label>Nombre de Minis à mobiliser :<br /><input type="number" value={repeatValue} onChange={handleRepeatChange} /></label>
            </div>
            <button onClick={downloadImage}>Télécharger le mini</button>
            <button onClick={addImageToList}>Intégrer le Mini à l'armée</button>
          </div>
          <div id="miniPreview">
            <h2>Prévisualisation du mini :</h2>
            <img src={imagePreview} alt="Prévisualisation" style={{ maxWidth: '100%', maxHeight: '400px' }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageEditor;
