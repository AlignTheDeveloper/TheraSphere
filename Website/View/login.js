// Hide status banners
const errorBanner = document.getElementById("invalid-form");
errorBanner.hidden = true;

const successBanner = document.getElementById("valid-form");
successBanner.hidden = true;

document.getElementById("submit").addEventListener("click", (event) => {
  event.preventDefault();
  const form = document.getElementById("login-form");
  const formData = new FormData(form);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  fetch("/account/login", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formObject),
  })
    .then((response) => {
      return response.json().then((json) => ({
        status: response.status,
        json,
      }));
    })
    // Logic to display errors and success on form
    .then(({ status, json }) => {
      const errorMessages = document.getElementsByClassName("text-danger");
      errorBanner.hidden = true;
      for (let htmlElement of errorMessages) {
        htmlElement.innerHTML = "&nbsp;";
      }
      if (status === 400) {
        errorBanner.innerText = "Form has errors. Please correct them and resubmit.";
        errorBanner.hidden = false;
        for (let error of json.errors) {
          const errorId = error.path + "-error";
          document.getElementById(errorId).innerHTML = error.msg;
        }
      } 
      else if (status === 404) {
        errorBanner.innerText = "User not found. Please try again.";
        errorBanner.hidden = false;
      } 
      else if (status === 401) {
        errorBanner.innerText = "Invalid password. Please try again.";
        errorBanner.hidden = false;
      }
      else if (status === 200) {
        alert("Login successful!");
        // localStorage.setItem("user", JSON.stringify(json.data));
        window.location.href = "/home.html";
      } 
      else {
        console.error("Error:", json);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});