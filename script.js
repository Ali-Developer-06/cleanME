//* Toggle the navigation menu for mobile view

function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

//* Show the selected section and hide others
function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach((section) => section.classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');

//* Close the mobile menu after a selection
  const navLinks = document.querySelector('.nav-links');
  if (navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
  }
}



let currentIndex = 0;

//* Move to the previous slide
function prevSlide() {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-track img');
  const totalSlides = slides.length;
  currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
  updateCarousel();
}

//* Move to the next slide
function nextSlide() {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-track img');
  const totalSlides = slides.length;
  currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
  updateCarousel();
}

//* Update the carousel position
function updateCarousel() {
  const track = document.querySelector('.carousel-track');
  const slideWidth = track.querySelector('img').clientWidth;
  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}
window.addEventListener('resize', updateCarousel);
document.addEventListener('DOMContentLoaded', updateCarousel);



//* Get current Date and IP address of the user

document.addEventListener('DOMContentLoaded', () => {
  const dateField = document.getElementById('current-date');
  if (dateField) {
    dateField.value = new Date().toLocaleDateString();
  }

  const ipField = document.getElementById('ip-address');
  if (ipField) {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        ipField.value = data.ip;
      })
      .catch(() => {
        ipField.value = "Unable to fetch IP";
      });
  }
  showSection('application');
});