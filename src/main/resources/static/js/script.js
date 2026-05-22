/* Faz o aviso de cadatros bem sucedido sumir dps de 3 seg
setTimeout(function () {
    const alerta =
        document.getElementById("alertaSucessoC");
    if(alerta){ //assim ele n sobe os campos dps da mensagem sumir
        alerta.style.opacity = "0";
    }
}, 3000);*/

const campoNome = document.getElementById("nomeUsuario");
campoNome.addEventListener("input", function () {
this.value = this.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
});

