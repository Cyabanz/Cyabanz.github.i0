const carouselInner = document.getElementById('carousel-inner');

// Load JSON data
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const lists = data.main.sections[1].lists;

        // Create carousel items from JSON data
        lists.forEach(list => {
            const ul = document.createElement('ul');
            ul.setAttribute('role', list.role);
            ul.className = list.class;

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
                ul.appendChild(li);
            });

            carouselInner.appendChild(ul); // Append the list to the existing carousel-inner
        });

        // Initialize the carousel position
        let currentIndex = 0;
        updateCarousel();

        // Swipe functionality
        let startX = 0;
        let endX = 0;

        carouselInner.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
        });

        carouselInner.addEventListener('touchmove', (event) => {
            endX = event.touches[0].clientX;
        });

        carouselInner.addEventListener('touchend', () => {
            const threshold = 50; // Minimum distance for swipe detection
            if (startX - endX > threshold) {
                // Swipe left
                currentIndex++;
                if (currentIndex >= lists.length) {
                    currentIndex = 0; // Loop back to first row
                }
                updateCarousel();
            } else if (endX - startX > threshold) {
                // Swipe right
                currentIndex--;
                if (currentIndex < 0) {
                    currentIndex = lists.length - 1; // Loop back to last row
                }
                updateCarousel();
            }
        });

        // Update carousel position
        function updateCarousel() {
            const offset = -currentIndex * 100; // Move to the current row
            carouselInner.style.transform = `translateX(${offset}%)`;
            carouselInner.style.transition = 'transform 0.3s ease'; // Add transition for smoothness
        }
    })
    .catch(error => console.error('Error fetching JSON:', error));
