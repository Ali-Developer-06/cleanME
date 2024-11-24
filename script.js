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
    e.preventDefault(); // Prevent default anchor scroll behavior
    const sectionId = this.getAttribute('href').substring(1);
    showSection(sectionId);

    // Ensure scroll stays at top
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    // Remove 'active' class from all links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Add 'active' class to the clicked link
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
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    inputs.forEach((input) => {
        if (input.type === 'radio') {
            const isChecked = form.querySelector(`input[name="${input.name}"]:checked`);
            if (!isChecked) {
                isValid = false;
                input.parentElement.style.color = 'red';
            } else {
                input.parentElement.style.color = '';
            }
        } else if (!input.value.trim()) {
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
    //* Collect form data after validation
    const formData = {
        name: document.getElementById('name').value,
        street: document.getElementById('street').value,
        plz: document.getElementById('plz').value,
        city: document.getElementById('city').value,
        country: "Germany", // Assuming country is fixed
        phone: document.getElementById('phone').value,
        website: document.getElementById('website').value,
        email: document.getElementById('email').value,
        contact: document.getElementById('contact').value,
        currentDate: document.getElementById('current-date').value,
        ipAddress: document.getElementById('ip-address').value
    };
    //* Create PDF using jsPDF
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(`Firmenname: ${formData.name}`, 10, 10);
        doc.text(`Straße: ${formData.street}`, 10, 20);
        doc.text(`PLZ: ${formData.plz}`, 10, 30);
        doc.text(`Stadt: ${formData.city}`, 10, 40);
        doc.text(`Land: ${formData.country}`, 10, 50);
        doc.text(`Telefon: ${formData.phone}`, 10, 60);
        doc.text(`www: ${formData.website}`, 10, 70);
        doc.text(`Mail-Adresse: ${formData.email}`, 10, 80);
        doc.text(`Geschäftsführung/Kontakt: ${formData.contact}`, 10, 90);
        doc.text(`Date: ${formData.currentDate}`, 10, 100);
        doc.text(`IP Address: ${formData.ipAddress}`, 10, 110);
        doc.save('form-data.pdf');
        console.log('PDF generated and downloaded.');
    } catch (error) {
        alert('PDF generation failed. Check the console.');
        console.error(error);
        return;
    }
    //* Prepare mailto link
    const mailtoLink = `mailto:wbsoft@web.de?subject=Form Data&body=Firmenname: ${encodeURIComponent(formData.name)}%0D%0AStreet: ${encodeURIComponent(formData.street)}%0D%0APLZ: ${encodeURIComponent(formData.plz)}%0D%0AStadt: ${encodeURIComponent(formData.city)}%0D%0ALand: ${encodeURIComponent(formData.country)}%0D%0ATelefon: ${encodeURIComponent(formData.phone)}%0D%0Awww: ${encodeURIComponent(formData.website)}%0D%0AMail-Adresse: ${encodeURIComponent(formData.email)}%0D%0AGeschäftsführung/Kontakt: ${encodeURIComponent(formData.contact)}%0D%0ADate: ${encodeURIComponent(formData.currentDate)}%0D%0AIP Address: ${encodeURIComponent(formData.ipAddress)}`;
    console.log('Redirecting to Gmail with mailto link:', mailtoLink);
    setTimeout(() => {
        window.location.href = mailtoLink;
    }, 1000);
});