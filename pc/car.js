document.addEventListener("DOMContentLoaded", function () {
    const carouselContainer = document.getElementById('carousel');
    
    fetch('path/to/your/data.json')  // Update with your JSON file path
        .then(response => response.json())
        .then(data => createCarousel(data.main.sections[1].lists))
        .catch(error => console.error('Error loading JSON:', error));

    function createCarousel(lists) {
        lists.forEach(list => {
            const listElement = document.createElement('div');
            listElement.classList.add('carousel-item');

            list.items.forEach(item => {
                const link = document.createElement('a');
                link.href = item.link.href;

                const img = document.createElement('img');
                img.src = item.link.img.src;
                img.alt = item.link.img.alt;

                link.appendChild(img);
                listElement.appendChild(link);
            });

            carouselContainer.appendChild(listElement);
        });

        initCarousel();
    }

    function initCarousel() {
        const items = document.querySelectorAll('.carousel-item');
        let currentIndex = 0;

        function showItem(index) {
            items.forEach((item, idx) => {
                item.style.display = (idx === index) ? 'block' : 'none';
            });
        }

        showItem(currentIndex);

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => {
            if (currentIndex < items.length - 1) {
                currentIndex++;
                showItem(currentIndex);
            }
        };

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => {
            if (currentIndex > 0) {
                currentIndex--;
                showItem(currentIndex);
            }
        };

        carouselContainer.appendChild(prevButton);
        carouselContainer.appendChild(nextButton);

        // Swipe detection for mobile
        let touchStartX = 0;

        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        carouselContainer.addEventListener('touchmove', (e) => {
            const touchEndX = e.touches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (diff > 50) {
                nextButton.click(); // Swipe left
            } else if (diff < -50) {
                prevButton.click(); // Swipe right
            }
        });
    }
});
