//check out dataFlag in index.html
const modes  = {
    Select: "SELECT",
    Seen: "SEEN"
}
var mode = 'SELECT';
var dogList = [];

var dogData = {'ID': `${Date.now()}`,'Name': "Nessie", 'Breed' : "Boxer", "Last Seen" : [-12460306.871548783, 3951536.3379208655]
, "Last Seen Desc" : 'Lounging by the pool', 
'Pin  Location': []};

function main(){    
    var container = document.getElementById('popup');
    //var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');
    let map = constructMap();  
    
    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });
    map.addOverlay(overlay);
    ////
    /*
    var GeoMap = new ga.Map({
        view: new ol.View({
          center: [600000, 200000]
        }),
        layers: [
          ga.layer.create('ch.swisstopo.pixelkarte-farbe')
        ],
        target: 'GeoMap'
      });
      GeoMap.geocode("Arbys");
      */
    /////
    closer.onclick = function(){
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    map.on('click', function(event){
        if(mode=="SEEN"){
            dogData['Last Seen'] = [event.coordinate[0],event.coordinate[1]]
            console.log(dogData['Last Seen'])
        }
        else if(mode=="SELECT"){
        if (map.hasFeatureAtPixel(event.pixel) === false) {
            dogData['Pin  Location'].push([event.coordinate[0],event.coordinate[1]]);
            map.addLayer(makePinLayer(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')));
            saveState = true;
            
            let pop = makeSound("assets/pop.mp3");
            pop.play(); //favicon error 404 here; investigate bug

        }
        else{
           // var coordinate = event.coordinate;
            overlay.setPosition(event.coordinate);
            fetchDog(dogData);
        }}
    })

    let saveButton = document.getElementById('dogEx');
    saveButton.addEventListener('click', event => {
        var newDog = {'ID': `${Date.now()}`, 'Name':'', 'Breed':'','Last Seen':dogData['Last Seen'],'Last Seen Desc': '','Pin Location': [dogData['Pin  Location']]};
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
    var stylePoints = {fillColor: "#fff00000"};
    var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat(coords))
                }),
            ],
            style: stylePoints
        })
    });
    return layer;
};

function toggleMode(){
    if(mode == modes.Select){
        mode = modes.Seen;
        document.getElementById('mode').innerHTML = "Mode: SEEN";
    }
    else{
        mode = modes.Select;
        document.getElementById('mode').innerHTML = "Mode: SELECT";
    }
    };

main();