// Retrieve user information from localStorage
const storedUsername = localStorage.getItem("username");
const storedDeviceID = localStorage.getItem("Hscore");

// Update UI elements with retrieved values
const userNameElement = document.getElementById("user-name-text");
const deviceIdElement = document.getElementById("device-id-text");

userNameElement.textContent = storedUsername || "Guest"; // Use default if not stored
deviceIdElement.textContent = storedDeviceID || "-"; // Use default if not stored

// Allow username editing
userNameElement.addEventListener("click", () => {
  const newUsername = prompt("Enter your new username:");

  if (newUsername) {
    localStorage.setItem("username", newUsername);
    userNameElement.textContent = newUsername;
  }
});

// Handle game mode button clicks
const gameModeButtons = document.querySelectorAll(".game-mode-button");
gameModeButtons.forEach(button => {
  button.addEventListener("click", () => {
    const gameMode = button.classList.contains("single") ? "single" : "multiple";

    if (gameMode === "multiple") {
      const isLoggedIn = localStorage.getItem("loggedIn") === "true";

      if (isLoggedIn) {
        window.location.href = `${gameMode}.html`;
      } else {
        window.location.href = "login.html";
      }
    } else {
      window.location.href = `${gameMode}.html`;
    }
  });
});

// Handle other button clicks
const settingsButton = document.querySelector(".settings-button");
settingsButton.addEventListener("click", () => {
  window.location.href = "settings.html";
});

const leaderboardButton = document.querySelector(".leaderboard-button");
leaderboardButton.addEventListener("click", () => {
  window.location.href = "leaderboard.html";
});
