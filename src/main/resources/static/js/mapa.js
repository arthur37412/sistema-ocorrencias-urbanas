var map = L.map('map').setView([-23.4538, -46.5333], 13); //coordenadas de inicio do mapa
var bounds = [[-23.60, -46.65], [-23.35, -46.45]]; //coordenadas de limite de guarulhos/ apenas para teste até implementar geojson

let todosRegistros = [];
let marcadores = []; //para o filtro

fetch("/api/registro").then(response => response.json()).then(registros => {
	
todosRegistros = registros; 
desenharRegistros(todosRegistros);//para o filtro

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
    if (!tipoCriacao) return;
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

const status = document.querySelector('input[name="status"]:checked')?.value || null;

// Objeto a ser enviado ao banco de dados
const registro = {
titulo: titulo,
idRegistro: "0",
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
entulho: entulho
};


// Envia ao banco de dados
fetch("/api/registros", {
method: "POST",
headers: {"Content-Type": "application/json"},
body: JSON.stringify(registro)})
.then(response => response.json())
.then(data => {L.marker([data.latitude, data.longitude])
.addTo(map)
.on("click", function(){
abrirpopupExibir(data);
    });

});


// fecha o pop-up ao enviar
tipoCriacao = null;
document.getElementById("popupRegistro").style.display = "none";
document.getElementById("popupCriar").style.display = "none";

map.getContainer().style.cursor = "";

limparCampos();
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

	
    // garante estado limpo dos blocos
document.getElementById("exibirObra").style.display = "none";
document.getElementById("exibirVia").style.display = "none";
document.getElementById("exibirPredio").style.display = "none";

    // base (sempre exibido)
document.getElementById("tituloExibir").innerText = registro.titulo;
document.getElementById("responsavelExibir").innerText = registro.nomeResponsavel;

document.getElementById("statusExibir").innerText = registro.status;
document.getElementById("descricaoExibir").innerText = registro.descricao;
document.getElementById("dataInicioExibir").innerText = registro.dataInicio;

document.getElementById("previsaoExibir").innerText = registro.previsao;
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

document.getElementById("dataInicioExibir").innerText = registro.dataInicio;

document.getElementById("previsaoExibir").innerText = registro.previsao;

document.getElementById("responsavelExibir").innerText = registro.nomeResponsavel;
    }
else{
    document.getElementById("exibirObra").style.display = "none";
    }
    document.getElementById("popupExibir").style.display = "block";
}


// fechar popup
document.getElementById("fecharExibir").addEventListener("click", function(){
document.getElementById("popupExibir").style.display = "none";
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

//------------------------------------filtros------------------------------------------------------------------------------------
const filtros = {tipo: [], local: [], trafegoV: [], trafegoP: [], funcionamento: [], status: [], ruido: false, poeira: false, entulho: false};


//dropdown de filtros

// abrir/fechar painel
document.getElementById("btnFiltros").addEventListener("click", function(){

const painel = document.getElementById("painelFiltros");
painel.style.display = painel.style.display === "block" ? "none" : "block";
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
if(filtros.tipo.length > 0 && !filtros.tipo.includes(registro.tipoRegistro))
   return false;
if(filtros.local.length > 0 && !filtros.local.includes(registro.tipoLocal))
   return false;
if(filtros.trafegoV.length > 0 && !filtros.trafegoV.includes(registro.trafegoV))
   return false;
if(filtros.trafegoP.length > 0 && !filtros.trafegoP.includes(registro.trafegoP))
   return false;
if(filtros.funcionamento.length > 0 && !filtros.funcionamento.includes(registro.funcionamento))
   return false;
if(filtros.status.length > 0 && !filtros.status.includes(registro.status))
   return false;
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