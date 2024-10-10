// Function to display user info
function displayUserInfo(name, photoURL) {
    document.getElementById('user-name').textContent = name;
    document.getElementById('user-pic-top-right').src = photoURL;
    document.getElementById('user-pic-center').src = photoURL;
    document.getElementById('login').style.display = 'none';
    document.getElementById('logout').style.display = 'inline';
}
