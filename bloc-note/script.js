/*Faire apparaitre à n'importe que endroit de la fenetre une note
    -> document.createElement() et appendChild()

- à n'importe quel endroit de la fenêtre
    -> position:absolute left right

- une note
 -> div : barre de titre + div + textarea
*/

//color aléatoire
let colorChoice = [
    "rgb(255, 255, 112)",
    "rgb(112, 241, 255)", 
    "rgb(255, 160, 7)",
    "rgb(119, 250, 119)",
    "rgb(255, 124, 240)"
];

function randomColor() {
   return colorChoice[Math.floor(Math.random()*colorChoice.length)];
}

//Récuperation de la sauvagarde
let note_list = [];
let note_data = [];

//creation et stylisation des notes
function create_note(x, y, content = "") {

    //****New section
    let firstDiv       = document.createElement("div");
    firstDiv.className = "note";

    document.querySelector("main").appendChild(firstDiv);

    //****Dedans : new div < button > + textarea
    //Second div
    let secondDiv = document.createElement("div");
    secondDiv.className = "handle";
    firstDiv.appendChild(secondDiv);

    //button dans la second div
    let btn       = document.createElement("button");
        //contenue du btn
    let btn_content   = document.createTextNode("x");
    btn.appendChild(btn_content);
        //insertion dans la seconde div
    secondDiv.appendChild(btn);

    //textarea
    firstDiv.textArea = document.createElement("textarea");
    document.querySelector("main").appendChild(firstDiv);
    firstDiv.appendChild(firstDiv.textArea);
    firstDiv.textArea.value = content;
    
    //****Stylisisation
        //color random
    firstDiv.style.backgroundColor = randomColor();
        //coordonnee
    firstDiv.x = x;
    firstDiv.y = y;
    firstDiv.style.left = x + "px";
    firstDiv.style.top  = y + "px";
        //ajustement note auto hauteur jquery
    $("textarea").each(function () {
        this.style.height    = this.scrollHeight + "px";
        this.style.overflowY = "hidden";
    }).on("input", function () {
        this.style.height    = "auto";
        this.style.height    = this.scrollHeight + "px";
    });

    //fonction jquery pour bouger les notes
    $(firstDiv).draggable({
        zIndex      : 1,
        handle      : ".handle",
        stack       : ".note",
        containment : ".parent",
        //pour atteindre la note
        stop: function(e, ui) {
            //attiendre ui helpeur
            let the_note = ui.helper[0];
            //mettre a jour x et y
            the_note.x   = ui.position.left;
            the_note.y   = ui.position.top;
            //afficher si la note n'est ps vide
            if(the_note.textArea.value != "") {
                the_note.saved_data();
            }
        }
    });

    //arreter le click sur la note
    firstDiv.addEventListener("click", function(e) {
        e.stopPropagation();
    })

    //Methode suppression
    firstDiv.delete_note = function() {
        //sauvegarde l'état de suppression
        let note_data_index = note_data.indexOf(this.data);
        note_data.splice(note_data_index, 1);//supp un élèment d'un tableau selon indice
        this.saved_data();

        //supprimer l'élément
        this.remove();
    }

    //au click sur le btn demande à l'utilisateur de fermer la note
    btn.addEventListener("click", function(){
        if (window.confirm("Supprimer cette note?")) {
            this.delete_note();
        }
    }.bind(firstDiv));

    /*Pareille au vidage du champs et validation*/
    firstDiv.textArea.addEventListener("change", function(){
        if(this.textArea.value == ""){
            this.delete_note()
        }
    }.bind(firstDiv));

    //Gère le z-index au focus
    firstDiv.addEventListener("focus", (event) => {
        event.textArea.style.zIndex = 1;
    });

    //Persistance des donnéees
    firstDiv.saved_data   = function() {
        this.data.content = this.textArea.value;
        this.data.x       = this.x;
        this.data.y       = this.y;
        
        window.localStorage.setItem("appli-note", JSON.stringify(note_data));
    }

    firstDiv.textArea.addEventListener("input", function(){
        firstDiv.saved_data();
    });

    //Récuperation de la sauvagarde
    note_list.push(firstDiv);
    firstDiv.data = (
        {
            content : firstDiv.textArea.value,
            x       : x,
            y       : y
        }
    )

    note_data.push(firstDiv.data)

    //****Apparaitre sur le main
    return firstDiv
}

//function au clic
document.querySelector("main").addEventListener("click", function(e){
    create_note(e.clientX - 80, e.clientY);
});

//Recuperation donnéee sauvegarder
let recup_saved_data = JSON.parse(window.localStorage.getItem("appli-note")) || [];

for (let saved_data of recup_saved_data) {
    create_note(saved_data.x, saved_data.y, saved_data.content);
}