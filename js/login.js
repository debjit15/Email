window.addEventListener("load", () => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  if (isLoggedIn) {
    // User is logged in, redirect to index.html
    window.location.href = "index.html";
  } else {
   const loginForm = document.getElementById("login-form");
const nextButton = document.getElementById("next-button");
const passwordField = document.getElementById("password");
const verificationCodeField = document.getElementById("verification-code");
const submitButton = document.querySelector("button[type='submit']");

  nextButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const email = loginForm.email.value;
    alert(email);
  try {
  const response = await fetch("./check-email (1).php", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  // Check if the response is successful (status code 2xx)
  if (response.ok) {
    const data = await response.json();
    alert(data.message); // Display the PHP response in an alert
    // Rest of your code handling the response
  } else {
    const data = await response.json();
    alert(data.error); // Display the PHP error in an alert
    // Handle error display to the user
  }
} catch (error) {
  console.error("Error checking email:", error);
  alert("An error occurred while checking email."); // Display a generic error message
  // Handle error display to the user
}
  
  });

  }
});
