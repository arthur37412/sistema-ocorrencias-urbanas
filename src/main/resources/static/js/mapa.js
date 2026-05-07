var map = L.map('map').setView([-23.4538, -46.5333], 13); //coordenadas de inicio do mapa
var bounds = [[-23.60, -46.65], [-23.35, -46.45]]; //coordenadas de limite de guarulhos/ apenas para teste até implementar geojson

/*limita o mapa a guarlhos, precisa geojson
map.setMaxBounds(bounds);
map.on('drag', function () {
    map.panInsideBounds(bounds, { animate: false });
});*/

var marker = L.marker([-23.4538, -46.5333]).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	minZoom: 12,
    maxZoom: 16,
    attribution: '&copy; OpenStreetMap & CartoDB'
}).addTo(map);

//---------------------------------------------Botão Criar Registro--------------------------------------------------------------------------


//cria o modo de criação de registros e o define como desativado
let Criando = false;

const popup = document.getElementById("popupCriar"); //cria o popup que pede para seleconar um lcoal

//oq ocorre ao apertar o botão criar
document.getElementById("btnRegistrar").addEventListener("click", function () {
    Criando = !Criando;
	popup.style.display = "block";
});

//oq ocorre após selecionar um local no mapa
map.on('click', function (e) {
    if (!Criando) return;
    L.marker([e.latlng.lat, e.latlng.lng])
        .addTo(map)
        .bindPopup("Nova ocorrência")
        .openPopup();
    Criando = false;
	popup.style.display = "none";
});


