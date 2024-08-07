// below we are defining the functions that we will be using in our project
// these functions import external libraries and modules(line 4 to 6)
// line 7 is for a local dependency that we created(.env)
const functions = require("firebase-functions")
const admin = require("firebase-admin")
const nodemailer = require("nodemailer")
require("dotenv").config();
// below in line 10 we are initializing the firebase app as admin, then in line 11 we are initializing the firestore database only and defining a function(db) that we will call later
// we are adding admin. to show that we are using firebase as an admin
admin.initializeApp();
const db = admin.firestore();

// below we are creating a function that will send an email(using gmail) to the user and calling it (transporter)
//auth property contains the email address and password of the user that will be used to authenticate with the Gmail service.
//Overall, this code sets up a transporter object that can be used to send emails using the Gmail service, with the specified email address and password for authentication.
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.user_email,
        pass: process.env.user_password
    }
});

//funtion to send email to users after booking
//The code imports the functions object from the Firebase Admin SDK(line 30), which provides a set of Cloud Functions for Firebase
//The onCreate method is called on the functions.firestore.document object, specifying the path to the collection where new documents are created
//Inside the onCreate callback function, the snapshot object represents the newly created document(line 33).line 34 - The code retrieves the tourData from the document using snapshot.data().
//The userEmail variable is assigned the value of the email field from the tourData
//The mailOptions object is created, specifying the sender (from), recipient (to), subject, and text of the email. The from address is obtained from the process.env.user_email environment variable(.env file)
exports.sendEmailToUsers = functions.firestore
    .document(userBookings/{docId})
    .onCreate(async () => {
        const tourData = snapshot.data()
        const userEmail = tourData.email()

        const mailOptions = {
            from: process.env.user_email,
            to: userEmail,
            subject: "Thank you for Booking on Visit Uganda",
            text: `Your booking has been confirmed.`
        }
        try {
            await transporter.sendMail(mailOptions)
            console.log("Sending email...")
        } catch (error) {
            console.log("Error sending email:", error);
        }
        //The transporter.sendMail method is called with the mailOptions object to send the email. The await keyword is used to wait for the email to be sent
        //If the email is sent successfully, a log message "Sending email..." is printed to the console
        //If there is an error sending the email, the error is logged to the console
    });
