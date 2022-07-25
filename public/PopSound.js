var clickSound = new sound("pop.mp3");


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