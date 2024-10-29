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


    // script.js
window.onload = function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    let particlesArray = [];
    const numberOfParticles = 1000; // Total number of particles
    const particleSize = 1; // Size of each particle
    const particleSpacing = 1.4; // Spacing between particles for higher density
    const mouseRadius = 70; // Radius of mouse interaction
    const mouse = {
      x: null,
      y: null,
      radius: mouseRadius
    };
  
    window.addEventListener('mousemove', function(event) {
      mouse.x = event.x;
      mouse.y = event.y;
    });
  
    class Particle {
      constructor(x, y) {
        this.x = Math.random() * canvas.width; // Random initial x position
        this.y = Math.random() * canvas.height; // Random initial y position
        this.size = particleSize;
        this.color = '#EB0029';
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = (forceDirectionX * force * this.density);
        let directionY = (forceDirectionY * force * this.density);
  
        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
      }
    }
  
    async function loadSVG(url) {
      const response = await fetch(url);
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "image/svg+xml");
      const paths = xmlDoc.getElementsByTagName("path");
      return Array.from(paths).map(path => path.getAttribute("d"));
    }
  
    function getParticlePositionsFromPathData(pathData) {
      const positions = [];
      const path = new Path2D(pathData);
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      let minX = canvasWidth, maxX = 0, minY = canvasHeight, maxY = 0
      for (let y = 0; y < canvasHeight; y += particleSpacing) { // Adjust spacing for higher density
        for (let x = 0; x < canvasWidth; x += particleSpacing) { // Adjust spacing for higher density
          if (ctx.isPointInPath(path, x, y)) {
            positions.push({ x, y });
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
  
      return { positions, minX, maxX, minY, maxY };
    }
  
    async function init() {
      particlesArray = [];
      const svgPaths = await loadSVG('https://assets.codepen.io/8292695/fitness-widget.svg'); 
      
      let allPositions = [];
      let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;
  

      svgPaths.forEach(pathData => {
        const { positions, minX: pathMinX, maxX: pathMaxX, minY: pathMinY, maxY: pathMaxY } = getParticlePositionsFromPathData(pathData);
        allPositions = allPositions.concat(positions);
        if (pathMinX < minX) minX = pathMinX;
        if (pathMaxX > maxX) maxX = pathMaxX;
        if (pathMinY < minY) minY = pathMinY;
        if (pathMaxY > maxY) maxY = pathMaxY;
      });
  
 
      const offsetX = (canvas.width - (maxX - minX)) / 2 - minX;
      const offsetY = (canvas.height - (maxY - minY)) / 2 - minY;
  
      // Adjust positions to center the SVG
      allPositions = allPositions.map(pos => ({ x: pos.x + offsetX, y: pos.y + offsetY }));
  
      allPositions.forEach(pos => {
        particlesArray.push(new Particle(pos.x, pos.y));
      });
    }
  
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
      }
      requestAnimationFrame(animate);
    }
  
    init();
    animate();
    window.addEventListener('resize', function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });
  };
  //The code does not belong to me.//
