// script.js

// Create swipe container and wrapper dynamically
const swipeContainer = document.createElement('div');
swipeContainer.id = 'swipe-container';
document.body.appendChild(swipeContainer);

const swipeWrapper = document.createElement('div');
swipeWrapper.id = 'swipe-wrapper';
swipeContainer.appendChild(swipeWrapper);

let currentIndex = 0;
let sections = [];

// Fetch JSON data from data.json
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        sections = data.main.sections;
        renderSections();
    })
    .catch(error => console.error('Error fetching JSON:', error));

// Function to render sections into the DOM
function renderSections() {
    sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';

        if (section.class) {
            sectionDiv.classList.add(section.class);
        }

        if (section.content) {
            sectionDiv.innerHTML = `<p>${section.content}</p>`;
        }

        if (section.lists) {
            section.lists.forEach(list => {
                const listDiv = document.createElement('div');
                listDiv.className = list.class;
                list.items.forEach(item => {
                    const link = document.createElement('a');
                    link.href = item.link.href;
                    const img = document.createElement('img');
                    img.src = item.link.img.src;
                    img.alt = item.link.img.alt;
                    link.appendChild(img);
                    listDiv.appendChild(link);
                });
                sectionDiv.appendChild(listDiv);
            });
        }

        swipeWrapper.appendChild(sectionDiv);
    });
    updateSwipePosition();
}

// Update swipe position based on current index
function updateSwipePosition() {
    const offset = -currentIndex * 100; // Move left based on index
    swipeWrapper.style.transform = `translateX(${offset}%)`;
}

// Function to handle swipe gestures
function handleSwipe(direction) {
    if (direction === 'left' && currentIndex < sections.length - 1) {
        currentIndex++;
    } else if (direction === 'right' && currentIndex > 0) {
        currentIndex--;
    }
    updateSwipePosition();
}

// Add swipe listeners
let touchStartX = 0;
let touchEndX = 0;

swipeWrapper.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0].clientX;
});

swipeWrapper.addEventListener('touchend', event => {
    touchEndX = event.changedTouches[0].clientX;
    handleSwipe(touchEndX < touchStartX ? 'left' : 'right');
});
