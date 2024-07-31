'use strict';

document.addEventListener("DOMContentLoaded", () => {
  const bookButtons = document.querySelectorAll(".btn-secondary"); // Use the correct class selector

  bookButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const card = event.target.closest(".card");
      const placeName = card.dataset.place;
      const placeDescription = card.dataset.description;

      openBookingPage(placeName, placeDescription);
    });
  });
});

function openBookingPage(placeName, placeDescription) {
  const bookingPage = document.createElement("div");
  bookingPage.classList.add("booking-page");
  bookingPage.innerHTML = `
    <h2>Book Your Stay at ${placeName}</h2>
    <p>${placeDescription}</p>
    <form class="booking-form">
      <label for="visitors">Number of Visitors:</label>
      <input type="number" id="visitors" name="visitors" min="1" required>
      <label for="days">Number of Stay Days:</label>
      <input type="number" id="days" name="days" min="1" required>
      <label for="meals">Full Board Meals:</label>
      <select id="meals" name="meals" required>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
      <label for="additional">Additional Requests:</label>
      <textarea id="additional" name="additional"></textarea>
      <button type="submit" class="intaSendPayButton">Confirm Booking</button>
    </form>
    <button class="btn back-btn">Back</button>
  `;

  document.body.innerHTML = "";
  document.body.appendChild(bookingPage);

  document.querySelector(".back-btn").addEventListener("click", () => {
    location.reload(); // Reload the page to go back to the main list
  });

  document.querySelector(".booking-form").addEventListener("submit", handleBookingFormSubmit);
}

function handleBookingFormSubmit(event) {
  event.preventDefault(); // Prevent the form from submitting

  // Retrieve form data
  const formData = new FormData(event.target);
  const visitors = formData.get("visitors");
  const days = formData.get("days");
  const meals = formData.get("meals");
  const additional = formData.get("additional");

  // Perform further actions with the form data
  // For example, you can send the data to a server using AJAX or fetch

  // Optionally, you can show a success or error message to the user
}

function handleBookingFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const bookingDetails = {
    visitors: formData.get("visitors"),
    days: formData.get("days"),
    meals: formData.get("meals"),
    additional: formData.get("additional"),
  };

  // Proceed to IntaSend Payment
  triggerIntaSendPayment(bookingDetails);
}

function triggerIntaSendPayment(bookingDetails) {
  const paymentButton = document.querySelector(".intaSendPayButton");

  if (!paymentButton) {
    console.error("IntaSend payment button not found");
    return;
  }

  // Initialize IntaSend
  const intasend = new window.IntaSend({
    publicAPIKey: "ISPubKey_test_ee5f4860-80fb-4670-a8ef-3258658af886",
    live: false, // set to true when going live
  });

  // Attach event listeners
  intasend.on("COMPLETE", (results) => {
    console.log("Payment successful", results);
    // Handle successful payment (e.g., save booking details to your database)
  });
  intasend.on("FAILED", (results) => {
    console.log("Payment failed", results);
    // Handle payment failure
  });
  intasend.on("IN-PROGRESS", (results) => {
    console.log("Payment in progress", results);
  });

  // Update the button attributes
  paymentButton.dataset.amount = 10; // Replace with actual amount based on bookingDetails
  paymentButton.dataset.currency = "KES";

  // Simulate button click
  paymentButton.click();
}


/// firebase lesson starts here...
function saveBookingDetailsToDatabase(bookingDetails) {
  const userId = "user123"; // Replace with actual user ID
  const dbRef = ref(database, "bookings/" + userId);
  set(dbRef, {
    ...bookingDetails,
  })
    .then(() => {
      console.log("Booking details saved successfully");
      //optionally, show show a success message to user
    })
    .catch((error) => {
      console.error("Error saving booking details:", error);
    });//optionally, show show an error message to user
}