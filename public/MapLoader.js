var saveState = false;

function main(){
    const dogData = {'ID': Date.now(),'Name': "Nellie", 'Size' : "Medium", "Last Seen" : [-12460306.871548783, 3951536.3379208655]
    , "Last Seen Desc" : 'Lounging by the pool', 
'Pin  Location': []};
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
            dogData['Pin  Location'].push(pinData);
            var layer = makePinLayer(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
            map.addLayer(layer);
            saveState = true;
            //console.log(dogData);
        }
        else{

            var coordinate = event.coordinate;
            overlay.setPosition(coordinate);
            fetchDog(dogData);

           // console.log(document.getElementById('doggo'));
        }
    })
   /* var saveButton = document.getElementById('dogSave');
    saveButton.addEventListener('click', event => {
        saveDogData();
    })*/


}
//(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326') - convert a mouse click location to map coor[lon,lat]

async function fetchDog(dogData) {
    const response = await fetch("/assets/pooch.jpg");
    const blob = await response.blob();
    document.getElementById('popup-content').innerHTML = `<b></b><br/>
    <img src = "${URL.createObjectURL(blob)}" width = "60" height = "60" id = "doggo"><br>
    ${dogData.Name} <br>${dogData.Size}<br>${dogData["Last Seen Desc"]}`;
    

    //document.getElementById('doggo').src = URL.createObjectURL(blob);
};
/*
function saveDogData(){
    if(saveState){
        const fileWriter = new FileWriter("data/DogData.txt");
        fileWriter.open();
        fileWriter.writeFile(`${JSON.stringify(dogData)}\n`);
        fileWriter.close();
        //fs.writeFile(`${JSON.stringify(dogData)}\n`, 'data/DogData.txt',(err =>{console.error(err);}))
        saveState = false;
    }
    else{
        console.log("No new data");
    }
}
*/
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


