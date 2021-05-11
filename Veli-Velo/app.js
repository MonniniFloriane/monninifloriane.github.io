document.querySelector('#veloWhite').onclick = remplaceLeVelo;

console.log(remplaceLeVelo)
var message = 'clic bien recu'

function remplaceLeVelo() {
    
    document.querySelector('#veloWhite').classList.add('veloBleu')
}