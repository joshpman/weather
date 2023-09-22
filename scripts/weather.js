const backgrounds = ["../backgrounds/cloudy-backdrop.jpg","../backgrounds/partly-cloudy-background.jpg"
,"../backgrounds/snowy-background.jpg","../backgrounds/stormy-background.jpg"
,"../backgrounds/raining-background.jpg","../backgrounds/sunny-background.jpg"]
const icons = document.getElementsByClassName("placeholder__icons__start");
const dayCardDays = document.getElementsByClassName("day__of__week");
const conditions = ["Cloudy", "Partly Cloudy", "Snowing", "Storming", "Raining", "Sunny"];
const date = new Date();
const weekdays =["Sun", "Mon", "Tues", "Weds", "Thur", "Fri", "Sat"];
const fullDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const fullDay = fullDays[date.getDay()];
let days = [];
const dayInMonth = date.getDate();
const month = months[date.getMonth()];
const year = date.getFullYear();
const currentHour = date.getHours();
let city = null;
let state = null;
let currentCondition;
const iconMap = new Map();
const backdropMap = new Map();


document.addEventListener('DOMContentLoaded', () => {
    
    createMaps();
    getLocation().then(coordinates =>{
        getCity(coordinates);
        getDailyWeather(coordinates);
        getWeeklyWeather(coordinates);
    }), error=>{
        console.log(error);
    }
    checkNight();
    updateDate();    
});
function createMaps(){
    for(let i = 0; i<backgrounds.length;i++){       
        iconMap.set(conditions[i], icons[i]);
        backdropMap.set(conditions[i], backgrounds[i]);
    }
    generateWeathercodeMap();
}

function generateWeathercodeMap(){

}
function updateDate(){
    let i = 0;
    let pointerI = date.getDay()
    while(i<4){
        days.push(weekdays[pointerI]);
        pointerI++;
        i++;
        if(pointerI==7) pointerI=0;
    }
    
    const fullDate = dayInMonth + " " + month + " " + year;
    document.getElementsByClassName("weekday")[0].innerHTML = fullDay;
    document.getElementsByClassName("date")[0].innerHTML = fullDate;
    for(let j = 0; j<4; j++){
        dayCardDays[j].innerHTML = days[j];
    }
    
}
function checkNight(){

}
function getLocation(){
    
    return new Promise((resolve, reject)=>{
        let coordinates = [];
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(position=>{
                coordinates.push(position.coords.latitude);
                coordinates.push(position.coords.longitude);
                resolve(coordinates);
            }, ()=>{
                reject("Error getting coordinates");
            });
        }else{
            console.log("Unable to fetch location");
        }
    });
}

function getDailyWeather(coordinates){
    let promise = new Promise(function(resolve,reject){
        let request = new XMLHttpRequest();
        const url = `https://api.open-meteo.com/v1/gfs?latitude=${coordinates[0]}&longitude=${coordinates[1]}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,weathercode&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago&forecast_days=1`;
        request.addEventListener("loadend", function() { 
            const response = JSON.parse(this.responseText);
            if(this.status == 200){
                resolve(response);
            }else{
                reject(response);
            }
        });
        request.open("GET", url, true);
        request.send();

    });
    promise.then(
        response => parseResponseDaily(response),
        errorMessage => printError(errorMessage)
    );
    
}
function getWeeklyWeather(coordinates) {
    let promise = new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      const url = `https://api.open-meteo.com/v1/gfs?latitude=${coordinates[0]}&longitude=${coordinates[1]}&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago&forecast_days=4`;
      request.addEventListener("loadend", function() {
        const response = JSON.parse(this.responseText);
        if (this.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      });
      request.open("GET", url, true);
      request.send();
    });
    promise.then(
        response => parseResponseWeekly(response),
        errorMessage => printError(errorMessage)
    );
}
function parseResponseDaily(response){
    const conditionCurrent = parseWeatherCode(response.hourly.weathercode[currentHour]);
    const leftBackground =document.getElementsByClassName("left__image")[0];
    const oldIcon = document.getElementsByClassName("left__svg")[0];
    const newIcon = iconMap.get(conditionCurrent).cloneNode(true);
    const currentTemp = Math.round(response.hourly.temperature_2m[currentHour]);
    const tempFormatted = currentTemp + "&degF";
    const rainChance = response.hourly.precipitation_probability[currentHour];
    const humidity = response.hourly.relativehumidity_2m[currentHour];
    const feelsLike = Math.round(response.hourly.apparent_temperature[currentHour]);
    oldIcon.parentNode.replaceChild(newIcon, oldIcon);
    leftBackground.src= backdropMap.get(conditionCurrent);
    document.getElementById("precip__chance").innerHTML = rainChance + "%";
    document.getElementById("humidity__percent").innerHTML = humidity + "%";
    document.getElementById("feels__like__temp").innerHTML = feelsLike + "&degF"
    document.getElementsByClassName("temperature")[0].innerHTML = tempFormatted;
    document.getElementById("temp__for__card1").innerHTML=tempFormatted;
    document.getElementsByClassName("condition")[0].innerHTML = parseWeatherCode(response.hourly.weathercode[currentHour]);
}

function parseResponseWeekly(response){
   // parseWeatherCode(response.daily.weathercode);
   const maxInHTML = document.getElementsByClassName("temperature__for-card-max");
   const minInHTML = document.getElementsByClassName("temperature__for-card-min");
   console.log(response);
   for(let i = 0; i<4; i++){   
        maxInHTML[i].innerHTML= Math.round(response.daily.temperature_2m_max[i]) + "&degF";
        minInHTML[i].innerHTML= Math.round(response.daily.temperature_2m_min[i]) + "&degF";
   }
}


function parseWeatherCode(code){
    const x = code;
    switch(x){
        case 0:
            currentCondition = "Sunny";
            break;
        case 2:
            currentCondition = "Partly Cloudy";
            break;
        case 3:
            currentCondition = "Cloudy";
            break;
        case (x<=67):
            currentCondition = "Raining";
            break;
        case (x<=77):
            currentCondition = "Snowing";
            break;
        case (x<=82):
            currentCondition = "Raining";
            break;
        case (x<=86):
            currentCondition = "Snowing";
            break;
        case (x<=99):
            currentCondition = "Storming";
            break;
        default:
            currentCondition = "Misc";
    }
    return currentCondition;

}
function printError(errorMessage){
    console.log(errorMessage);
}


function getCity(coordinates){
    let promise = new Promise(function(resolve,reject){
        let request = new XMLHttpRequest();
        const url = `https://us1.locationiq.com/v1/reverse?key=pk.19cb014570b4901570dd01c6c245324d&lat=${coordinates[0]}&lon=${coordinates[1]}&normalizecity=1&statecode=1&format=json`;
        request.addEventListener('loadend', function(){
            const response = JSON.parse(this.responseText);
            if(this.status === 200){
                resolve(response);
            }else{
                reject(response);
            }
        });
        request.open("GET", url, true);
        request.send();
    });
    promise.then(
        response => parseCity(response),
        errorMessage => printError(errorMessage)
    );
}

function parseCity(data){
    city = data.address.city;
    if(data.address.state !== undefined) state = data.address.state_code.toUpperCase();
    const locationFormatted = city + ", " + state;
    document.getElementsByClassName("location")[0].innerHTML = locationFormatted;
}
/*
Basic buisness logic:

On page load:
    0. Update days of the week on forecast cards to be accurate
    1. Get user location with latitude and longitude
    2. Make three unique API calls
        a. Call the google location API to figure out what city corresponds to the users Lat and Long
        b. Make another API call for daily weather for four days, to display what goes on the 3 forecast cards after day 1
            Note: parse the data into a json and read the points needed, create a seperate function to analyze weather codes
        c. First API call gets hourly weather data for one hour, ie figure out what goes on the current tab/today data
        Note: With all of these, parse the data and pull out the necessary information immediately and update the webpage immediately
*/