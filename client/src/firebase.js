import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyB2g8I1mOHCozP3UurzilxQ40y2a23o8yM",
    authDomain: "web-dev-deploy-app.firebaseapp.com",
    projectId: "web-dev-deploy-app",
    storageBucket: "web-dev-deploy-app.appspot.com",
    messagingSenderId: "297098237433",
    appId: "1:297098237433:web:95d39f764f12822ef2d928",
    measurementId: "G-C7R4W5E0HY"
  };

const app = initializeApp(firebaseConfig);

//export const auth = app.auth()
export const auth = getAuth(app);
export default app
