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

// Wind Chill Calculation
function calculateWindChill(temp, wind) {
  if (temp <= 10 && wind > 4.8) {
    return (
      13.12 +
      0.6215 * temp -
      11.37 * Math.pow(wind, 0.16) +
      0.3965 * temp * Math.pow(wind, 0.16)
    ).toFixed(1);
  } else {
    return "N/A";
  }
}

document.getElementById("windchill").textContent = calculateWindChill(
  temperature,
  windSpeed
);
