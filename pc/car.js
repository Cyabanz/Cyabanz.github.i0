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

        // Duplicate the first and last items for wrap-around effect
        const firstItem = carousel.children[0].cloneNode(true);
        const lastItem = carousel.children[carousel.children.length - 1].cloneNode(true);
        carousel.appendChild(firstItem); // Append first item to the end
        carousel.insertBefore(lastItem, carousel.children[0]); // Insert last item at the beginning

        // Initialize the carousel position
        let currentIndex = 1; // Start at the first item after the duplicated last item
        let isSwiping = false; // Track if currently swiping
        updateCarousel();

        // Swipe functionality
        let startX = 0;
        let endX = 0;

        carousel.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
            isSwiping = true; // Set swiping flag
            carousel.style.transition = 'none'; // Disable transition during swipe
        });

        carousel.addEventListener('touchmove', (event) => {
            if (isSwiping) {
                endX = event.touches[0].clientX;
                const offset = endX - startX; // Calculate the offset

                // Allow free scrolling
                carousel.style.transform = `translateX(${offset}px)`;
            }
        });

        carousel.addEventListener('touchend', () => {
            if (isSwiping) {
                const threshold = 80; // Increased threshold for swipe detection
                const distance = endX - startX; // Calculate total distance swiped

                // Check bounds and wrap-around
                if (distance < -threshold) {
                    currentIndex++; // Swipe left
                } else if (distance > threshold) {
                    currentIndex--; // Swipe right
                }

                // Wrap-around logic
                if (currentIndex === 0) {
                    currentIndex = lists.length; // Go to the last original item
                } else if (currentIndex === lists.length + 1) {
                    currentIndex = 1; // Go to the first original item
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
