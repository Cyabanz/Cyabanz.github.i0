// Function to display user profile
function displayUserProfile(user) {
    if (user) {
        const profilePicUrl = user.photoURL || "images/default-profile-pic.png"; // Fallback to default if no photoURL
        const welcomeMessage = "Welcome back, " + user.displayName + ".";

        // Set the profile picture and welcome message
        document.getElementById('user-pic-top-right').src = profilePicUrl;
        document.getElementById('user-pic-top-right').style.display = 'inline'; // Show the profile picture
        document.getElementById('user-name').textContent = welcomeMessage; // Display welcome message
        
        // Optionally, if you have a placeholder or input for the user address
        document.getElementById('uv-address').placeholder = "Enter your address here..."; // Set placeholder for address
    } else {
        // If user is not signed in, set default values
        document.getElementById('user-pic-top-right').src = "images/default-profile-pic.png"; // Default profile picture
        document.getElementById('user-pic-top-right').style.display = 'none'; // Hide the profile picture
        document.getElementById('user-name').textContent = "Guest"; // Default guest message
    }
}
