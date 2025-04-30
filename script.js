let selectedMood = "";
let currentWeather = "";

const fetchedTemp = document.getElementById('temperature');
const fetchedCondition = document.getElementById('condition');
const weatherIcon = document.querySelector('.weather-icon')
const spotifyPlayer = document.getElementById('spotify-player')
const outfitList = document.querySelector('.outfit-list');
const weatherIcons = {
    'Clear': '☀️',
    'Rain': '🌧️',
    'Clouds': '☁️',
}

function getSpotifyEmbed(mood, weather) {
    const vibe = `${mood}_${weather}`;
    const playlists = {
        "happy_Clear": "https://open.spotify.com/embed/playlist/37i9dQZF1EIh0gn0qhBsTI?utm_source=generator", 
        "chill_Clear": "https://open.spotify.com/embed/playlist/281ziZIHBNCzLHMyH4TX73?utm_source=generator",
        "sad_Clear": "https://open.spotify.com/embed/playlist/3nSfkA7QvYZGiYaRwYxviS?utm_source=generator",
        "stressed_Clear": "https://open.spotify.com/embed/playlist/7kLztRTxv4XHJDqKdbsUcL?utm_source=generator", 
        "happy_Clouds": "https://open.spotify.com/embed/playlist/4GkQ4O8SvNQ6iHOgBaAsMc?utm_source=generator", 
        "chill_Clouds": "https://open.spotify.com/embed/playlist/6dZQPX50h8aLzzyLqQbJmC?utm_source=generator", 
        "sad_Clouds": "https://open.spotify.com/embed/playlist/3y6jAYet1roSh2RzePC10h?utm_source=generator", 
        "stressed_Clouds": "https://open.spotify.com/embed/playlist/37i9dQZF1EIdEbtcbwjUsw?utm_source=generator", 
        "happy_Rainy": "https://open.spotify.com/embed/playlist/37i9dQZF1EId3GGm8F19zq?utm_source=generator", 
        "chill_Rainy": "https://open.spotify.com/embed/playlist/37i9dQZF1EIgsKZ1OeM5Qc?utm_source=generator", 
        "sad_Rainy": "https://open.spotify.com/embed/playlist/37i9dQZF1EIgUnp18Jl5J9?utm_source=generator", 
        "stressed_Rainy": "https://open.spotify.com/embed/playlist/37i9dQZF1EIfSvy7beWVGl?utm_source=generator",
    };

    const defaultWeatherPlaylists = {
      Clear: "https://open.spotify.com/embed/playlist/37i9dQZF1EIhkGftn1D0Mh?utm_source=generator",
      Clouds: "https://open.spotify.com/embed/playlist/37i9dQZF1EIgxHuuVqSn9D?utm_source=generator",
      Rain: "https://open.spotify.com/embed/playlist/37i9dQZF1EIh5QTm0PNBlW?utm_source=generator"
    };

    return (
      playlists[vibe] ||
      defaultWeatherPlaylists[weather] ||
      playlists["happy_Clear"]
    );
}

function getOutfitSuggestion(weather) {
    const lowerWeather = weather.toLowerCase();
    const outfits = {
      clear: [
        ["t-shirt", "shorts", "sneakers"],
        ["polo shirt", "shorts", "sneakers"],
        ["hoodie", "cargo shorts", "running shoes"]
      ],
      rain: [
        ["rain jacket", "joggers", "rain boots"],
        ["windbreaker", "jeans", "waterproof sneakers"],
        ["hooded sweatshirt", "track pants", "boots"]
      ],
      clouds: [
        ["long-sleeve t-shirt", "jeans", "sneakers"],
        ["crewneck sweatshirt", "straight-leg pants", "casual shoes"],
        ["jacket", "denim pants", "canvas sneakers"]
      ]
    };
    return outfits[lowerWeather];
}
function updateSpotifyPlayer(mood, weather){
    const spotifyEmbedUrl = getSpotifyEmbed(mood, weather)
    spotifyPlayer.src = spotifyEmbedUrl
}

const clothingIcons = {
  "t-shirt": "t-shirt.png",
  "shorts": "shorts.png",
  "sneakers": "sneakers.png",
  "polo shirt": "t-shirt.png",
  "hoodie": "hoodie.png",
  "cargo shorts": "shorts.png",
  "running shoes": "sneakers.png",
  "rain jacket": "raincoat.png",
  "joggers": "jogger-pants.png",
  "rain boots": "boot.png",
  "windbreaker": "windbreaker.png",
  "waterproof sneakers": "sneakers.png",
  "hooded sweatshirt": "hoodie.png",
  "track pants": "jogger-pants.png",
  "boots": "boot.png",
  "long-sleeve t-shirt": "long-sleeve.png",
  "crewneck sweatshirt": "long-sleeve.png",
  "jacket": "jacket.png",
  "jeans": "jeans.png",
  "straight-leg pants": "jeans.png",
  "casual shoes": "sneakers.png",
  "denim pants": "jeans.png",
  "canvas sneakers": "sneakers.png"
};

function updateOutfit(weather) {
  const options = getOutfitSuggestion(weather);
  if (options && options.length > 0) {
    const outfit = options[Math.floor(Math.random() * options.length)];

    outfitList.innerHTML = outfit.map(item => {
      const icon = clothingIcons[item.toLowerCase()] || "default.png";
      return `
        <div class="outfit-item">
          <img src="icons/${icon}" alt="${item}" style="width: 30px; vertical-align: middle;" />
          <span>${item}</span>
        </div>
      `;
    }).join('');
  }
}

document.querySelectorAll(".mood").forEach(button => {
    button.addEventListener("click", () => {
        selectedMood = button.dataset.mood;
        if (currentWeather) {
            updateSpotifyPlayer(selectedMood, currentWeather);
            updateOutfit(selectedMood, currentWeather);
        }
    });
});
navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = '59a621cf06f68dea3dba8cc62db94e26';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    const result = await fetch(url)
    const data = await result.json();
    const fetchedTemperature = Math.round(data.main.temp);
    const fetchedWeather = data.weather[0].main;
    fetchedTemp.innerText = `${fetchedTemperature}°F`;
    fetchedCondition.innerText = fetchedWeather;
    currentWeather = fetchedWeather;
    weatherIcon.innerText = weatherIcons[fetchedWeather] || "🌡️";
    if(selectedMood){
        updateSpotifyPlayer(selectedMood, currentWeather);
    }
    updateOutfit(currentWeather);
    const defaultMood = ["happy", "chill", "sad", "stressed"][Math.floor(Math.random() * 4)];
    updateSpotifyPlayer("default", currentWeather);
})
