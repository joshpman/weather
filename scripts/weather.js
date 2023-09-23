const backgrounds = ["backgrounds/cloudy-backdrop.jpg","backgrounds/partly-cloudy-background.jpg"
,"backgrounds/snowy-background.jpg","backgrounds/stormy-background.jpg"
,"backgrounds/raining-backdrop.jpg","backgrounds/sunny-background.jpg",
"../backgrounds/night-backdrop.jpeg"];
const conditions = ["Cloudy", "Partly Cloudy", "Snowing", "Storming", "Raining", "Sunny"];
const weekdays =["Sun", "Mon", "Tues", "Weds", "Thur", "Fri", "Sat"];
const fullDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const icons = document.getElementsByClassName("placeholder__icons__start");
const dayCardDays = document.getElementsByClassName("day__of__week");
let days = [];
const date = new Date();
const fullDay = fullDays[date.getDay()];
const dayInMonth = date.getDate();
const month = months[date.getMonth()];
const year = date.getFullYear();
const currentHour = date.getHours();
const currentMinute = date.getMinutes();
const formattedTime = currentHour + "" + currentMinute;
let city = null;
let state = null;
let currentCondition;
let sunrise;
let sunset;
const iconMap = new Map();
const backdropMap = new Map();
const codeMap = new Map();
const codeMapSimplified = new Map();


document.getElementsByClassName("change__location")[0].addEventListener('click',transition);
document.addEventListener('DOMContentLoaded', () => {
    createMaps();
    getLocation().then(coordinates =>{
        getCity(coordinates);
        getDailyWeather(coordinates);
        getWeeklyWeather(coordinates);
    }), error=>{
        console.log(error);
    }
    updateDate();    
});
function createMaps(){
    for(let i = 0; i<backgrounds.length;i++){       
        iconMap.set(conditions[i], icons[i]);
        backdropMap.set(conditions[i], backgrounds[i]);
    }
    generateWeathercodeMap();
}
/*This function is painful but I cant come up with a better method
Weathercodes appear to follow no mathematical pattern or ordering*/
function generateWeathercodeMap(){
    codeMap.set(0, "Sunny");
    codeMap.set(1, "Partly Cloudy");
    codeMap.set(2, "Partly Cloudy");
    codeMap.set(3, "Overcast");
    codeMap.set(45, "Foggy");
    codeMap.set(48, "Foggy");
    codeMap.set(51, "Drizzling");
    codeMap.set(53, "Drizzling");
    codeMap.set(55, "Drizzling");
    codeMap.set(56, "Freezing Drizzle");
    codeMap.set(57, "Freezing Drizzle");
    codeMap.set(61, "Light Rain");
    codeMap.set(63, "Moderate Rain");
    codeMap.set(65, "Heavy Rain");
    codeMap.set(66, "Freezing Rain");
    codeMap.set(67, "Freezing Rain");
    codeMap.set(71, "Light Snow");
    codeMap.set(73, "Moderate Snow");
    codeMap.set(75, "Heavy Snow");
    codeMap.set(77, "Snow Grains");
    codeMap.set(80, "Light Showers");
    codeMap.set(81, "Moderate Showers");
    codeMap.set(82, "Heavy Showers");
    codeMap.set(85, "Light Snow");
    codeMap.set(86, "Heavy Snow");
    codeMap.set(95, "Storming");
    codeMap.set(96, "Storming");
    codeMap.set(99, "Storming");
    codeMapSimplified.set("Sunny", "Sunny");
    codeMapSimplified.set("Partly Cloudy", "Partly Cloudy");
    codeMapSimplified.set("Foggy", "Cloudy");
    codeMapSimplified.set("Overcast", "Cloudy");
    codeMapSimplified.set("Drizzling", "Raining");
    codeMapSimplified.set("Freezing Drizzle","Raining");
    codeMapSimplified.set("Light Rain", "Raining");
    codeMapSimplified.set("Moderate Rain", "Raining");
    codeMapSimplified.set("Heavy Rain", "Raining");
    codeMapSimplified.set("Freezing Rain", "Raining");
    codeMapSimplified.set("Light Snow", "Snowing");
    codeMapSimplified.set("Moderate Snow", "Snowing");
    codeMapSimplified.set("Heavy Snow", "Snowing");
    codeMapSimplified.set("Light Showers", "Raining");
    codeMapSimplified.set("Moderate Showers", "Raining");
    codeMapSimplified.set("Heavy Showers", "Raining");
    codeMapSimplified.set("Storming", "Storming");
    codeMapSimplified.set("Snow Grains", "Snowing");
}
function parseForSymbol(input){  
    return codeMapSimplified.get(input);
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
/* Function to check if its currently dark outside to adjust theming + weather terms */
function checkNight(){
    const sunsetFormatted = sunset.split("T")[1].split(":").join("");
    const sunriseFormatted = sunrise.split("T")[1].split(":").join("");
    if(sunsetFormatted<formattedTime<sunriseFormatted) nightMode();
}
/*Function to adjust themeing to coorespond to night time */
function nightMode(){

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
/*Simple function to transition the change location button to a text form + submit button */
function transition(){
    document.getElementsByClassName("change__location")[0].style.display = "none";
    document.getElementsByClassName("morph__text-box")[0].style.display = "flex";
    document.getElementsByClassName("submit__button")[0].addEventListener('click', ()=>{
        const inputCity = document.getElementsByClassName("location__input")[0].value;
        if(inputCity.length>2){
            getCoordinates(inputCity);
            document.getElementsByClassName("location__input")[0].value = "";
            deTransition();
        }

    });
}
function deTransition(){
    document.getElementsByClassName("change__location")[0].style.display = "flex";
    document.getElementsByClassName("morph__text-box")[0].style.display = "none";
}
function getCoordinates(cityName){
    
    let promise = new Promise(function(resolve, reject){
        let request = new XMLHttpRequest()
        const url = `https://us1.locationiq.com/v1/search?key=pk.19cb014570b4901570dd01c6c245324d&q=${cityName}&format=json&addressdetails=1&normalizecity=1&statecode=1`
        request.addEventListener('loadend', function(){
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
        response => callWeatherFuncs(response),
        errorMessage => printError(errorMessage)
    );
}
function callWeatherFuncs(response){
    let city = response[0].address.city;
    let state = response[0].address.state;
    parseCity(response);
    let coords = [];
    coords.push(response[0].lat);
    coords.push(response[0].lon);
    getDailyWeather(coords);
    getWeeklyWeather(coords);

}

/*Function to handle API request for daily weather, goes by hour to get temp + condition accuracy*/
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
/*API Request to get weekly weather, gathers min/max temp + weathercode for four days*/
function getWeeklyWeather(coordinates) {
    let promise = new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      const url = `https://api.open-meteo.com/v1/gfs?latitude=${coordinates[0]}&longitude=${coordinates[1]}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=fahrenheit&timezone=America%2FChicago&forecast_days=4`;
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
    const conditionCurrent = parseCode(response.hourly.weathercode[currentHour]);
    const simplifiedCondition = parseForSymbol(conditionCurrent);
    const leftBackground =document.getElementsByClassName("left__image")[0];
    const oldIcon = document.getElementsByClassName("left__svg__wrapper")[0].children[0];
    const newIcon = iconMap.get(simplifiedCondition).cloneNode(true);
    const currentTemp = Math.round(response.hourly.temperature_2m[currentHour]);
    const tempFormatted = currentTemp + "&degF";
    const rainChance = response.hourly.precipitation_probability[currentHour];
    const humidity = response.hourly.relativehumidity_2m[currentHour];
    const feelsLike = Math.round(response.hourly.apparent_temperature[currentHour]);
    oldIcon.parentNode.replaceChild(newIcon, oldIcon);
    leftBackground.src= backdropMap.get(simplifiedCondition);
    document.getElementById("precip__chance").innerHTML = rainChance + "%";
    document.getElementById("humidity__percent").innerHTML = humidity + "%";
    document.getElementById("feels__like__temp").innerHTML = feelsLike + "&degF"
    document.getElementsByClassName("temperature")[0].innerHTML = tempFormatted;
    document.getElementById("temp__for__card1").innerHTML=tempFormatted;
    document.getElementsByClassName("condition")[0].innerHTML = conditionCurrent;
}

function parseResponseWeekly(response){
    sunrise = response.daily.sunrise[0];
    sunset = response.daily.sunset[0];
    const iconHolder = document.getElementsByClassName("forecast__icon__wrapper");
    let iconCodes = [];
   for(let i = 0; i<4;i++){
    let currentIcon = iconMap.get(parseForSymbol(parseCode(response.daily.weathercode[i]))).cloneNode(true);
    let oldChild = iconHolder[i].children[0];
    iconHolder[i].replaceChild(currentIcon, oldChild);
   }
   const maxInHTML = document.getElementsByClassName("temperature__for-card-max");
   const minInHTML = document.getElementsByClassName("temperature__for-card-min");
   for(let i = 0; i<4; i++){   
        maxInHTML[i].innerHTML= Math.round(response.daily.temperature_2m_max[i]) + "&degF";
        minInHTML[i].innerHTML= Math.round(response.daily.temperature_2m_min[i]) + "&degF";
   }
   checkNight();
}


function parseCode(code){
    return codeMap.get(code);
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
    let locationFormatted;
    if(Array.isArray(data)){
        data=Array.from(data);
        let parseableData = data[0].address
        if("city" in parseableData){
            if("state_code" in parseableData){
                locationFormatted = parseableData.city + ", " + parseableData.state_code.toUpperCase();
            }else{
                locationFormatted = parseableData.city + ", " + parseableData.state;
            }
        }else if("county" in parseableData){
            if("state_code" in parseableData){
                locationFormatted = parseableData.county + ", " + parseableData.state_code.toUpperCase();
            }else{
                locationFormatted = parseableData.county + ", " + parseableData.state;
            }
        }else if("state" in parseableData){
                locationFormatted = parseableData.state + ", " + parseableData.country;
        }else{
            locationFormatted = parseableData.country;
        }
    }else{
        if("city" in data.address){
            if("state_code" in data.address){
                locationFormatted = data.address.city + ", " + data.address.state_code.toUpperCase();
                
            }else{
                locationFormatted = data.address.city + ", " + data.address.state;
            }
        }else if("county" in data.address){
            if("state_code" in data.address){
                locationFormatted = data.address.county + ", " + data.address.state_code.toUpperCase();
            }else{
                locationFormatted = data.address.county + ", " + data.address.state;
            }
        }else if("state" in data.address){
                locationFormatted = data.address.state + ", " + data.address.country;
        }else{
            locationFormatted = data.address.country;
        }
    }
    changeCity(locationFormatted);
}
function changeCity(nameFormatted){
    document.getElementsByClassName("location")[0].innerHTML = nameFormatted;
}
/*
Basic buisness logic:

On page load:
    0. Update days of the week on forecast cards to be accurate
    1. Get user location with latitude and longitude
    2. Make three unique API calls
        a. Call the locationIQ API to figure out what city corresponds to the users Lat and Long
        b. Make another API call for daily weather for four days, to display what goes on the 3 forecast cards after day 1
            Note: parse the data into a json and read the points needed, create a seperate function to analyze weather codes
        c. First API call gets hourly weather data for one hour, ie figure out what goes on the current tab/today data
        Note: With all of these, parse the data and pull out the necessary information immediately and update the webpage immediately

On change location click:
    1. Transition CSS to make the button a submit button + textfield
    2. Call the location IQ api to get the coordinates of the city inputted
    2.5. Update location in innerHTML so the text appears correct
    3. Call the get weather functions to fetch + update weather.
*/