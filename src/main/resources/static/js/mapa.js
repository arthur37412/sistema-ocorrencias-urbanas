var map = L.map('map').setView([-23.4538, -46.5333], 13); //coordenadas de inicio do mapa
var bounds = [[-23.60, -46.65], [-23.35, -46.45]]; //coordenadas de limite de guarulhos/ apenas para teste até implementar geojson

let todosRegistros = [];
let marcadores = []; //para o filtro

let registroSelecionado = null;// armazena o registro selecionado, para alterações e assumir
let modoEdicao = false;

let geojsonGuarulhos = null;

const tipoUsuarioLogado = document.getElementById("tipoUsuarioLogado")?.value.trim(); // puxa o usuario do backend
const idUsuarioLogado = document.getElementById("idUsuarioLogado")?.value;


fetch("/api/registro").then(response => response.json()).then(registros => {
	
todosRegistros = registros; 
desenharRegistros(todosRegistros);//para o filtro

const params = new URLSearchParams(window.location.search);
const idRegistroUrl = params.get("registro");

//abre o registro selecinado após abrir atraves da pagina perfil
if(idRegistroUrl){
   const registroEncontrado = todosRegistros.find(r => r.idRegistro == idRegistroUrl);
   if(registroEncontrado){
      map.setView([registroEncontrado.latitude, registroEncontrado.longitude], 16);
      abrirpopupExibir(registroEncontrado);
    }
}

/*registros.forEach(registro => {
        const marcador = L.marker([registro.latitude, registro.longitude])
        .addTo(map)
		.on("click", function(){
	    abrirpopupExibir(registro);
    });
});*/
}).catch(error => console.error(error));

/*limita o mapa a guarlhos, precisa geojson
map.setMaxBounds(bounds);
map.on('drag', function () {
    map.panInsideBounds(bounds, { animate: false });
});*/

//var marker = L.marker([-23.4538, -46.5333]).addTo(map);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	minZoom: 12,
    maxZoom: 16,
    attribution: '&copy; OpenStreetMap & CartoDB'
}).addTo(map);

let camadaGuarulhos = null;

fetch("/geo/guarulhos.json").then(response => response.json()).then(geojson => {
geojsonGuarulhos = geojson;
	
const mascara = {type: "Feature", geometry: {type: "Polygon", coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]], geojson.features[0].geometry.coordinates[0]]}};

L.geoJSON(mascara, {style: {fillColor: "#000", fillOpacity: 0.15, stroke: false}}).addTo(map);

camadaGuarulhos = L.geoJSON(geojson, {style: {opacity: 0, fillOpacity: 0}
}).addTo(map);
const boundsGuarulhos = camadaGuarulhos.getBounds();

map.fitBounds(boundsGuarulhos);
map.setMaxBounds(boundsGuarulhos.pad(0.3));

map.on("drag", function(){
    map.panInsideBounds(boundsGuarulhos.pad(0.3), {
        animate: false
    });
});
}).catch(error => console.error("Erro ao carregar GeoJSON:", error));


//---------------------------------------------Botão Criar Registro--------------------------------------------------------------------------


//cria o modo de criação de registros e o define como desativado
let tipoCriacao = null;

// Armazena as coordenadas
let latitudeSelecionada;
let longitudeSelecionada;

const popup = document.getElementById("popupCriar"); //cria o popup que pede para selecionar um lcoal
atualizarCamposFormulario();

//testa se o botão existe
const btnRegistrar = document.getElementById("btnRegistrar");
if(btnRegistrar){
	
//oq ocorre ao apertar o botão criar registro
btnRegistrar.addEventListener("click", function () {
    tipoCriacao = tipoCriacao == "Registro" ? null : "Registro";
	document.getElementById("camposObra").style.display = "none";
	atualizarCamposFormulario();
	popup.style.display = tipoCriacao ? "block" : "none";
	popup.innerHTML = "Selecione um local no mapa.";
	map.getContainer().style.cursor = tipoCriacao ? "crosshair" : "";
});
}

//fecha popup de registro
document.getElementById("fecharPopup").addEventListener("click", function () {
document.getElementById("popupRegistro").style.display = "none";
tipoCriacao = null;
document.getElementById("popupCriar").style.display = "none";
map.getContainer().style.cursor = "";
limparCampos();
});

//testa se o botão existe
const btnCriarObra = document.getElementById("btnCriarObra");
if(btnCriarObra){
	
//oq ocorre ao apertar o botão criar obra	
btnCriarObra.addEventListener("click", function () {
    tipoCriacao = tipoCriacao == "Obra" ? null : "Obra";
	document.getElementById("camposObra").style.display = "block";
	atualizarCamposFormulario();
	popup.style.display = tipoCriacao ? "block" : "none";
	popup.innerHTML = "Selecione um local no mapa.";
	map.getContainer().style.cursor = tipoCriacao ? "crosshair" : "";
});
}


//oq ocorre após selecionar um local no mapa
map.on('click', function (e) {
if(!tipoCriacao) return;
if(geojsonGuarulhos) {
    const ponto = turf.point([e.latlng.lng, e.latlng.lat]);
    const dentro = turf.booleanPointInPolygon(ponto,geojsonGuarulhos.features[0]);
    if(!dentro) {
	   document.getElementById("popupCriar").innerHTML = "Selecione um local dentro de Guarulhos.";
       return;
       }
   }
latitudeSelecionada = e.latlng.lat;
longitudeSelecionada = e.latlng.lng;
document.getElementById("popupRegistro").style.display = "block";
});


//oq ocorre ao salvar registro
document.getElementById("formRegistro").addEventListener("submit", function (e) { e.preventDefault();
	
const titulo = document.getElementById("tituloRegistro").value;

// Radiobuttons
const trafegoV = document.querySelector('input[name="trafegoV"]:checked')?.value || "NAO_AFETA";

const trafegoP = document.querySelector('input[name="trafegoP"]:checked')?.value || "NAO_AFETA";

const funcionamento = document.querySelector('input[name="funcionamento"]:checked')?.value || null;

// Checkboxs
const ruidoExcessivo = document.getElementById("ruidoExcessivo").checked;

const poeiraExcessiva = document.getElementById("poeiraExcessiva").checked;

const entulho = document.getElementById("entulho").checked;

//radiobutoons de obras
const dataInicio = document.getElementById("dataInicio")?.value || null;

const previsao = document.getElementById("previsao")?.value || null;

if(dataInicio && previsao && previsao < dataInicio){
   alert("A previsão não pode ser anterior à data de início.");
   return;
}

const status = document.querySelector('input[name="status"]:checked')?.value || null;

// Objeto a ser enviado ao banco de dados
const registro = {
titulo: titulo,
idRegistro: modoEdicao ? registroSelecionado.idRegistro : "0",
descricao: document.getElementById("descricaoRegistro")?.value || "",
tipoRegistro: tipoCriacao,
tipoLocal: tipoLocal,
status: tipoCriacao == "Obra" ? status : "Pendente",
latitude: latitudeSelecionada,
longitude: longitudeSelecionada,
trafegoV: trafegoV,
trafegoP: trafegoP,
funcionamento: funcionamento,
dataInicio: dataInicio,
previsao: previsao,
ruidoExcessivo: ruidoExcessivo,
poeiraExcessiva: poeiraExcessiva,
entulho: entulho,
dataInicio: tipoCriacao == "Obra" ? dataInicio : null,
previsao: tipoCriacao == "Obra" ? previsao : null
};


// Envia ao banco de dados
const url = modoEdicao ? "/api/registros/" + registroSelecionado.idRegistro : "/api/registros";
const metodo = modoEdicao ? "PUT" : "POST";

fetch(url, {method: metodo, headers: {"Content-Type": "application/json"}, body: JSON.stringify(registro)}).then(response => response.json()).then(data => {
if(modoEdicao){
   const index = todosRegistros.findIndex(r => r.idRegistro == data.idRegistro);

if(index !== -1){
   todosRegistros[index] = data;
   }
aplicarFiltros();
abrirpopupExibir(data);

alert("Registro atualizado com sucesso.");
    }
 else{
	todosRegistros.push(data);
	    aplicarFiltros();
    }
	

// fecha o pop-up ao enviar
tipoCriacao = null;
document.getElementById("popupRegistro").style.display = "none";
document.getElementById("popupCriar").style.display = "none";

document.querySelector("#barraPopupRegistro h3").innerText = "Novo Registro";
document.getElementById("btnSalvarRegistro").innerText = "Registrar";

map.getContainer().style.cursor = "";

limparCampos();
});
});

//---------------------------------------------Botão Criar Obra--------------------------------------------------------------------------

const radiosTipo = document.querySelectorAll('input[name="tipoRegistro"]');

let tipoLocal = "Via";

radiosTipo.forEach(radio => { radio.addEventListener("change", function () {

const camposVia = document.getElementById("camposVia");
const camposPredio = document.getElementById("camposPredio");
if (
   this.value == "ObraPredio" || this.value == "IrregularidadePredio") {
   camposVia.style.display = "none";
   camposPredio.style.display = "block";
   atualizarCamposFormulario();
   tipoLocal = "Prédio";
        } else {
          camposVia.style.display = "block";
          camposPredio.style.display = "none";
		  atualizarCamposFormulario();
            tipoLocal = "Via";
        }
    });
});

//------------------------------------popup Exibir---------------------------------------------------------------------------------------------------

function abrirpopupExibir(registro){

	
registroSelecionado = registro;
	
document.getElementById("camposAssumirObra").style.display = "none";

 // esconde os campos opcionis
document.getElementById("exibirObra").style.display = "none";
document.getElementById("exibirVia").style.display = "none";
document.getElementById("exibirPredio").style.display = "none";


document.getElementById("tituloExibir").innerText = registro.titulo;
document.getElementById("responsavelExibir").innerText = registro.nomeResponsavel;

document.getElementById("statusExibir").innerText = registro.status;
document.getElementById("descricaoExibir").innerText = registro.descricao;
document.getElementById("dataInicioExibir").innerText = formatarDatas(registro.dataInicio);

document.getElementById("previsaoExibir").innerText = formatarDatas(registro.previsao);
document.getElementById("tipoExibir").innerText = registro.tipoRegistro;
document.getElementById("localExibir").innerText = registro.tipoLocal;

// Via
if(registro.tipoLocal == "Via"){
document.getElementById("exibirVia").style.display = "block";
document.getElementById("trafegoVExibir").innerText =formatarCampos(registro.trafegoV);
document.getElementById("trafegoPExibir").innerText =formatarCampos(registro.trafegoP);
    }
// Prédio
else{
document.getElementById("exibirPredio").style.display = "block";
document.getElementById("funcionamentoExibir").innerText = registro.funcionamento;
    }
// Impactos
document.getElementById("ruidoExibir").innerText = registro.ruidoExcessivo ? "Sim" : "Não";

document.getElementById("poeiraExibir").innerText = registro.poeiraExcessiva ? "Sim" : "Não";

document.getElementById("entulhoExibir").innerText = registro.entulho ? "Sim" : "Não";

// Obra
if(registro.tipoRegistro == "Obra"){
document.getElementById("exibirObra").style.display = "block";
document.getElementById("statusExibir").innerText = registro.status;
document.getElementById("dataInicioExibir").innerText = formatarDatas(registro.dataInicio);
document.getElementById("previsaoExibir").innerText = formatarDatas(registro.previsao);
document.getElementById("responsavelExibir").innerText = registro.nomeResponsavel;
    }
else{
document.getElementById("exibirObra").style.display = "none";
}
document.getElementById("popupExibir").style.display = "block";


// define qnd btnAssumir aparece
const btnAssumir = document.getElementById("btnAssumirObra");
if(registro.tipoRegistro == "Registro" && tipoUsuarioLogado == "Gestor"){
    btnAssumir.style.display = "block";
}
else{
    btnAssumir.style.display = "none";
}

//qnd botão alterar aparece
const btnEditar = document.getElementById("btnEditarRegistro");
if ((registro.tipoRegistro == "Registro" && !registro.idResponsavel && tipoUsuarioLogado == "Usuario") || (registro.tipoRegistro == "Obra" && tipoUsuarioLogado == "Gestor" && String(registro.idResponsavel) == String(idUsuarioLogado)) || tipoUsuarioLogado == "Administrador") {
     btnEditar.style.display = "block";
} else {
    btnEditar.style.display = "none";
}

const btnConcluir = document.getElementById("btnConcluirRegistro");
const btnReabrir = document.getElementById("btnReabrirRegistro");

const podeConcluirRegistro = registro.tipoRegistro == "Registro" && tipoUsuarioLogado != "" && tipoUsuarioLogado != "Gestor";
const registroResolvido = registro.status == "Resolvido";
if(podeConcluirRegistro && !registroResolvido){
   btnConcluir.style.display = "block";
   btnReabrir.style.display = "none";
}
else if(podeConcluirRegistro && registroResolvido){
    btnConcluir.style.display = "none";
    btnReabrir.style.display = "block";
}
else{
    btnConcluir.style.display = "none";
    btnReabrir.style.display = "none";
}

}

// oq ocorre ao clicar btn assumir 
document.getElementById("btnAssumirObra").addEventListener("click", function(){
	
document.getElementById("btnAssumirObra").style.display = "none";	
document.getElementById("camposAssumirObra").style.display = "block";
});

// campos para assumir
document.getElementById("btnConfirmarAssumir").addEventListener("click", function(){

if(!registroSelecionado) return;


const dataInicio = document.getElementById("dataInicioAssumir").value;
const previsao = document.getElementById("previsaoAssumir").value;
const status = document.querySelector('input[name="statusAssumir"]:checked')?.value;

if(!dataInicio || !previsao || !status){
   alert("Preencha todos os campos.");
   return;
 }
 
 if(dataInicio && previsao && previsao < dataInicio){
    alert("A previsão não pode ser anterior à data de início.");
    return;
 }


const dadosAssumir = {dataInicio: dataInicio, previsao: previsao, status: status};

fetch("/api/registros/assumir/" + registroSelecionado.idRegistro, {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(dadosAssumir)})
.then(response => response.json())
.then(data => {registroSelecionado = data; const index = todosRegistros.findIndex(r => r.idRegistro == data.idRegistro);

if(index !== -1){
   todosRegistros[index] = data;
 }
abrirpopupExibir(data);
aplicarFiltros();
limparCampos();

alert("Obra atualizada");
    });
});


// fechar popup
document.getElementById("fecharExibir").addEventListener("click", function(){
document.getElementById("popupExibir").style.display = "none";
limparCampos();
});
  
// fechar campos assumir
document.getElementById("fecharAssumirObra").addEventListener("click", function(){
document.getElementById("camposAssumirObra").style.display = "none";
limparCampos();

if(registroSelecionado && registroSelecionado.tipoRegistro == "Registro" && tipoUsuarioLogado == "Gestor"){
   document.getElementById("btnAssumirObra").style.display = "block";
    }

});


//------------------------------------Limpar campos---------------------------------------------------------------------------------------------------

function limparCampos(){
document.getElementById("tituloRegistro").value = "";
document.getElementById("descricaoRegistro").value = "";

document.getElementById("dataInicio").value = "";
document.getElementById("previsao").value = "";

document.querySelectorAll('#popupRegistro input[type="radio"]').forEach(r => r.checked = false);
document.querySelectorAll('#popupRegistro input[type="checkbox"]').forEach(c => c.checked = false);

document.querySelectorAll('input[name="status"]').forEach(r => r.checked = false);

//assumir
document.getElementById("dataInicioAssumir").value = "";
document.getElementById("previsaoAssumir").value = "";

document.querySelectorAll('input[name="statusAssumir"]').forEach(r => r.checked = false);

}

//------------------------------------arrastar pop-ups---------------------------------------------------------------------------------------------------

//mousedown = apertar/segurar mouse, mouseup = soltar

const barraPopupExibir = document.getElementById("barraPopupExibir");

let arrastar = false;
let offsetX;
let offsetY;

barraPopupExibir.addEventListener("mousedown", function(e){
const rect = popupExibir.getBoundingClientRect();  //determina a posição do mouse 

e.preventDefault(); //impede o mouse de slecionar tetxos enquanto arrasta

// Corrije erro de teleporte
popupExibir.style.left = rect.left + "px";
popupExibir.style.top = rect.top + "px";
popupExibir.style.transform = "none";

arrastar = true;

offsetX = e.clientX - rect.left;
offsetY = e.clientY - rect.top;  // mede as alterações de posição do mouse

});

document.addEventListener("mousemove", function(e){
if(!arrastar) return;
   //recebr os movimentos do mouse
   popupExibir.style.left = (e.clientX - offsetX) + "px";
   popupExibir.style.top = (e.clientY - offsetY) + "px";

});

document.addEventListener("mouseup", function(){
arrastar = false;
});

// Pop-up registro
const popupRegistro = document.getElementById("popupRegistro");
const barraPopupRegistro = document.getElementById("barraPopupRegistro");

let arrastarRegistro = false;
let offsetRegistroX;
let offsetRegistroY;

barraPopupRegistro.addEventListener("mousedown", function(e){
const rect = popupRegistro.getBoundingClientRect();
e.preventDefault();

popupRegistro.style.left = rect.left + "px";
popupRegistro.style.top = rect.top + "px";
popupRegistro.style.transform = "none";

arrastarRegistro = true;

offsetRegistroX = e.clientX - rect.left;
offsetRegistroY = e.clientY - rect.top;
});

document.addEventListener("mousemove", function(e){
if(!arrastarRegistro) return;
   popupRegistro.style.left = (e.clientX - offsetRegistroX) + "px";
   popupRegistro.style.top = (e.clientY - offsetRegistroY) + "px";
});

document.addEventListener("mouseup", function(){
arrastarRegistro = false;
});

//------------------------------------formatação de texto------------------------------------------------------------------

function formatarCampos(valor){

return valor == "NAO_AFETA" || valor == "NaoImpede" ? "Não afeta" : valor;

}

function formatarDatas(datas){ 
if(!datas){
return "";
}
const partes = datas.split("-");
if(partes.length !== 3){
   return datas;
}
return partes[2] + "/" + partes[1] + "/" + partes[0];
	}

//------------------------------------Ocultar campos sem quebrar os requireds------------------------------------------------------------------

function atualizarCamposFormulario(){

const camposVia = document.getElementById("camposVia");
const camposPredio = document.getElementById("camposPredio");
const camposObra = document.getElementById("camposObra");

    
camposVia.querySelectorAll("input").forEach(input => {
input.disabled = camposVia.style.display == "none";
});

camposPredio.querySelectorAll("input").forEach(input => {
input.disabled = camposPredio.style.display == "none";
});

camposObra.querySelectorAll("input").forEach(input => {
input.disabled = camposObra.style.display == "none";
});
}

//------------------------------------ btn de Editar registros/obras------------------------------------------------------------------------------------

document.getElementById("btnEditarRegistro").addEventListener("click", function(){

if(!registroSelecionado) return;
modoEdicao = true;
tipoCriacao = "Registro";

document.getElementById("popupExibir").style.display = "none";
document.getElementById("popupRegistro").style.display = "block";

document.querySelector("#barraPopupRegistro h3").innerText = "Editar Registro";
document.getElementById("btnSalvarRegistro").innerText = "Salvar alterações";

document.getElementById("tituloRegistro").value = registroSelecionado.titulo;
document.getElementById("descricaoRegistro").value = registroSelecionado.descricao;

if(registroSelecionado.tipoLocal == "Via"){
   document.querySelector('input[name="tipoRegistro"][value="IrregularidadeVia"]').checked = true;
   document.getElementById("camposVia").style.display = "block";
   document.getElementById("camposPredio").style.display = "none";
   document.querySelector(`input[name="trafegoV"][value="${registroSelecionado.trafegoV}"]`).checked = true;
   document.querySelector(`input[name="trafegoP"][value="${registroSelecionado.trafegoP}"]`).checked = true;
   tipoLocal = "Via";
    }
    else{
    document.querySelector('input[name="tipoRegistro"][value="IrregularidadePredio"]').checked = true;
    document.getElementById("camposVia").style.display = "none";
    document.getElementById("camposPredio").style.display = "block";

    document.querySelector(`input[name="funcionamento"][value="${registroSelecionado.funcionamento}"]`).checked = true;

    tipoLocal = "Prédio";
    }

document.getElementById("ruidoExcessivo").checked = registroSelecionado.ruidoExcessivo;
document.getElementById("poeiraExcessiva").checked = registroSelecionado.poeiraExcessiva;
document.getElementById("entulho").checked = registroSelecionado.entulho;

if(registroSelecionado.tipoRegistro == "Obra"){
   tipoCriacao = "Obra";
document.getElementById("camposObra").style.display = "block";

document.getElementById("dataInicio").value = registroSelecionado.dataInicio;
document.getElementById("previsao").value = registroSelecionado.previsao;

const statusObra = document.querySelector( `input[name="status"][value="${registroSelecionado.status}"]`);
if(statusObra){
   statusObra.checked = true;
    }
}
else{
    tipoCriacao = "Registro";
    document.getElementById("camposObra").style.display = "none";
}

atualizarCamposFormulario();
});

//------------------------------------Botão concluir/Voltar------------------------------------------------------------------------------------

document.getElementById("btnConcluirRegistro").addEventListener("click", function(){
if(!registroSelecionado) return;
fetch("/api/registros/concluir/" + registroSelecionado.idRegistro, { method: "PUT"}).then(response => response.json()).then(data => {registroSelecionado = data;
const index = todosRegistros.findIndex(r => r.idRegistro == data.idRegistro);

if(index !== -1){
    todosRegistros[index] = data;
    }

aplicarFiltros();
abrirpopupExibir(data);

alert("Marcado como concluído.");
    });
});

document.getElementById("btnReabrirRegistro").addEventListener("click", function(){
if(!registroSelecionado) return;
fetch("/api/registros/reabrir/" + registroSelecionado.idRegistro, {method: "PUT"}).then(response => response.json()).then(data => {registroSelecionado = data;
const index = todosRegistros.findIndex(r => r.idRegistro == data.idRegistro);

if(index !== -1){
   todosRegistros[index] = data;
   }

aplicarFiltros();
abrirpopupExibir(data);

alert("Registro reaberto.");
    });
});



//------------------------------------filtros------------------------------------------------------------------------------------
const filtros = {tipo: [], local: [], trafegoV: [], trafegoP: [], funcionamento: [], status: [], ruido: false, poeira: false, entulho: false};


//dropdown de filtros

// abrir/fechar painel
document.getElementById("btnFiltros").addEventListener("click", function(){

const painel = document.getElementById("painelFiltros");
painel.style.display = painel.style.display === "block" ? "none" : "block";
});

//fecha ao clicar fora da caixad e filtros
document.addEventListener("click", function(e){

const containerFiltros = document.getElementById("containerFiltros");
const painelFiltros = document.getElementById("painelFiltros");

if(!containerFiltros.contains(e.target)){
   painelFiltros.style.display = "none";
    }

});

// abrir/fechar categorias
document.querySelectorAll(".categoria").forEach(categoria => {
categoria.addEventListener("click", function(){
const opcoesFiltro = this.nextElementSibling;
opcoesFiltro.style.display = opcoesFiltro.style.display === "block" ? "none" : "block";
    });
});

// ativar/desativar filtros
document.addEventListener("click", function(e){

if(e.target.classList.contains("opcaoFiltro")){
   e.target.classList.toggle("ativo");
   aplicarFiltros();
  }

});

//filtros
function aplicarFiltros(){filtros.tipo = []; filtros.local = []; filtros.trafegoV = []; filtros.trafegoP = []; filtros.funcionamento = []; filtros.status = []; filtros.ruido = false; filtros.poeira = false; filtros.entulho = false;
document.querySelectorAll(".opcaoFiltro.ativo").forEach(opcao => {
if(opcao.dataset.tipo)
   filtros.tipo.push(opcao.dataset.tipo);
if(opcao.dataset.local)
   filtros.local.push(opcao.dataset.local);
if(opcao.dataset.trafegov)
   filtros.trafegoV.push(opcao.dataset.trafegov);
if(opcao.dataset.trafegop)
   filtros.trafegoP.push(opcao.dataset.trafegop);
if(opcao.dataset.funcionamento)
   filtros.funcionamento.push(opcao.dataset.funcionamento);
if(opcao.dataset.status)
   filtros.status.push(opcao.dataset.status);
if(opcao.dataset.ruido)
   filtros.ruido = true;
if(opcao.dataset.poeira)
   filtros.poeira = true;
if(opcao.dataset.entulho)
   filtros.entulho = true;
});

console.log(filtros);
	
let registrosFiltrados = todosRegistros.filter(registro => {
const filtroImpactoAtivo = filtros.trafegoV.length > 0 || filtros.trafegoP.length > 0 || filtros.funcionamento.length > 0 || filtros.ruido || filtros.poeira || filtros.entulho;
const registroFinalizado = registro.status == "Concluído" || registro.status == "Resolvido";

const filtroNaoAfetaAtivo =filtros.trafegoV.includes("NaoImpede") || filtros.trafegoP.includes("NaoImpede") || filtros.funcionamento.includes("Pleno");

const algumFiltroDeImpactoPesado = filtros.trafegoV.some(f => f != "NaoImpede") || filtros.trafegoP.some(f => f != "NaoImpede") || filtros.funcionamento.some(f => f != "Pleno") || filtros.ruido || filtros.poeira || filtros.entulho;
if(registroFinalizado && filtroImpactoAtivo && !filtroNaoAfetaAtivo){
   return false;
}

if(registroFinalizado && algumFiltroDeImpactoPesado){
   return false;
}

	
if(filtros.tipo.length > 0 && !filtros.tipo.includes(registro.tipoRegistro))
   return false;
if(filtros.local.length > 0 && !filtros.local.includes(registro.tipoLocal))
   return false;
if(filtros.trafegoV.length > 0){const passaTrafegoV = filtros.trafegoV.includes(registro.trafegoV) || (filtros.trafegoV.includes("NaoImpede") && ( registro.trafegoV == null || registro.trafegoV === ""));
   if(!passaTrafegoV) 
   return false;}
if(filtros.trafegoP.length > 0){const passaTrafegoP = filtros.trafegoP.includes(registro.trafegoP) || (filtros.trafegoP.includes("NaoImpede") && (registro.trafegoP == null || registro.trafegoP === ""));
   if(!passaTrafegoP)
   return false;}
if(filtros.funcionamento.length > 0){const passaFuncionamento = filtros.funcionamento.includes(registro.funcionamento) || (filtros.funcionamento.includes("Pleno") && (registro.funcionamento == null || registro.funcionamento === ""));
   if(!passaFuncionamento)
   return false;}
if(filtros.status.length > 0){const passaStatus = filtros.status.includes(registro.status) || (filtros.status.includes("Em andamento") && registro.status == "Pendente") || (filtros.status.includes("Concluído") && registro.status == "Resolvido");
   if(!passaStatus)
   return false;}
if(filtros.ruido && !registro.ruidoExcessivo)
   return false;
if(filtros.poeira && !registro.poeiraExcessiva)
   return false;
if(filtros.entulho && !registro.entulho)
   return false;

   return true;
});

desenharRegistros(registrosFiltrados);
	}
	
function desenharRegistros(lista){
// remove os antigos
marcadores.forEach(marcador => {map.removeLayer(marcador);
});
marcadores = [];

 // cria os novos
lista.forEach(registro => {const marcador = L.marker([registro.latitude, registro.longitude])
.addTo(map)
.on("click", function(){
abrirpopupExibir(registro);
});
marcadores.push(marcador);
 });

	}