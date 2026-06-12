/* Faz o aviso de cadatros bem sucedido sumir dps de 3 seg
setTimeout(function () {
    const alerta =
        document.getElementById("alertaSucessoC");
    if(alerta){ //assim ele n sobe os campos dps da mensagem sumir
        alerta.style.opacity = "0";
    }
}, 3000);*/

const campoNome = document.getElementById("nomeUsuario");
if(campoNome){
campoNome.addEventListener("input", function () {
this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');

});

}
if(btnEditarPerfil) {
document.getElementById("btnEditarPerfil").addEventListener("click", function(){

document.getElementById("nomeTexto").style.display = "none";
document.getElementById("emailTexto").style.display = "none";

document.getElementById("nomeInput").style.display = "inline-block";
document.getElementById("emailInput").style.display = "inline-block";

document.getElementById("btnSalvarPerfil").style.display = "block";
this.style.display = "none";
});
}
//A parte de exibir no mapa está no mapa.js