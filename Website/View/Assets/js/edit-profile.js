document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("therapist-form").addEventListener("submit", function(event) {
      event.preventDefault();

      const formData = new FormData(event.target);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      fetch("/therapist", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        document.getElementById("message").innerText = data.message;
        if (data.success) {
          window.location.href = "/home.html";
        }
      })
      .catch(error => {
        console.error("Error submitting form:", error);
      });
    });
  });