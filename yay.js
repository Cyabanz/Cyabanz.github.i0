// Function to generate shareable link
function generateShareableLink(uid) {
    const link = `${window.location.origin}/profile.html?uid=${uid}`; // Construct link with UID
    document.getElementById('shareable-link').textContent = link; // Display link
    document.getElementById('shareable-link').setAttribute('href', link); // Set link as href
}
// Function to save user data to the Realtime Database
async function saveUserData(uid, username, bio, photoURL) {
    const userRef = dbRef(database, `users/${uid}`);
    await set(userRef, { username, bio, photoURL });
}

// Call this function after the user logs in or updates their profile
saveUserData(currentUser.uid, currentUser.displayName, userBio, downloadURL);
