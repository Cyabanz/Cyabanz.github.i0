// Function to display user info
function displayUserInfo(name, photoURL, isLoggedIn) {
    document.getElementById('user-name').textContent = name;
    document.getElementById('user-pic-top-right').src = photoURL; // Top-right profile picture
    document.getElementById('user-pic-center').src = photoURL; // Center Google profile picture

    if (isLoggedIn) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').style.display = 'inline';
    } else {
        document.getElementById('login').style.display = 'inline';
        document.getElementById('logout').style.display = 'none';
    }
}

// Initial setup to ensure buttons are in the correct state
document.addEventListener('DOMContentLoaded', () => {
    displayUserInfo("Guest", "https://example.com/default-profile-pic.png", false); // Default state
});

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        displayUserInfo(user.displayName, user.photoURL, true);
    } else {
        // User is signed out
        displayUserInfo("Guest", "https://example.com/default-profile-pic.png", false); // Default picture
    }
});
