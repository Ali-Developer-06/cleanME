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
  const navLinks = document.querySelector('.nav-links');
  if (navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
  }
  window.scrollTo(0, 0);
  window.location.hash = sectionId;
}

//* Handle the back and forward buttons using hashchange event

window.addEventListener('hashchange', function() {
  const sectionId = window.location.hash.replace('#', '');
  if (sectionId) {
    showSection(sectionId);
  }
});

//* Prevent default scrolling behavior for anchor links (allow only manual scroll)
window.addEventListener('load', function() {
  window.scrollTo(0, 0);
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const sectionId = this.getAttribute('href').substring(1);
    showSection(sectionId);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    this.classList.add('active');
  });
});


//* Carousel functionality
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

//* Ensure the carousel adapts correctly on window resize
window.addEventListener('resize', updateCarousel);

//* Initialize the default section on page load
document.addEventListener('DOMContentLoaded', () => {

//* Get current Date and IP address of the user

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
  showSection('default-section');
});

  //* create PDF then diverted to Gmail

  document.getElementById('submitBtn').addEventListener('click', function () {
    const form = document.getElementById('order-form');
    const formData = new FormData(form);
    let isValid = true;
    form.querySelectorAll('input[required], textarea[required]').forEach((input) => {
        if (!input.value.trim() && !input.checked && input.type !== 'radio') {
            isValid = false;
            input.style.border = '2px solid red';
        } else {
            input.style.border = '';
        }
    });
    if (!isValid) {
        alert('Bitte alle erforderlichen Felder ausfüllen!');
        return;
    }
    const appVersion = form.querySelector('input[name="app_version"]:checked')?.value || 'Not Selected';
    const paymentMethod = form.querySelector('input[name="payment_method"]:checked')?.value || 'Not Selected';
    const pdfContent = `
        <h3>Order Summary:</h3>
        <p><strong>Firmenname:</strong> ${formData.get('name')}</p>
        <p><strong>Geschäftsführung/Kontakt:</strong> ${formData.get('contact')}</p>
        <p><strong>PLZ:</strong> ${formData.get('plz')}</p>
        <p><strong>Stadt:</strong> ${formData.get('city')}</p>
        <p><strong>Straße:</strong> ${formData.get('street')}</p>
        <p><strong>Telefon:</strong> ${formData.get('phone')}</p>
        <p><strong>Website:</strong> ${formData.get('website')}</p>
        <p><strong>Mail-Adresse:</strong> ${formData.get('email')}</p>
        <p><strong>Datum:</strong> ${formData.get('current_date')}</p>
        <p><strong>IP Address:</strong> ${formData.get('ip_address')}</p>
        <p><strong>Selected App Version:</strong> ${appVersion}</p>
        <p><strong>Selected Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Agreement:</strong> ${formData.get('agreement') ? 'Yes' : 'No'}</p>
    `;
    const element = document.createElement('div');
    element.innerHTML = pdfContent;
    html2pdf()
        .from(element)
        .save('order-summary.pdf')
        .catch((error) => {
            console.error('PDF generation failed:', error);
            alert('PDF generation failed. Please try again.');
        });
    document.body.removeChild(element);
});