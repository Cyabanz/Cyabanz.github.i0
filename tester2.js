// firebaseAuth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDQcJNa_j_PC3-K5er4ms0WvVXQS_CEcuE",
    authDomain: "algebras4-44f23.firebaseapp.com",
    projectId: "algebras4-44f23",
    storageBucket: "algebras4-44f23.appspot.com",
    messagingSenderId: "512062724744",
    appId: "1:512062724744:web:653e3c7a504fb7255fdd3d",
    measurementId: "G-4R378XMPSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const defaultPFP = "images/IMG_0164.jpeg"; // Replace with your default profile picture URL

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        displayUserInfo(user.displayName, user.photoURL || defaultPFP, true);
    } else {
        displayUserInfo("Guest", defaultPFP, false);
    }
});

// Handle login
document.getElementById('login').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            displayUserInfo(user.displayName, user.photoURL || defaultPFP, true);
        })
        .catch((error) => {
            console.error('Error during sign-in:', error);
        });
});

// Handle logout
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        displayUserInfo("Guest", defaultPFP, false);
    }).catch((error) => {
        console.error('Error during sign-out:', error);
    });
});

// Function to display user info
function displayUserInfo(name, photoURL, isLoggedIn) {
    document.getElementById('user-name').textContent = name;

    // Set the top-right profile picture
    const profilePicElement = document.getElementById('user-pic-top-right');
    profilePicElement.src = photoURL;

    // Toggle display based on login state
    profilePicElement.style.display = isLoggedIn ? 'inline' : 'none';

    // Toggle login/logout buttons
    document.getElementById('login').style.display = isLoggedIn ? 'none' : 'inline';
    document.getElementById('logout').style.display = isLoggedIn ? 'inline' : 'none';
}
