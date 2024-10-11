import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// Handle Upload Button Click
document.getElementById('upload-button').addEventListener('click', () => {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0]; // Get the selected file

    if (file) {
        const userId = auth.currentUser.uid; // Get the current user's ID
        const storageRef = ref(storage, `profilePictures/${userId}`); // Reference to the user's profile picture location

        uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a file!', snapshot);
            // Get the download URL after the upload
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                // Update the user's profile picture in your app
                displayUserInfo(auth.currentUser.displayName, downloadURL);
                // Save the URL to localStorage if needed
                localStorage.setItem('userPhoto', downloadURL);
            });
        }).catch((error) => {
            console.error('Upload failed:', error);
        });
    } else {
        console.log('No file selected.');
    }
});
