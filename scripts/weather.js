const cloud = document.querySelector('.cloudy__icon');
const partcloud = document.querySelector('.partly__cloudy__icon');
const snowy = document.querySelector('.snowy__icon');
const stormy = document.querySelector('.stormy__icon');
const sunny = document.querySelector('.sunny__icon');
const sunBackdrop = document.querySelector('.sunny__backdrop');
const partCloudBackdrop = document.querySelector('.partly__cloudy__backdrop');
const stormyBackdrop = document.querySelector('.stormy__backdrop');
const snowyBackdrop = document.querySelector('.snowy__backdrop');
let coordinates = [];
document.addEventListener('DOMContentLoaded', () => { 
    getLocation();
    
    setWeather = getWeather(location);
    console.log("latitude " + coordinates[0] + " longitude " + coordinates[1]);
});

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position=>{
            coordinates.push(position.coords.latitude);
            console.log(position.coords.latitude);
            coordinates.push(position.coords.longitude);
        })
    }else{
        console.log("Unable to fetch location");
    }

}
function getWeather(location){

    
} 


function setWeather(){

}