<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
    import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

    const firebaseConfig = {
        apiKey: "AIzaSyDQcJNa_j_PC3-K5er4ms0WvVXQS_CEcuE",
        authDomain: "algebras4-44f23.firebaseapp.com",
        projectId: "algebras4-44f23",
        storageBucket: "algebras4-44f23.appspot.com",
        messagingSenderId: "512062724744",
        appId: "1:512062724744:web:653e3c7a504fb7255fdd3d",
        measurementId: "G-4R378XMPSW"
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    // Check authentication state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            displayUserInfo(user.displayName, user.photoURL);
            toggleButtons(true); // Show logout button
        } else {
            // User is signed out
            displayUserInfo("Guest", "https://example.com/default-profile-pic.png"); // Default picture
            toggleButtons(false); // Show login button
        }
    });

    // Handle login
    document.getElementById('login').addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            displayUserInfo(user.displayName, user.photoURL);
            toggleButtons(true); // Show logout button
        } catch (error) {
            console.error('Error during sign-in:', error);
        }
    });

    // Handle logout
    document.getElementById('logout').addEventListener('click', async () => {
        try {
            await signOut(auth);
            displayUserInfo("Guest", "https://example.com/default-profile-pic.png"); // Default picture
            toggleButtons(false); // Show login button
        } catch (error) {
            console.error('Error during sign-out:', error);
        }
    });

    // Function to display user info
    function displayUserInfo(name, photoURL) {
        document.getElementById('user-name').textContent = name;
        document.getElementById('user-pic-top-right').src = photoURL; // Top-right profile picture
        document.getElementById('user-pic-center').src = photoURL; // Center Google profile picture
    }

    // Function to toggle login/logout buttons
    function toggleButtons(isLoggedIn) {
        document.getElementById('login').style.display = isLoggedIn ? 'none' : 'inline'; // Show login button when logged out
        document.getElementById('logout').style.display = isLoggedIn ? 'inline' : 'none'; // Show logout button when logged in
    }
</script>
