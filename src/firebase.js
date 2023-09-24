// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfF6houC_87lu3hARig-_T7g5B5uejk5g",
  authDomain: "gisadmin.firebaseapp.com",
  projectId: "gisadmin",
  storageBucket: "gisadmin.appspot.com",
  messagingSenderId: "304091624345",
  appId: "1:304091624345:web:7359d7721a47134be8d908",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);
