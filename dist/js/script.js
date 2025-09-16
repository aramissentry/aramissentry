document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".testimonial-slider");
    const slides = document.querySelectorAll(".box-text");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    let currentIndex = 0;
    let slidesPerView = window.innerWidth >= 768 ? 3 : 1;
    let startX = 0;
    let isSwiping = false;

    function updateSlider() {
        slider.style.transform = `translateX(-${(currentIndex / slidesPerView) * 100}%)`;
    }

    function updateSlidesPerView() {
        slidesPerView = window.innerWidth >= 768 ? 3 : 1;
        updateSlider();
    }

    // Button Controls
    nextBtn.addEventListener("click", () => {
        currentIndex = Math.min(currentIndex + slidesPerView, slides.length - slidesPerView);
        updateSlider();
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = Math.max(currentIndex - slidesPerView, 0);
        updateSlider();
    });

    // Touch Swiping
    slider.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
    });

    slider.addEventListener("touchmove", (e) => {
        if (!isSwiping) return;
        let diff = startX - e.touches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < slides.length - slidesPerView) currentIndex++;
            if (diff < 0 && currentIndex > 0) currentIndex--;
            updateSlider();
            isSwiping = false;
        }
    });

    slider.addEventListener("touchend", () => {
        isSwiping = false;
    });

    // Adjust on Resize
    window.addEventListener("resize", updateSlidesPerView);

    // Auto-slide every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + slidesPerView) % slides.length;
        updateSlider();
    }, 5000);

});


document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const userNav = document.querySelector(".user-nav");

    menuToggle.addEventListener("click", function () {
        userNav.classList.toggle("active");
    });

    // Close menu when clicking outside (optional)
    document.addEventListener("click", function (event) {
        if (!menuToggle.contains(event.target) && !userNav.contains(event.target)) {
            userNav.classList.remove("active");
        }
    });
});

document.querySelector('.form').addEventListener('submit', async (e) => {
    e.preventDefault();
    let email = document.querySelector('#email_address').value;
    let firstName = document.querySelector('#first_name').value;
    let lastName = document.querySelector('#last_name').value;
    let message = document.querySelector('#message').value;
    let phone = document.querySelector('#phone').value;

    let response = await fetch('http://localhost:3000/api/contact-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, first_name: firstName, last_name: lastName, message, phone: phone })
    });

    let data = await response.json();
    alert(data.message);
});

document.addEventListener("DOMContentLoaded", function () {
    const lazyImages = document.querySelectorAll("img.lazy-blur");

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const fullImage = img.dataset.src;

                img.src = fullImage; // Replace with high-quality image
                img.classList.add("fade-in"); // Remove blur effect
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});