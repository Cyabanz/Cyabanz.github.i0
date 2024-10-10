// After successful login
.then((result) => {
    const user = result.user;
    displayUserInfo(user.displayName, user.photoURL);
    
    // Save user info to localStorage
    localStorage.setItem('userName', user.displayName);
    localStorage.setItem('userPhoto', user.photoURL);
})
