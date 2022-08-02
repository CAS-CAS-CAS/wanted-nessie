//import QRCODE from {/scripts/QRCODE.min.js};
//dogList
var mode = 'SELECT';
var dogList = [];
var dogData = {'ID': Date.now(),'Name': "Nellie", 'Breed' : "Boxer", "Last Seen" : [-12460306.871548783, 3951536.3379208655]
, "Last Seen Desc" : 'Lounging by the pool', 
'Pin  Location': []};

/*var clickSound = new Audio("assets/pop.mp3");
clickSound.play();
console.log(clickSound);
*/
function makeSound(audioPath){
    var sound = document.createElement("audio");
    sound.src = audioPath;
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    //this.sound.setAttribute("volume", "1.1");
    sound.style.display = "none";
    document.body.append(sound);
    return(sound);
}

function main(){
    var pop = makeSound("assets/pop.mp3");
    var json = JSON.stringify(dogData);   
    var container = document.getElementById('popup');
    //var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');
    var map = constructMap();  
    
    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });
    map.addOverlay(overlay);
    
    closer.onclick = function(){
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    map.on('click', function(event){
        if (map.hasFeatureAtPixel(event.pixel) === false) {
            var pinData = [event.coordinate[0],event.coordinate[1]];
            dogData['Pin  Location'].push(pinData);
            var layer = makePinLayer(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
            map.addLayer(layer);
            saveState = true;
            pop.play(); //favicon error 404 here; investigate bug

        }
        else{
            var coordinate = event.coordinate;
            overlay.setPosition(coordinate);
            fetchDog(dogData);
        }
    })
    //TODO: mode listener
    //TODO: load listener
    //setup button listeners
    let saveButton = document.getElementById('dogEx');
    saveButton.addEventListener('click', event => {
        var newDog = {'ID': Date.now(), 'Name':'', 'Breed':'','Last Seen':dogData['Last Seen'],'Last Seen Desc': '','Pin Location': [dogData['Pin  Location']]};
        getDogData(newDog);
    
        const options = {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newDog)
        };
        fetch('/api', options);
    })


}
//(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326') - convert a mouse click location to map coor[lon,lat]

async function requestDogData(){
    const response = await fetch("/data/DogData.txt");
    const blob = await (await response.blob()).text();

    let dData = blob.split("\n");
    for (let data in dData){
        dogList.push(JSON.parse(dData[data]));
    }
}

async function fetchDog(dogData) {
    const response = await fetch("/assets/pooch.jpg");
    const blob = await response.blob();
    document.getElementById('popup-content').innerHTML = `<b></b><br/>
    <img src = "${URL.createObjectURL(blob)}" width = "60" height = "60" id = "doggo"><br>
    ${dogData.Name} <br>${dogData.Breed}<br>${dogData["Last Seen Desc"]}`;
    };

function getDogData(data){
    data['Name'] = document.getElementById("dname").value;
    data['Breed'] = document.getElementById("dbreed").value;
    data['Last Seen Desc'] = document.getElementById("dseen").value;
};

function constructMap(){
    const centerCoor = [-111.9234527085402, 33.418017665847174];//TODO - replace this with current location or last know location
    var map = new ol.Map({
        target: 'map',
        layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
        view: new ol.View({
        center: ol.proj.fromLonLat(centerCoor), //[-12460306.871548783, 3951536.3379208655]
        minZoom: 15,
        zoom: 17})
    });
    return map;
};

function makePinLayer(coords){
    var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat(coords))
                })
            ]
        })
    });
    return layer;
};

main();