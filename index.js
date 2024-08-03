import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js"; 


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJLPA-dhN-0rNLEwFTfwRqAhAe6ErpWaU",
  authDomain: "visitugandawb1.firebaseapp.com",
  projectId: "visitugandawb1",
  storageBucket: "visitugandawb1.appspot.com",
  messagingSenderId: "915855219518",
  appId: "1:915855219518:web:c193799bf9219da7442a6f",
  measurementId: "G-CF7YY1VW8K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Function to save booking details to the database
export function saveBookingDetailsToDatabase(bookingDetails) {
  const bookingsRef = ref(database);
  push(bookingsRef, bookingDetails);
}

document.addEventListener("DOMContentLoaded", () => {
  const bookButtons = document.querySelectorAll(".btn-secondary");

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
  fetch("./index.html")
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bookingPage = doc.querySelector(".booking-page");
      document.body.innerHTML = "";
      document.body.appendChild(bookingPage);

      document.querySelector(".back-btn").addEventListener("click", () => {
        location.reload();
      });

      document.querySelector(".booking-form").addEventListener("submit", handleBookingFormSubmit);
    })
    .catch(error => {
      console.error("Error loading HTML file:", error);
    });
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

  triggerIntaSendPayment(bookingDetails);
  saveBookingDetailsToDatabase(bookingDetails);
}

function triggerIntaSendPayment(bookingDetails) {
  const paymentButton = document.querySelector(".intaSendPayButton");

  if (!paymentButton) {
    console.error("IntaSend payment button not found");
    return;
  }

  const intasend = new window.IntaSend({
    publicAPIKey: "ISPubKey_test_ee5f4860-80fb-4670-a8ef-3258658af886",
    live: false,
  });

  intasend.on("COMPLETE", (results) => {
    console.log("Payment successful", results);
    saveBookingDetailsToDatabase(bookingDetails);
  });
  intasend.on("FAILED", (results) => {
    console.log("Payment failed", results);
  });
  intasend.on("IN-PROGRESS", (results) => {
    console.log("Payment in progress", results);
  });

  paymentButton.dataset.amount = 10;
  paymentButton.dataset.currency = "KES";

  paymentButton.click();
}

// function saveBookingDetailsToDatabase(bookingDetails)