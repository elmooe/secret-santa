import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9o-WWf4X_Q5OtDZLjAQc40tJ9jf00JOw",
  authDomain: "secret-santa-317fd.firebaseapp.com",
  projectId: "secret-santa-317fd",
  storageBucket: "secret-santa-317fd.appspot.com",
  messagingSenderId: "252135795626",
  appId: "1:252135795626:web:814349d2f3be50590219d3",
  databaseURL: "https://secret-santa-317fd-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };