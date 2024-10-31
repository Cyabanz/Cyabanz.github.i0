const carouselInner = document.getElementById('carousel-inner');

// Load JSON data
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const lists = data.main.sections[1].lists;

        // Create carousel items from JSON data
        lists.forEach(list => {
            const li = document.createElement('li');
            li.className = 'carousel-list'; // Set class for styling if needed
            const ul = document.createElement('ul');
            ul.setAttribute('role', list.role);
            ul.className = list.class;

            list.items.forEach(item => {
                const itemLi = document.createElement('li');
                const a = document.createElement('a');
                a.href = item.link.href;
                a.target = "_blank"; // Open link in a new tab
                const img = document.createElement('img');
                img.src = item.link.img.src;
                img.alt = item.link.img.alt;

                a.appendChild(img);
                itemLi.appendChild(a);
                ul.appendChild(itemLi);
            });

            li.appendChild(ul);
            carouselInner.appendChild(li); // Append each row to the carousel
        });

        // Initialize the carousel position
        let currentIndex = 0;
        updateCarousel();

        // Touch event handling for swipe
        let startX = 0;
        let endX = 0;

        carouselInner.addEventListener('pointerdown', (event) => {
            startX = event.clientX || event.touches[0].clientX; // Support both desktop and mobile
            carouselInner.style.transition = 'none'; // Disable transition for swipe
            event.preventDefault(); // Prevent default scrolling behavior
        });

        carouselInner.addEventListener('pointermove', (event) => {
            endX = event.clientX || event.touches[0].clientX;
        });

        carouselInner.addEventListener('pointerup', () => {
            const threshold = 80; // Increased threshold for swipe detection
            if (startX - endX > threshold && currentIndex < lists.length - 1) {
                // Swipe left and not at the last row
                currentIndex++;
                updateCarousel();
            } else if (endX - startX > threshold && currentIndex > 0) {
                // Swipe right and not at the first row
                currentIndex--;
                updateCarousel();
            }
            // Add transition back after swipe logic
            carouselInner.style.transition = 'transform 0.5s ease'; // Longer transition for smoothness
        });

        // Update carousel position
        function updateCarousel() {
            const offset = -currentIndex * 100; // Move to the current row
            carouselInner.style.transform = `translateX(${offset}%)`;
        }
    })
    .catch(error => console.error('Error fetching JSON:', error));
