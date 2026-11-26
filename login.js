export function login() {
  const form = document.querySelector("#login-form");

  if (!form) {
    return;
  }

  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const message = document.querySelector("#login-message");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (email.value.trim() === "" || password.value.trim() === "") {
      message.textContent = "Please fill in both fields.";
      message.className = "message error";
    } else {
      location.href = "instructor/review-queue.html";
    }
  });
}