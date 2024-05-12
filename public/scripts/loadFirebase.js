import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

const loadFirebase = async () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCAhXvXpR7WWR_C0Ywtq5cKxytM8DjE3n0",
    authDomain: "webavanzado-pwa.firebaseapp.com",
    projectId: "webavanzado-pwa",
    storageBucket: "webavanzado-pwa.appspot.com",
    messagingSenderId: "119130868975",
    appId: "1:119130868975:web:3699ffb5a77aee660cdf1a",
    measurementId: "G-8T2YE5F8CJ"
  };

  // Initialize Firebase
  initializeApp(firebaseConfig);
}

export { loadFirebase };