var map = L.map('map').setView([-23.4538, -46.5333], 13); //coordenadas de inicio do mapa
var bounds = [[-23.60, -46.65], [-23.35, -46.45]]; //coordenadas de limite de guarulhos/ apenas para teste até implementar geojson


fetch("/api/registro").then(response => response.json()).then(registros => {

registros.forEach(registro => {
        L.marker([registro.latitude, registro.longitude])
        .addTo(map)
        .bindPopup(registro.titulo);
});
}).catch(error => console.error(error));

/*limita o mapa a guarlhos, precisa geojson
map.setMaxBounds(bounds);
map.on('drag', function () {
    map.panInsideBounds(bounds, { animate: false });
});*/

var marker = L.marker([-23.4538, -46.5333]).addTo(map);

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

//testa se o botão existe
const btnRegistrar = document.getElementById("btnRegistrar");
if(btnRegistrar){
	
//oq ocorre ao apertar o botão criar registro
btnRegistrar.addEventListener("click", function () {
    tipoCriacao = tipoCriacao == "Registro" ? null : "Registro";
	document.getElementById("camposObra").style.display = "none";
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
document.getElementById("btnSalvarRegistro").addEventListener("click", function () {

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
.bindPopup(data.titulo)
.openPopup();
});


// Limpa os campos ao enviar ou fechar
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
   tipoLocal = "Prédio";
        } else {
          camposVia.style.display = "block";
          camposPredio.style.display = "none";
            tipoLocal = "Via";

        }
    });
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
