document.addEventListener("DOMContentLoaded", function() {
    fetch("/account/user")
      .then(response => response.json())
      .then(user => {
        if (user) {
          fetch(`/therapist/${user.user_id}`)
            .then(response => response.json())
            .then(therapist => {
              if (!therapist) {
                window.location.href = "/edit-profile.html";
              }
            })
            .catch(error => {
              console.error("Error fetching therapist:", error);
            });
        } else {
          window.location.href = "/login.html";
        }
      })
      .catch(error => {
        console.error("Error fetching user:", error);
      });
  });
  