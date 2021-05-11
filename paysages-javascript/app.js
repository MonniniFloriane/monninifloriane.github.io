document.querySelector('#laMer').onclick = agrandiLaBoiteMer;

console.log(agrandiLaBoiteMer)
var message = 'clic bien recu'

function agrandiLaBoiteMer() {
    
    document.querySelector('#laMer').classList.add('grandeBoiteMer')
}