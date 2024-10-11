import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// Initialize Firebase Storage
const storage = getStorage(app);

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in:', user);

        // Handle Upload Button Click
        document.getElementById('upload-button').addEventListener('click', () => {
            const fileInput = document.getElementById('file-input');
            const file = fileInput.files[0]; // Get the selected file

            if (file) {
                const userId = user.uid; // Get the current user's ID
                const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`); // Reference to the user's profile picture location

                uploadBytes(storageRef, file).then((snapshot) => {
                    console.log('Uploaded a file!', snapshot);
                    // Get the download URL after the upload
                    getDownloadURL(snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        // Update the user's profile picture in your app
                        displayUserInfo(user.displayName, downloadURL);
                        localStorage.setItem('userPhoto', downloadURL);
                    });
                }).catch((error) => {
                    console.error('Error uploading file:', error);
                });
            } else {
                console.log('No file selected.');
            }
        });
    } else {
        console.log('No user is signed in.');
    }
});
