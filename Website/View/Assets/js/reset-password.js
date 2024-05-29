document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  document.getElementById('token').value = token;

  document.getElementById("reset-password-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    fetch("/account/reset-password", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formObject),
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById("message").innerText = data.message;
    })
    .then(({status, json}) =>
    {
      if (status === 200) {
        alert("Directing you back to the login page.");
        window.location.href = "/login.html";
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  });
});
