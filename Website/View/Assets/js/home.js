document.addEventListener("DOMContentLoaded", function() {
  fetch("/account/user")
    .then(response => {
      if (!response.ok) {
        throw new Error("Not authenticated");
      }
      return response.json();
    })
    .then(user => {
      if (user) {
        document.getElementById("username").textContent = user.user_name;
        fetch(`/therapist/${user.user_id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error("Therapist not found");
            }
            return response.json();
          })
          .then(therapist => {
            if (!therapist) {
              document.getElementById("therapist_not_verified").style.display = "block";
              document.getElementById("home_screen").style.display = "none";
            } else {
              document.getElementById("therapist_not_verified").style.display = "none";
              document.getElementById("home_screen").style.display = "block";
            }
          })
          .catch(error => {
            console.error("Error fetching therapist:", error);
            document.getElementById("therapist_not_verified").style.display = "block";
            document.getElementById("home_screen").style.display = "none";
          });
      }
    })
    .catch(error => {
      console.error("Error fetching user:", error);
      document.getElementById("therapist_not_verified").style.display = "none";
      document.getElementById("home_screen").style.display = "none";
    });
});
