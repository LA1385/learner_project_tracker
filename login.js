// Select
const form = document.querySelector("#login-form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const message = document.querySelector("#login-message");

// Listen
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Change
  if (email.value.trim() === "" || password.value.trim() === "") {
    message.textContent = "Please fill in both fields.";
    message.className = "message error";
  } else {
    location.href = "/learner/myactivity.html";
  }
});