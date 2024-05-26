import {
  emailValidator,
  passwordValidator,
} from "../../validators/validators.js";
import { register } from "../../services/auth.js";

var email, password, confirmPassword, role, error;

function validateForm() {
  var valid = emailValidator(email.val());

  error.text("");

  if (valid !== "Valid") {
    error.text(valid);
    return false;
  }

  valid = passwordValidator(password.val());
  if (valid !== "Valid") {
    error.text(valid);
    return false;
  }

  if (password.val() !== confirmPassword.val()) {
    error.text("Passwords do not match!");
    return false;
  }

  return true;
}

function handleSubmit() {
  if (validateForm()) {
    register({
      email: email.val(),
      password: password.val(),
    })
      .done(function (data) {
        $.cookie("UserId", parseInt(data), { expires: 30, path: "/" });
        window.location.href =
          "http://127.0.0.1:5500/templates/main/dashboard.html";
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        error.text("There is already an account associated with this account!");
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
  confirmPassword = $("#confirmPassword");
  role = $("#role");
  error = $("#error");
});

window.handleSubmit = handleSubmit;
window.connectWithGithub = connectWithGithub;
