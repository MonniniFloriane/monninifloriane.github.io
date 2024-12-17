/*2 règles du jeux de la vie :

- Une cellule morte possedant 3 cellules voisines vivantes devient vivante
- Une cellule vivante possedant 2 ou 3 cellules voisine vivante le reste, sinon elle meurt

Donc :
- Si une cellule a 3 voisine, elle est vivante à l'étape suivante
- Si une cellule à 2 voisine, elle reste dans son état actuelle à l'étape suivante
- Si une cellule à moin de 2 ou plus de 3 voisines, alors elle meurt à l'étape suivante

JS :
- Generer une grille de cellules, pouvant présenter les 2 états
- Ces cellules carré devront pouvoir ce positionner à des coordonnées X et Y

HTML :
- Une cellule correspondra à une div de class "cell"
- Une cellule prendra la classe supp "alive" lorsqu'elle est vivante
- Une cellule devra avoir une hauteu et largeur en px
- Une cellule devra avoir des coordonnées en px (top et left)*/

//taille de la cellule
const cell_size = 20;
//tableau
const column    = 80;
const lines     = 30;
//definir periode de changement d'état des cellule en milliseconde
const period    = 150;

/***fonction principal***/
function add_cell(new_x, new_y) {
    
    let my_cell = { //new Object();

        alive: false,
        alive_next_turn : false,
        x: new_x,
        y: new_y,

        //function creer et dessiner dans la div*/
        draw: function () {
            this.HTML_cell = document.createElement("div");
            //selectionner la balise main et y incorporé la div creer dans HTML_cell*/
            document.querySelector("main").appendChild(this.HTML_cell);

            this.HTML_cell.classList.add("cell"); // ou .className = "cell"
            //taille de la cellule en px
            this.HTML_cell.style.width  = cell_size + "px";
            this.HTML_cell.style.height = cell_size + "px";
            //position de la cellule en px
            this.HTML_cell.style.left   = (this.x * cell_size) + "px";
            this.HTML_cell.style.top    = (this.y * cell_size) + "px";
            //evenement au click
            this.HTML_cell.addEventListener("click", this.toggle_state);
        },

        //gestion de l'ajout ou pas de la class "alive"
        update_HTML:function () {
            if (this.alive === true) {
                this.HTML_cell.classList.add("alive");
            } else {
                this.HTML_cell.classList.remove("alive");
            }
        },

        toggle_state:function () {

            my_cell.alive = !my_cell.alive;
            console.log(my_cell.alive);

            my_cell.update_HTML();
        },
        //compter le nbr de voisine en vie
        count_alive_neighbors:function(){
            let count = 0;
            //determiner les coordonnées des différente voisines à tester
            let tab_x = [// cellules x
                (this.x > 0) ? this.x - 1 : column - 1, //test ternaire (condition if)
                this.x, 
                (this.x < column - 1) ? this.x + 1 : 0 
            ];

            let tab_y = [// cellules y
                (this.y > 0) ? this.y - 1 : lines - 1,
                this.y, 
                (this.y < lines - 1) ? this.y + 1 : 0 
            ]; 

            //Passer chaque colonnes et ligne en revue
            for (let test_y of tab_y) {
                for (let test_x of tab_x) {
                    if (cells[test_y] && cells[test_y][test_x]) {
                        //tester si une cellule est alumer
                        if (cells[test_y][test_x] != this && cells[test_y][test_x].alive === true) {
                            // + 1 cellule compté
                            count++;
                        }
                    }
                }
            }

            return count;

        }
    }

    //appeler la fonction draw
    my_cell.draw();

    return my_cell;

}

/********Generations des cellule********/
let cells          = []; //tableau ou new Array() qui contient des reférence à tt les cellules;
let cells_unsorted = []; //tableau simple acces à toutes les cellules sans coordonner

//generation des lignes
for (let current_y = 0; current_y < lines; current_y++) {
    //generer les cellules
    for (let current_x = 0; current_x < column; current_x++) {

        let new_cell = add_cell(current_x, current_y);
        cells_unsorted.push(new_cell);
        //**TAB 2 dimmension :**/
        //ouvrir une nouvelle ligne dans le tableau 2 dimension
        if (!cells[current_y]) {
            cells.push([])
        }
        //on ajoute la nouvelle cellule dans la bonne "ligne"
        cells[current_y].push(new_cell);
    }
}

let game_ready = false;
let life_cycle;
let start_btn  = document.querySelector("button");

start_btn.addEventListener("click", function() {

    //*******Animation cellules***********/
    if (!game_ready) { //Si le jeux tourne pas, on le demarre
        start_btn.textContent = "STOP";
        //execution par interval
        life_cycle = setInterval(function () {
            //Cahque cellule doit verifier combien de cellules adjacente sont en vie
            for (let the_cell of cells_unsorted) {
                if (the_cell.count_alive_neighbors() == 2) {
                    //la cellule garde sont état actuelle
                    the_cell.alive_next_turn = the_cell.alive;

                } else if (the_cell.count_alive_neighbors() == 3) {
                    //la cellule devient vivante
                    the_cell.alive_next_turn = true;

                } else {
                    //la cellule meurt
                    the_cell.alive_next_turn = false;
                }
            }

            for (let the_cell of cells_unsorted) {
                the_cell.alive = the_cell.alive_next_turn;
                the_cell.update_HTML();
            }

        }, period);

    } else { //sinon le stop
        start_btn.textContent = "START";
        clearInterval(life_cycle);
    }
    
    game_ready = !game_ready;

})