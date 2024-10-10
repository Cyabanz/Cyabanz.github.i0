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

// Function to toggle login/logout buttons
function toggleButtons(isLoggedIn) {
    if (isLoggedIn) {
        document.getElementById('login').style.display = 'none'; // Hide login button
        document.getElementById('logout').style.display = 'inline'; // Show logout button
    } else {
        document.getElementById('login').style.display = 'inline'; // Show login button
        document.getElementById('logout').style.display = 'none'; // Hide logout button
    }
}

