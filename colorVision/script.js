 // Fonction pour générer une couleur aléatoire en hexadécimal
 function getRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
}

// Fonction pour convertir HEX en RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// Fonction pour convertir RGB en HEX
function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Fonction pour appliquer une matrice de transformation
function applyMatrix(rgb, matrix) {
    const r = Math.round(rgb.r * matrix[0][0] + rgb.g * matrix[0][1] + rgb.b * matrix[0][2]);
    const g = Math.round(rgb.r * matrix[1][0] + rgb.g * matrix[1][1] + rgb.b * matrix[1][2]);
    const b = Math.round(rgb.r * matrix[2][0] + rgb.g * matrix[2][1] + rgb.b * matrix[2][2]);
    return { r, g, b };
}

// Matrices de transformation pour les problèmes de vision
const protanopiaMatrix = [
    [0, 0.56667, 0.43333],
    [0, 0.55833, 0.44167],
    [0, 0, 0.24167]
];

const deuteranopiaMatrix = [
    [0.7, 0.3, 0],
    [0.3, 0.7, 0],
    [0, 0, 0.3]
];

const tritanopiaMatrix = [
    [0.5, 0, 0.5],
    [0, 0.5, 0.5],
    [0, 0, 1]
];

// Matrice pour le monochromatisme (conversion en niveaux de gris)
const monochromatismMatrix = [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114]
];

// Objet pour stocker la couleur principale et ses couleurs associées
const colorPalette = {
    couleur: {
        main: { color: getRandomColor() }, // Couleur principale aléatoire
        perceptions: [
            { color: '', visionIssueIndex: 0 }, // Protanopie
            { color: '', visionIssueIndex: 1 }, // Deutéranopie
            { color: '', visionIssueIndex: 2 }, // Tritanopie
            { color: '', visionIssueIndex: 3 }  // Monochromatisme
        ]
    }
};


// Fonction pour mettre à jour les couleurs associées
function updateColors() {
    const baseColor = colorPalette.couleur.main.color;
    const baseRgb = hexToRgb(baseColor);

    // Calculer les couleurs pour chaque problème de vision
    colorPalette.couleur.perceptions[0].color = rgbToHex(...Object.values(applyMatrix(baseRgb, protanopiaMatrix)));
    colorPalette.couleur.perceptions[1].color = rgbToHex(...Object.values(applyMatrix(baseRgb, deuteranopiaMatrix)));
    colorPalette.couleur.perceptions[2].color = rgbToHex(...Object.values(applyMatrix(baseRgb, tritanopiaMatrix)));
    colorPalette.couleur.perceptions[3].color = rgbToHex(...Object.values(applyMatrix(baseRgb, monochromatismMatrix))); // Monochromatisme
}

// Tableau des problèmes de vue
const visionIssues = [
    'Protanopie',
    'Deutéranopie',
    'Tritanopie',
    'Monochromatisme' // Ajout du monochromatisme
];

// Exemple d'utilisation : choisir une couleur principale
const selectedColor = colorPalette.couleur;
const container = document.querySelector('.container');

// Créer dynamiquement les divs et les ajouter au conteneur
const firstItem = document.createElement('div');
firstItem.className = 'item';
firstItem.style.backgroundColor = selectedColor.main.color;
container.appendChild(firstItem);

// Créer l'étiquette pour la couleur principale
const hexLabel = document.createElement('div');
hexLabel.className = 'label';
hexLabel.innerHTML = `Couleur initiale : <span>${selectedColor.main.color}</span>`;

// Ajouter un champ input invisible pour l'édition
const hexInput = document.createElement('input');
hexInput.type = 'text';
hexInput.value = selectedColor.main.color;
hexInput.style.display = 'none'; // Masquer l'input au départ
hexLabel.appendChild(hexInput);

firstItem.appendChild(hexLabel);

// Gestionnaire pour activer la modification
hexLabel.addEventListener('click', () => {
    hexInput.style.display = 'inline'; // Affiche l'input
    hexInput.focus(); // Met le focus sur l'input
    hexLabel.querySelector('span').style.display = 'none'; // Masque le texte
});

// Gestionnaire pour détecter les modifications
hexInput.addEventListener('input', () => {
    const newColor = hexInput.value;
    if (/^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(newColor)) {
        // Met à jour la couleur principale
        selectedColor.main.color = newColor;
        firstItem.style.backgroundColor = newColor;

        updateColors(); // Met à jour les couleurs associées

        // Met à jour les couleurs des éléments de perception
        const items = document.querySelectorAll('.item');
        items.forEach((item, index) => {
            if (index === 0) {
                item.style.backgroundColor = selectedColor.main.color; // Couleur principale
            } else {
                item.style.backgroundColor = selectedColor.perceptions[index - 1].color; // Couleur modifiée
            }
        });
    }
});

// Gestionnaire pour quitter le mode édition
hexInput.addEventListener('blur', () => {
    hexInput.style.display = 'none'; // Masque l'input
    hexLabel.querySelector('span').textContent = selectedColor.main.color; // Met à jour le texte affiché
    hexLabel.querySelector('span').style.display = 'inline'; // Affiche le texte
});

// Calculer initialement les couleurs associées
updateColors();

selectedColor.perceptions.forEach(perception => {
    const item = document.createElement('div');
    item.className = 'item';
    item.style.backgroundColor = selectedColor.perceptions[perception.visionIssueIndex].color;
    container.appendChild(item);

    // Créer l'étiquette pour chaque problème de vision
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = visionIssues[perception.visionIssueIndex]; // Récupère le problème de vue par son indice
    item.appendChild(label);
});

// Affiche la première colonne par défaut
firstItem.classList.add('show');

firstItem.addEventListener('mouseenter', () => {
    const items = document.querySelectorAll('.item');
    items.forEach((item, index) => {
        if (index !== 0) { // Ne pas changer la première colonne
            setTimeout(() => {
                item.classList.add('show');
                item.style.backgroundColor = selectedColor.perceptions[index - 1].color; // Applique la couleur correspondante
            }, index * 200); // Délai pour chaque colonne
        }
    });
});

firstItem.addEventListener('mouseleave', () => {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.classList.remove('show');
        item.style.backgroundColor = ''; // Réinitialise la couleur des autres colonnes
    });
    // Restaure la couleur principale pour la première colonne
    firstItem.style.backgroundColor = selectedColor.main.color;
});
