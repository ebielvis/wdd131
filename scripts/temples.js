// temples.js

// Hamburger menu toggle
const menuButton = document.getElementById("menu");
const navMenu = document.getElementById("navmenu");

menuButton.addEventListener("click", () => {
  navMenu.style.display = navMenu.style.display === "flex" ? "none" : "flex";
});

// Footer year and last modified
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;
