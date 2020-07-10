const theCity = [];

document.querySelector("#ownCityWeather").innerHTML =
  sessionStorage.getItem("ownCityWeather") || ``;

document.querySelector("#ownIcon").innerHTML =
  sessionStorage.getItem("ownIcon") || "";

document.querySelector("#yourCityType").innerHTML =
  sessionStorage.getItem("cityType") || "";

//console.log(document.querySelector("#ownIcon").innerHTML);

function showWeather(city) {
  //fetch weather
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=2c52f44abc37225f70c03a60124e1680`
  )
    .then(respo => respo.json())
    .then(cityData => {
      if (sessionStorage.getItem("ownCityWeather")) {
        //if weather info is saved in sessionStorage, means user's city weather has been shown and it should show searched city's weather
        //console.log("city searched for");
        //console.log(cityData);
        if (cityData.cod == 200) {
          //if city is in openweathermapAPI database
          document.querySelector("#notification").classList.remove("neutral");
          document.querySelector("#notification").classList.add("success");
          document.querySelector(
            "#notification"
          ).innerHTML = `<p>City found!😃</p>`;
          document.querySelector("#search").classList.add("city");
          document.querySelector("#search").classList.remove("error");
          document.querySelector(
            "#searchedCityType"
          ).innerHTML = `Searched City's Weather`;
          document.querySelector("#cityWeather").innerHTML = `<p>
                          <span class="cityName" id="new">${city}</span> <br />
                          <span class="temperature">${cityData.main.temp}°C</span>
                          <br />
                          <span class="description">${cityData.weather[0].description}</span>
                          </p>`;

          let imgUrl = `https://openweathermap.org/img/w/${cityData.weather[0].icon}.png`;

          document.querySelector(
            "#searchedIcon"
          ).innerHTML = `<img src="" alt="weather icon" id="citySearched" />`;

          document.querySelector("#citySearched").setAttribute("src", imgUrl);
        } else {
          //if city is not in openweathermapAPI database
          document.querySelector("#notification").classList.remove("neutral");
          document.querySelector("#notification").classList.add("error");
          document.querySelector(
            "#notification"
          ).innerHTML = `<p>City not found!😞</p>`;
        }
      } else {
        //to load user's city weather
        document
          .querySelector("#city")
          .classList.remove("lds-facebook", "error");
        document.querySelector("#box").classList.remove("center");
        document.querySelector("#city").classList.add("city");
        document.querySelector("#notification").innerHTML = ``;
        document.querySelector(
          "#yourCityType"
        ).innerHTML = `Your City's Weather`;
        document.querySelector("#ownCityWeather").innerHTML = `<p>
                        <span class="cityName" id="own">${city}</span> <br />
                        <span class="temperature">${cityData.main.temp}°C</span>
                        <br />
                        <span class="description">${cityData.weather[0].description}</span>
                        </p>`;

        let imgUrl = `https://openweathermap.org/img/w/${cityData.weather[0].icon}.png`;

        document.querySelector(
          "#ownIcon"
        ).innerHTML = `<img src="" alt="weather icon" id="cityIcon" />`;

        document.querySelector("#cityIcon").setAttribute("src", imgUrl);

        sessionStorage.setItem(
          "ownCityWeather",
          document.querySelector("#ownCityWeather").innerHTML
        );
        sessionStorage.setItem(
          "ownIcon",
          document.querySelector("#ownIcon").innerHTML
        );
        sessionStorage.setItem(
          "cityType",
          document.querySelector("#yourCityType").innerHTML
        );
        //console.log(document.querySelector("#ownIcon").innerHTML);
      }
    })
    .catch(error => {
      //if weather can't be gotten from openweathermapAPI
      document.querySelector("#city").classList.remove("lds-facebook");
      document.querySelector("#box").classList.remove("center");
      document.querySelector("#notification").classList.remove("neutral");
      document.querySelector("#notification").innerHTML = ``;
      if (sessionStorage.getItem("ownCityWeather")) {
        document.querySelector("#search").classList.add("city", "error");
        document.querySelector(
          "#cityWeather"
        ).innerHTML = `<p class="text-white">Sorry😞<br>Can't load weather at this moment</p>`;
      } else {
        document.querySelector("#city").classList.add("city", "error");
        document.querySelector(
          "#ownCityWeather"
        ).innerHTML = `<p class="text-white">Sorry😞<br>Can't load weather at this moment</p>`;
      }
    });
}

//check if city is your city
function checkCity(checkCity) {
  //console.log("checked city");
  if (theCity == []) {
    //console.log("empty");
    theCity.push(checkCity);
    let city = theCity[0];
    showWeather(city);
  } else if (theCity[0] != checkCity) {
    //console.log("new city");
    if (checkCity != document.querySelector("#own").innerHTML) {
      theCity.splice(0, 1, checkCity);
      let city = theCity[0];
      showWeather(city);
    } else {
      document.querySelector("#notification").classList.add("neutral");
      document.querySelector(
        "#notification"
      ).innerHTML = `<p>City's weather already showing🤨</p>`;
    }
  } else if (theCity[0] == checkCity) {
    //first check if city is saved in sessionStorage or displaying already
    if (checkCity == document.querySelector("#own").innerHTML) {
      document.querySelector("#notification").classList.add("neutral");
      document.querySelector(
        "#notification"
      ).innerHTML = `<p>City's weather already showing🤨</p>`;
    } else if (
      document.querySelector("#new") &&
      theCity[0] == document.querySelector("#new").innerHTML
    ) {
      document.querySelector("#notification").classList.add("neutral");
      document.querySelector(
        "#notification"
      ).innerHTML = `<p>City's weather already showing🤨</p>`;
    } else {
      theCity.splice(0, 1, checkCity);
      let city = theCity[0];
      showWeather(city);
    }
  }
}

function handleCitySearch(e) {
  //handle form submission
  e.preventDefault();
  document
    .querySelector("#notification")
    .classList.remove("success", "error", "neutral");
  document.querySelector(
    "#notification"
  ).innerHTML = `<div class="lds-facebook"><div></div><div></div><div></div></div>`;
  //console.log("Form Submitted");
  let searchedCity = document.querySelector("#cityInput").value;
  //console.log(document.querySelector("#own").innerHTML);
  console.log(theCity);
  checkCity(searchedCity);
  //console.log(searchedCity);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    //if geolocation is not supported
    document.querySelector("#city").classList.remove("lds-facebook");
    document.querySelector("#box").classList.remove("center");
    document.querySelector("#city").classList.add("city", "error");
    document.querySelector(
      "#cityWeather"
    ).innerHTML = `<p class="text-white">Geolocation not supported by browser😒.<br>Please enter your city to see it's weather in "Searched City's Weather"</p>`;
  }
}

function showPosition(position) {
  //get lng and lat
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;

  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDDVxlDxBMFkM37SKcxczPnUUuSNr7qwp4`
  )
    .then(resp => resp.json())
    .then(data => {
      let ownCity = "";
      const newData = data.results[0].address_components;

      newData.forEach(showCity);
      //console.log(typeof lat);
      //console.log(ownCity);

      checkCity(ownCity);

      function showCity(value, index, array) {
        //get city from googleAPI
        if (value.types[0] == "administrative_area_level_1") {
          ownCity = ownCity + value.long_name;
        }
      }
    })
    .catch(error => {
      //if address can't be gotten from googleAPI
      document.querySelector("#city").classList.remove("lds-facebook");
      document.querySelector("#box").classList.remove("center");
      document.querySelector("#city").classList.add("city", "error");
      document.querySelector(
        "#ownCityWeather"
      ).innerHTML = `<p class="text-white">Error!🚨<br>Can't load address<br>Please enter city name to load weather</p>`;
    });
}

//on submission of form
document
  .querySelector("#cityForm")
  .addEventListener("submit", handleCitySearch);

//to load getlocation only when weather data isn't saved in sessionStorage.
if (sessionStorage.getItem("ownCityWeather")) {
  document.querySelector("#city").classList.add("city"); //city card
  theCity.push(document.querySelector("#own").innerHTML);
  //console.log(theCity);
  //console.log(document.querySelector("#own").innerHTML);
} else {
  document.querySelector("#city").classList.add("lds-facebook"); //animation loading css
  document.querySelector("#box").classList.add("center");
  getLocation();
}
