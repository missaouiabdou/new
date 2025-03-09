const terminalLoader = document.querySelector(".terminal-loader");
const weatherCard = document.querySelector(".weather-card");

weatherCard.style.display = "none";

function showWeatherContent() {
  terminalLoader.style.display = "none";
  weatherCard.style.display = "block";
}

// Simulate a delay of 2-3 seconds before showing the weather content
setTimeout(showWeatherContent, 7000);

var currentt = document.querySelector(".weather-card");
var TT = document.querySelector(".con");
var dayse = document.querySelector("#ui");
var sunset = document.querySelector(".ft");
var loc = document.querySelector(".location");
const api = "4b9129337c0945d39e3120111250903";

const weathercode = {
    clear: [1000],
    partlyCloudy: [1003, 1006, 1009],
    cloudy: [1030, 1135, 1147, 1087],
    lightRain: [1169, 1171, 1183, 1186, 1189, 1192, 1201, 1204, 1207, 1240, 1243, 1246, 1273, 1276, 1279, 1282],
    heavyRain: [1087, 1276, 1279, 1282],
    thunderstorm: [1087, 1276, 1279, 1282],
    snow: [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1261, 1264, 1267, 1273, 1276, 1279, 1282],
    mist: [1030, 1135, 1147],
    fog: [1030, 1135, 1147],
    haze: [1030, 1135, 1147],
    smoke: [1030, 1135, 1147],
    dust: [1030, 1135, 1147],
    sand: [1030, 1135, 1147],
};

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, showError);
    } else {
        alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
}

function success(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    getWeatherByLocation(lat, lon);
}

function showError(error) {
    const errorMessages = {
        1: "L'utilisateur a refusé la demande de géolocalisation.",
        2: "Les informations de localisation ne sont pas disponibles.",
        3: "La demande de localisation a expiré.",
        0: "Une erreur inconnue s'est produite."
    };
    alert(errorMessages[error.code] || "Une erreur inconnue s'est produite.");
}

function getWeatherByLocation(lat, lon) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${api}&q=${lat},${lon}&days=6&aqi=no&alerts=no`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateWeatherUI(data);
        })
        .catch(error => console.error("Erreur API :", error));
}

function updateWeatherUI(data) {
    const tempValue = Math.round(data.current.temp_c);
    const minTemp = data.forecast.forecastday[0].day.mintemp_c;
    const maxTemp = data.forecast.forecastday[0].day.maxtemp_c;
    const dayName = data.forecast.forecastday[0].date;
    const nameValue = data.location.name;
    const descValue = data.current.condition.text;

    if (loc) loc.innerHTML = `<span>${nameValue}</span>`;

    const weatherIcon = Object.keys(weathercode).find(key => weathercode[key].includes(data.current.condition.code));

    if (currentt) {
        currentt.querySelector(".details").innerHTML = `
            <h3>${dayName}</h3>
            <p>${minTemp}/${maxTemp} <span>Feels Like ${tempValue}°C</span></p>
            <p>${descValue}</p>
        `;
        currentt.querySelector("#temp").innerHTML = `${tempValue}<span>°C</span>`;
        currentt.querySelector(".icon img").src = `img/icons/static/${weatherIcon}.svg`;
    }

    const combine = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour];
    displayHourlyData(combine);
    displayForecast(data.forecast.forecastday);

    if (sunset) {
        const sunr = data.forecast.forecastday[0].astro.sunrise;
        const sunn = data.forecast.forecastday[0].astro.sunset;
        sunset.innerHTML = `
            <span>${sunr}</span>
            <span>${sunn}</span>
        `;
    }
}

function displayHourlyData(hourlydata) {
    const cuurent = new Date().setMinutes(0, 0, 0);
    const neext = cuurent + 24 * 60 * 60 * 1000;

    const weatherdata = hourlydata.filter(({ time }) => {
        const date = new Date(time).getTime();
        return date >= cuurent && date <= neext;
    });

    if (TT) {
        TT.innerHTML = weatherdata.map(item => {
            const temperature = Math.round(item.temp_c);
            const time = item.time.split(" ")[1].slice(0, 5);
            const humidity = item.humidity;
            const weatherIcon = Object.keys(weathercode).find(key => weathercode[key].includes(item.condition.code));

            return `
                <div class="container">
                    <span>${time}</span>
                    <img src="img/icons/static/${weatherIcon}.svg" alt="Weather icon" height="30px">
                    <span>${temperature}°C</span>
                    <div class="con">
                        <span>H: ${humidity}%</span>
                    </div>
                </div>
            `;
        }).join("");
    }
}

function displayForecast(days) {
    const dayName = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    if (dayse) {
        dayse.innerHTML = days.map(day => {
            const date = new Date(day.date);
            const weatherIcon = Object.keys(weathercode).find(key => weathercode[key].includes(day.day.condition.code));
            return `
                <tr>
                    <td>${dayName[date.getDay()]}</td>
                    <td>${day.day.maxtemp_c}°C</td>
                    <td>${day.day.mintemp_c}°C</td>
                    <td>${day.day.avghumidity}%</td>
                    <td><img src="img/icons/static/${weatherIcon}.svg" height="30px"alt="Weather icon"></td>
                </tr>
            `;
        }).join("");
    }
}
getLocation();
