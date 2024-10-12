// Function to load user information and save it to the database
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;

        const storedPhoto = localStorage.getItem('userPhoto') || user.photoURL;
        displayUserInfo(user.displayName, storedPhoto);

        if (!localStorage.getItem('userName')) {
            localStorage.setItem('userName', user.displayName);
        }

        // Save user info to database
        saveUserInfoToDatabase(user.uid, user.displayName, storedPhoto);
        
        // Load the bio from the database for the logged-in user
        loadBioFromDatabase(user.uid); // Load the bio when the user logs in
    } else {
        loadUserInfoFromLocalStorage();
        document.getElementById('user-bio').textContent = "No bio yet."; // Reset bio for guest users
    }
});

// Function to save user info to Realtime Database
async function saveUserInfoToDatabase(uid, username, photoURL) {
    const userRef = dbRef(database, `users/${uid}`);
    await set(userRef, { username: username, bio: "", photoURL: photoURL }); // Save username, bio, and photo URL
}
