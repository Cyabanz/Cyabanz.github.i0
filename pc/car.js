const carousel = document.getElementById('carousel');

// Load JSON data
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const lists = data.main.sections[1].lists;

        // Create carousel items from JSON data
        lists.forEach(list => {
            list.items.forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = item.link.href;
                a.target = "_blank"; // Open link in a new tab
                const img = document.createElement('img');
                img.src = item.link.img.src;
                img.alt = item.link.img.alt;

                a.appendChild(img);
                li.appendChild(a);
                carousel.appendChild(li); // Append each item directly to the carousel
            });
        });

        // Initialize the carousel position
        let currentIndex = 0;
        let isSwiping = false; // Track if currently swiping
        updateCarousel();

        // Swipe functionality
        let startX = 0;
        let endX = 0;

        carousel.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
            isSwiping = true; // Set swiping flag
        });

        carousel.addEventListener('touchmove', (event) => {
            if (isSwiping) {
                endX = event.touches[0].clientX;
                const offset = endX - startX; // Calculate the offset

                // Allow free scrolling
                carousel.style.transform = `translateX(${offset}px)`;
                carousel.style.transition = 'none'; // Disable transition during swipe
            }
        });

        carousel.addEventListener('touchend', () => {
            if (isSwiping) {
                const threshold = 80; // Increased threshold for swipe detection
                const distance = endX - startX; // Calculate total distance swiped
                if (distance < -threshold) {
                    // Swipe left
                    if (currentIndex < lists.length - 1) {
                        currentIndex++;
                    }
                } else if (distance > threshold) {
                    // Swipe right
                    if (currentIndex > 0) {
                        currentIndex--;
                    }
                }

                // Update carousel position after swipe
                updateCarousel();
                isSwiping = false; // Reset swiping flag
            }
        });

        // Update carousel position
        function updateCarousel() {
            const offset = -currentIndex * 100; // Move to the current row
            carousel.style.transform = `translateX(${offset}%)`;
            carousel.style.transition = 'transform 0.5s ease'; // Add transition for smoothness
        }
    })
    .catch(error => console.error('Error fetching JSON:', error));
