
function main(){
    var map = constructMap();
    var coord = [-111.9234527085402, 33.418017665847174];
    
    map.on('click', function(event){
        var layer = makePinLayer(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
        map.addLayer(layer);
    })
    
}
//event.coordinate, 'EPSG:3857', 'EPSG:4326'

function constructMap(){
    const centerCoor = [-111.9234527085402, 33.418017665847174];
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


