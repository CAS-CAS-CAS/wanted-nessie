var clickSound = new sound("pop.mp3");
constructMap();
console.log(window.location);

function constructMap(){
/*console.log("LIFT OFF!");
console.log("LIVE LOOPIN, BABY!!\nAlmond milk hit")*/
var centerCoor = [-111.9234527085402, 33.418017665847174];
var map = new ol.Map({
target: 'map',
layers: [
    new ol.layer.Tile({
        source: new ol.source.OSM()
        })
    ],
view: new ol.View({
center: ol.proj.fromLonLat(centerCoor), //[-12460306.871548783, 3951536.3379208655]
minZoom: 15,
zoom: 17
    })
});
//marker
var layer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [
            new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat(centerCoor))//[4.35247, 50.84673]))
            })
        ]
    })
});

//Popups
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});




//add to map
map.addLayer(layer);
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
    clickSound.play();
    console.log(coordinate);
    overlay.setPosition(coordinate);
    console.log("if-pin");
    setPin(event);


} 
else {
    var coordinate = event.coordinate;
    console.log(ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'));
    overlay.setPosition(undefined);
    closer.blur();

    //repeateable point setting
    console.log("else-pin");
    console.log(event);
    setPin(event);
}
    });
function setPin(event){
  //  console.log(event)
    var self = this;
    var latLong = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
    var lat     = latLong[1];
    var long    = latLong[0];
    //console.log(this);
   // self.params.options.mapClick({lat: lat, long:long});

    if(self.dinamicPinLayer !== undefined){
        console.log("move")
        self.iconGeometry.setCoordinates(event.coordinate);
          //or create another pin  
    } else {
        self.iconGeometry = new ol.geom.Point(event.coordinate);
        console.log(self.iconGeometry);

        var iconFeature = new ol.Feature({
            geometry: self.iconGeometry,
            name: 'Null Island',
            population: 4000,
            rainfall: 500
        });
        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 46],
                archorUnitsX: 'fraction',
                anchorUnitsY: 'pixels',
                size: [48,48],
                opacity: 1,
                src: 'star.png'
            }))
        });

        iconFeature.setStyle(iconStyle);

        var vectorSource = new ol.source.Vector({
            features: [iconFeature]
        });
        self.dinamicPinLayer = new ol.layer.Vector({
            source: vectorSource
        });
        map.addLayer(self.dinamicPinLayer);
    } 
}

}

function sound(source){
    this.sound = document.createElement("audio");
    this.sound.source = source;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    //this.sound.setAttribute("volume", "1.1");
    this.sound.style.display = "none";
    document.body.append(this.sound);
    
    this.play = function() {
        this.sound.play();
        console.log("POP");
    }


}