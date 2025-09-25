// Footer dates
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

// Weather Data (simulated for assignment)
const temperature = 28; // Celsius
const windSpeed = 10; // km/h
const conditions = "Sunny";

// Output weather data
document.getElementById("temperature").textContent = temperature;
document.getElementById("wind").textContent = windSpeed;
document.getElementById("conditions").textContent = conditions;

// One-line wind chill function
const calculateWindChill = (t, w) => (t <= 10 && w > 4.8) 
  ? (13.12 + 0.6215 * t - 11.37 * Math.pow(w, 0.16) + 0.3965 * t * Math.pow(w, 0.16)).toFixed(1) 
  : "N/A";

// Call only if conditions are met
document.getElementById("windchill").textContent = calculateWindChill(temperature, windSpeed);
