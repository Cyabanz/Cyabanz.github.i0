// Upload profile picture function
document.getElementById('uploadBtn').addEventListener('click', async () => {
    const file = document.getElementById('fileInput').files[0];

    if (!file) {
        alert("Please select a file first.");
        return;
    }

    // Ensure the user is authenticated
    if (!currentUser) {
        alert("You must be logged in to upload a profile picture.");
        return;
    }

    // Use user ID for file path to prevent overwriting
    const storageRef = ref(storage, `profilePictures/${currentUser.uid}.jpeg`);

    try {
        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, file);
        console.log("File uploaded successfully!");

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        console.log("File available at:", downloadURL);

        // Add a cache-busting query parameter
        const downloadURLWithCacheBuster = downloadURL + `?t=${new Date().getTime()}`;

        // Display the uploaded profile picture
        displayUserInfo(currentUser.displayName, downloadURLWithCacheBuster); // Update the user picture

        // Save the uploaded profile picture URL to local storage
        localStorage.setItem('userPhoto', downloadURLWithCacheBuster);
        console.log("Profile picture URL saved in local storage:", downloadURLWithCacheBuster);
    } catch (error) {
        console.error("Error uploading file:", error);
    }
});
