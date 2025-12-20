// Weather description lookup map
const WEATHER_CODES = new Map([
    [0, "Clear sky"],
    [1, "Mainly clear"],
    [2, "Partly cloudy"],
    [3, "Overcast"],
    [45, "Fog"],
    [48, "Depositing rime fog"],
    [51, "Light drizzle"],
    [53, "Moderate drizzle"],
    [55, "Dense drizzle"],
    [61, "Slight rain"],
    [63, "Moderate rain"],
    [65, "Heavy rain"],
    [71, "Slight snow"],
    [73, "Moderate snow"],
    [75, "Heavy snow"],
    [95, "Thunderstorm"],
]);
export class WeatherManager {
    constructor(rootElement) {
        this.root = rootElement;
        this.input = this.root.querySelector("[data-weather-input]");
        this.button = this.root.querySelector("[data-weather-btn]");
        this.status = this.root.querySelector("[data-weather-status]");
        this.infoBox = this.root.querySelector("[data-weather-info]");
        this.tempEl = this.root.querySelector("[data-weather-temp]");
        this.windEl = this.root.querySelector("[data-weather-wind]");
        this.descEl = this.root.querySelector("[data-weather-desc]");
        this.button.addEventListener("click", () => this.loadWeather());
    }
    async loadWeather() {
        const city = this.input.value.trim();
        if (!city) {
            this.status.textContent = "Please enter a city name.";
            this.infoBox.style.display = "none";
            return;
        }
        this.status.textContent = "Searching...";
        this.infoBox.style.display = "none";
        try {
            const { latitude, longitude } = await this.lookupCity(city);
            const weather = await this.fetchWeather(latitude, longitude);
            const { temperature, windspeed, weathercode } = weather.current_weather;
            const desc = WEATHER_CODES.get(weathercode) ?? "Unknown";
            this.tempEl.textContent = temperature.toString();
            this.windEl.textContent = windspeed.toString();
            this.descEl.textContent = desc;
            this.status.textContent = `Weather for ${city}:`;
            this.infoBox.style.display = "block";
        }
        catch (error) {
            this.status.textContent = "Could not find weather for that city.";
            this.infoBox.style.display = "none";
        }
    }
    /** Step 1: Convert city → latitude/longitude */
    async lookupCity(city) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
        const res = await fetch(url);
        if (!res.ok)
            throw new Error("City lookup failed");
        const data = await res.json();
        if (!data.results || data.results.length === 0) {
            throw new Error("City not found");
        }
        const { name, latitude, longitude, country } = data.results[0];
        return { name, latitude, longitude, country };
    }
    /** Step 2: Get weather using lat/lon */
    async fetchWeather(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const res = await fetch(url);
        if (!res.ok)
            throw new Error("Weather fetch failed");
        return (await res.json());
    }
}
