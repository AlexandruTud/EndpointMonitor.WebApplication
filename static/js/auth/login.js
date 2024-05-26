import { emailValidator } from "../../validators/validators.js";
import { login } from "../../services/auth.js";

var email, password, error;

function validateForm() {
  var valid = emailValidator(email.val());

  if (valid !== "Valid") {
    error.text(valid);
    return false;
  }

  return true;
}

function handleSubmit() {
  if (validateForm()) {
    login({
      email: email.val(),
      password: password.val(),
    })
      .done(function (data) {
        $.cookie("UserId", parseInt(data), { expire: 30, path: "/" });
        window.location.href =
          "http://127.0.0.1:5500/templates/main/dashboard.html";
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        error.text("Email and password do not match to an existing account!");
      });
  }
}

function connectWithGithub() {
  var clientId = "39c7fb795ce563b0d1bb";

  window.location.href =
    "https://github.com/login/oauth/authorize?client_id=" +
    clientId +
    "&redirect_uri=http://127.0.0.1:5500/templates/main/dashboard.html&scope=user";
}

$(document).ready(function () {
  var userId = $.cookie("UserId");

  if (userId !== undefined)
    window.location.href =
      "http://127.0.0.1:5500/templates/main/dashboard.html";

  email = $("#email");
  password = $("#password");
  error = $("#error");
});

window.handleSubmit = handleSubmit;
window.connectWithGithub = connectWithGithub;
