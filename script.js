// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Custom cursor
  const cursor = document.querySelector(".cursor")
  const cursorFollower = document.querySelector(".cursor-follower")

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px"
    cursor.style.top = e.clientY + "px"

    setTimeout(() => {
      cursorFollower.style.left = e.clientX + "px"
      cursorFollower.style.top = e.clientY + "px"
    }, 100)
  })

  document.addEventListener("mousedown", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(0.5)"
    cursorFollower.style.transform = "translate(-50%, -50%) scale(1.5)"
  })

  document.addEventListener("mouseup", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)"
    cursorFollower.style.transform = "translate(-50%, -50%) scale(1)"
  })

  // Links and buttons hover effect
  const links = document.querySelectorAll("a, button, .project-card, .service-card, .social-card, .skill-item")

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1.5)"
      cursorFollower.style.transform = "translate(-50%, -50%) scale(2)"
      cursorFollower.style.border = "1px solid var(--primary-color)"
    })

    link.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)"
      cursorFollower.style.transform = "translate(-50%, -50%) scale(1)"
      cursorFollower.style.border = "2px solid var(--primary-color)"
    })
  })

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger")
  const nav = document.querySelector("nav")

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    nav.classList.toggle("active")
  })

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      nav.classList.remove("active")
    })
  })

  // Active nav link on scroll
  const sections = document.querySelectorAll(".section")

  window.addEventListener("scroll", () => {
    let current = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight

      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active")
      }
    })
  })

  // Header scroll effect
  const header = document.querySelector("header")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Typing animation
  const typingText = document.querySelector(".typing-text")
  const texts = [
    "I build exceptional digital experiences.",
    "I create innovative web solutions.",
    "I develop scalable applications.",
    "I solve complex problems with code.",
  ]

  let textIndex = 0
  let charIndex = 0
  let isDeleting = false

  function typeText() {
    const currentText = texts[textIndex]

    if (isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex - 1)
      charIndex--
    } else {
      typingText.textContent = currentText.substring(0, charIndex + 1)
      charIndex++
    }

    let typeSpeed = isDeleting ? 50 : 100

    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      textIndex = (textIndex + 1) % texts.length
      typeSpeed = 500
    }

    setTimeout(typeText, typeSpeed)
  }

  typeText()

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"

        // Animate skill progress bars
        if (entry.target.classList.contains("skill-item")) {
          const progressBar = entry.target.querySelector(".progress")
          const width = progressBar.style.width
          progressBar.style.width = "0"
          setTimeout(() => {
            progressBar.style.width = width
          }, 500)
        }
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".skill-item, .project-card, .service-card, .social-card, .contact-item",
  )

  animateElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(50px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  // Basic validation
  if (!name || !email || !subject || !message) {
    showFormStatus("Please fill in all fields.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showFormStatus("Please enter a valid email address.", "error");
    return;
  }

  const submitBtn = contactForm.querySelector(".submit-btn");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      showFormStatus("Thank you! Your message has been sent successfully.", "success");
      contactForm.reset();
    } else {
      showFormStatus(result.message || "Something went wrong!", "error");
    }
  } catch (error) {
    showFormStatus("Network error. Please try again later.", "error");
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

function showFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
  formStatus.style.display = "block";

  setTimeout(() => {
    formStatus.style.display = "none";
  }, 5000);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


  // Parallax effect for floating shapes
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const shapes = document.querySelectorAll(".shape")

    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.5
      shape.style.transform = `translateY(${scrolled * speed}px)`
    })
  })

  // Add loading animation
  window.addEventListener("load", () => {
    document.body.classList.add("loaded")

    // Animate elements on load
    const homeText = document.querySelector(".home-text")
    const homeImage = document.querySelector(".home-image")

    if (homeText) {
      homeText.style.opacity = "0"
      homeText.style.transform = "translateX(-50px)"
      homeText.style.transition = "opacity 1s ease, transform 1s ease"

      setTimeout(() => {
        homeText.style.opacity = "1"
        homeText.style.transform = "translateX(0)"
      }, 500)
    }

    if (homeImage) {
      homeImage.style.opacity = "0"
      homeImage.style.transform = "translateX(50px)"
      homeImage.style.transition = "opacity 1s ease, transform 1s ease"

      setTimeout(() => {
        homeImage.style.opacity = "1"
        homeImage.style.transform = "translateX(0)"
      }, 700)
    }
  })

  // Add scroll-triggered animations for section titles
  const sectionTitles = document.querySelectorAll(".section-title")

  sectionTitles.forEach((title) => {
    title.style.opacity = "0"
    title.style.transform = "translateY(30px)"
    title.style.transition = "opacity 0.8s ease, transform 0.8s ease"

    observer.observe(title)
  })

  // Add stagger animation for grid items
  const gridContainers = document.querySelectorAll(".skills-grid, .projects-grid, .services-grid, .socials-grid")

  gridContainers.forEach((container) => {
    const items = container.children

    Array.from(items).forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`
    })
  })

  // Add particle effect on hover for project cards
  const projectCards = document.querySelectorAll(".project-card")

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      createParticles(this)
    })
  })

  function createParticles(element) {
    for (let i = 0; i < 5; i++) {
      const particle = document.createElement("div")
      particle.style.position = "absolute"
      particle.style.width = "4px"
      particle.style.height = "4px"
      particle.style.background = "var(--primary-color)"
      particle.style.borderRadius = "50%"
      particle.style.pointerEvents = "none"
      particle.style.zIndex = "1000"

      const rect = element.getBoundingClientRect()
      particle.style.left = rect.left + Math.random() * rect.width + "px"
      particle.style.top = rect.top + Math.random() * rect.height + "px"

      document.body.appendChild(particle)

      // Animate particle
      particle.animate(
        [
          { transform: "translateY(0) scale(1)", opacity: 1 },
          { transform: "translateY(-50px) scale(0)", opacity: 0 },
        ],
        {
          duration: 1000,
          easing: "ease-out",
        },
      ).onfinish = () => {
        particle.remove()
      }
    }
  }
})
