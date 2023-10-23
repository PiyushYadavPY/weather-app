const Api= "a1a5afeed16b1174fb84b0dc57215a87";

const dayEl = document.querySelector(".default-day");
const dateEl =document.querySelector(".default-date");
const btnEl= document.querySelector(".btn-search");
const inputEl=  document.querySelector(".input-field");

const iconsContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day-info");
const listContentEl = document.querySelector(".list-content ul");


const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const day= new Date();

const dayName = days[day.getDay()];
dayEl.textContent = dayName;

let month = day.toLocaleString("default", {month : "long"});
let date = day.getDate();
let year = day.getFullYear();

console.log();
dateEl.textContent = date + " " + month + " " + year;

btnEl.addEventListener("click", (e) =>{
    e.preventDefault();

    if(inputEl.value !== ""){
        const Search = inputEl.value;
        inputEl.value = "";
        findLocation(Search)
    }
    else{
        console.log("Please Enter city or country name");
    }
});

async function findLocation(name){
    iconsContainer.innerHTML = "";
    dayInfoEl.innerHTML = "";
    listContentEl.innerHTML ="";
    try{
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${Api}`;
        const data = await fetch(apiUrl);
        const result = await data.json();
        console.log(result);

        if(result.cod !== "404"){
            const imageContent = displayImageContent(result);

            const rightSide = rightSideContent(result);

            displayForeCast(result.coord.lat, result.coord.lon);

            setTimeout(()=>{
                
                iconsContainer.innerHTML = imageContent
                dayInfoEl.innerHTML = rightSide
                iconsContainer.classList.add("fadeIn", rightSide);
            },1500);
        }
        else{
            const message = `<h2 class="weather-temp>${result.cod}</h2>
            <h3 class="cloudtxt">${result.message}</h3>`;
            // iconsContainer.insertAdjacentElement("afterbegin", message);
            iconsContainer.innerHTML(message);

        }
    }
    catch(error){
        console.error(error)
    };
}

function displayImageContent(data){
    return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="">
     <h2 class="weather-temp">${Math.round(data.main.temp - 275.15)}°C} </h2>
     <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
     
}

function rightSideContent(result){
    return `
    <div class= "content">
    <p class="title">NAME</p>
    <span class="value">${result.name}</span>
    </div>
    <div class="content">
    <p class="title">TEMP</p>
    <span class="value">${Math.round(result.main.temp - 275.15)}°C</span>
    </div>
    <div class="content">
    <p class="title">HUMIDITY</p>
    <span class="value">${result.main.humidity}</span>
    </div>
    <div class="content">
    <p class="title">WIND SPEED</p>
    <span class="value">${result.wind.speed} km/h</span>
    </div>
    `;
}
async function displayForeCast(lat , long){

    const ForeCastApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${Api}`;
    const data = await fetch(ForeCastApi);
    const result = await data.json();

    const uniqueForeCastDays = [];
    const daysForeCast = result.list.filter((forecast)=>{
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if(!uniqueForeCastDays.includes(forecastDate)){
            return uniqueForeCastDays.push(forecastDate);
        }
    });
    console.log(daysForeCast);

    daysForeCast.forEach((content , indx) =>{
        if(indx <= 4){
            // listContentEl.insertAdjacentElement("afterbegin", forecast(content));
            listContentEl.innerHTML = forecast(content)
        }
    });
}

function forecast(frContent){
    const day = new Date(frContent.dt_txt);
    const dayName = days[day.getDay()];
    const splitDay = dayName.split(",3");
    const joinDay = splitDay.join("");
    console.log(dayName, joinDay);

    return `
    <li>
    <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png" alt=""> 
    <span>${joinDay}</span>
    <span class="day-temp">${Math.round(frContent.main.temp - 275.15)}°C</span>
     </li>
    `
}
