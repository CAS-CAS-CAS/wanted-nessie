var mode = 'SELECT';
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
    /*
    this.play = function() {
        sound.play();
        console.log("POP");
    }*/
    return(sound);

}

function main(){
    var pop = makeSound("assets/pop.mp3");
    var json = JSON.stringify(dogData);
    console.log(json);    
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
            //dogData['Pin Location'].push(pinData);
            /*console.log(dogData['Last Seen']);
            if(dogData['Last Seen'].length < 1){
                console.log(dogData['Last Seen']);
                dogData['Last Seen'].push(pinData);
            }*/
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

           // console.log(document.getElementById('doggo'));
        }
    })
    let saveButton = document.getElementById('dogEx');
    saveButton.addEventListener('click', event => {
        var newDog = {'ID': Date.now(), 'Name':'', 'Breed':'',"Last Seen":dogData["Last Seen"],'Last Seen Desc': '',"Pin Location": [dogData['Pin  Location']]};
        console.log(newDog);
        getDogData(newDog);
        
        const options = {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newDog)
        };
        console.log(JSON.stringify(newDog));
        fetch('/api', options);
    })


}
//(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326') - convert a mouse click location to map coor[lon,lat]

async function fetchDog(dogData) {
    const response = await fetch("/assets/pooch.jpg");
    const blob = await response.blob();
    document.getElementById('popup-content').innerHTML = `<b></b><br/>
    <img src = "${URL.createObjectURL(blob)}" width = "60" height = "60" id = "doggo"><br>
    ${dogData.Name} <br>${dogData.Breed}<br>${dogData["Last Seen Desc"]}`;
    

    //document.getElementById('doggo').src = URL.createObjectURL(blob);
};

function getDogData(data){

    data['Name'] = document.getElementById("dname").value;
    data['Breed'] = document.getElementById("dbreed").value;
    data['Last Seen Desc'] = document.getElementById("dseen").value;
    console.log(data)

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
//Popups
/*var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

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

map.on('singleclick', function (event) {
    if (map.hasFeatureAtPixel(event.pixel) === true) {
        var coordinate = event.coordinate;
        content.innerHTML = '<b></b><br />I am a pup-up.';
        overlay.setPosition(coordinate);
        //console.log("if-pin");
       // setPoint(event, map);
    } 
    else {
        var coordinate = event.coordinate;
        overlay.setPosition(undefined);
        closer.blur();

        //repeateable point setting
        //console.log("else-pin");
        //console.log(event);
        //setPoint(event, map);
        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                        geometry: new ol.geom.Point([-111.9234527085402, 33.418017665847174])
                    })
                ]
            })
        });
        map.addLayer(layer);
    }});
    */


