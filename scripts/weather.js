const cloud = document.querySelector('.cloudy__icon');
const partcloud = document.querySelector('.partly__cloudy__icon');
const snowy = document.querySelector('.snowy__icon');
const stormy = document.querySelector('.stormy__icon');
const sunny = document.querySelector('.sunny__icon');
const sunBackdrop = document.querySelector('.sunny__backdrop');
const partCloudBackdrop = document.querySelector('.partly__cloudy__backdrop');
const stormyBackdrop = document.querySelector('.stormy__backdrop');
const snowyBackdrop = document.querySelector('.snowy__backdrop');
let weekdays =["Sun", "Mon", "Tues", "Weds", "Thur", "Fri", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let city = null;
let state = null;
let today = 
document.addEventListener('DOMContentLoaded', () => {
    getLocation().then(coordinates =>{
        getCity(coordinates);
        getDailyWeather(coordinates);
        getWeeklyWeather(coordinates);
    }), error=>{
        console.log(error);
    }
    });

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
function getDailyWeather(coordinates) {
    let promise = new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      const url = `https://api.open-meteo.com/v1/gfs?latitude=${coordinates[0]}&longitude=${coordinates[1]}&daily=weathercode,temperature_2m_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago&forecast_days=1`;
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
        response => parseResponseDaily(response),
        errorMessage => printError(errorMessage)
    );
    
}

function getWeeklyWeather(coordinates){
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
        response => parseResponseWeekly(response),
        errorMessage => printError(errorMessage)
    );
    
}

function parseResponseDaily(response){
   // parseWeatherCode(response.daily.weathercode);
    console.log(response);
}
function parseResponseWeekly(response){
    console.log(response);
}
function parseWeatherCode(code){

}
function printError(errorMessage){
    console.log(errorMessage);
}


function setWeather(){

}

function updateDays(){

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
    console.log(city);
    console.log(state);
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