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
    .catch(error => {
      console.error("Error:", error);
    });
  });