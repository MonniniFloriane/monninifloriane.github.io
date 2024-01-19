document.addEventListener("DOMContentLoaded", () => {
  const colorBoxes = document.querySelectorAll(".petiteBoite");

  const colorsData = [
    {
      description: 'midnightblue',
      color: '#191970',
      ////
      myColorDeut: '#00236E',
      myDeut: 'Deutéranopie',
      ///
      myColorPro: '#002C73',
      myPro: 'Protanopie',
      ///
      myColorTri: '#003243',
      myTri: 'Tritanopie'
    },
    // boite couleurs 2
    {
      description: 'Radishical',
      color: '#EB4579',
      ////
      myColorDeut: '#989175',
      myDeut: 'Deutéranopie',
      ///
      myColorPro: '#6C707A',
      myPro: 'Protanopie',
      ///
      myColorTri: '#FF255A',
      myTri: 'Tritanopie'
    },
    // boite couleurs 3
    {
      description: 'Purple Blue',
      color: '#5D1AE8',
      ////
      myColorDeut: '#004EE5',
      myDeut: 'Deutéranopie',
      ///
      myColorPro: '#0059ED',
      myPro: 'Protanopie',
      ///
      myColorTri: '#00618A',
      myTri: 'Tritanopie'
    },
    // boite couleurs 4
    {
      description: 'Demonic Purple',
      color: '#E41AE8',
      ////
      myColorDeut: '#5D8CE4',
      myDeut: 'Deutéranopie',
      ///
      myColorPro: '#0075ED',
      myPro: 'Protanopie',
      ///
      myColorTri: '#EB4A8A',
      myTri: 'Tritanopie'
    },
  ];

  let activeModal = null; // Pour stocker la référence de la modal actuellement ouverte

  const openModal = (box, index) => {
    // Fermer la modal active si elle existe
    if (activeModal) {
      activeModal.style.display = "none";
      activeModal = null;
    }

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.id = `modal-${index}`;
    document.body.appendChild(modal);

    const colorData = colorsData[index];

    modal.innerHTML =`
      <div style="background: ${colorData.color}; padding: 0 0 81px 0;">
        <p style="background: #F3F2EE;"><strong>${colorData.description}</strong><br>${colorData.color}</p>
      </div>
      <div style="background: ${colorData.myColorDeut}; padding: 0 0 81px 0;">
        <p style="background: #F3F2EE;"><strong>${colorData.myDeut}</strong></p>
      </div>
      <div style="background: ${colorData.myColorPro}; padding: 0 0 81px 0;">
        <p style="background: #F3F2EE;"><strong>${colorData.myPro}</strong></p>
      </div>
      <div style="background: ${colorData.myColorTri}; padding: 0 0 81px 0;">
        <p style="background: #F3F2EE;"><strong>${colorData.myTri}</strong></p>
      </div>
    `;

    const rect = box.getBoundingClientRect();
    modal.style.left = `${rect.left}px`;
    modal.style.top = `${rect.top - modal.offsetHeight - 10 + window.scrollY}px`;
    modal.style.display = "block";

    activeModal = modal;

    // Ajouter un gestionnaire d'événements pour fermer la modal lorsqu'on clique en dehors de la boîte de couleur
    document.addEventListener("click", closeModals);
  };

  const closeModals = (event) => {
    const clickedElement = event.target;

    // Si on clique sur une boîte de couleur, ne pas fermer la modal
    if (clickedElement.classList.contains("petiteBoite")) {
      return;
    }

    // Fermer la modal active si elle existe
    if (activeModal) {
      activeModal.style.display = "none";
      activeModal = null;
    }

    // Retirer le gestionnaire d'événements pour éviter de le rappeler à chaque clic
    document.removeEventListener("click", closeModals);
  };

  colorBoxes.forEach((box, index) => {
    box.addEventListener("click", () => openModal(box, index));
  });
});