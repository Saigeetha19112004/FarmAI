document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.image-carousel');
    const items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    function slideImages() {
        currentIndex = (currentIndex + 1) % items.length;
        carousel.style.transform = `rotate(${currentIndex * -360 / items.length}deg)`;
        
        items.forEach((item, index) => {
            item.style.transform = `rotate(${index * 360 / items.length}deg)`;
            item.style.opacity = index === currentIndex ? '1' : '0';
        });
    }

    // Start the rotation
    setInterval(slideImages, 3000);
});