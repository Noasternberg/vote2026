/**
 * "הקול שלי" - Voting Landing Page
 * JavaScript Logic: Quiz and Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
    /* 
       0. לוגיקה להופעת אלמנטים בגלילה (Reveal on Scroll):
       משתמש ב-Intersection Observer כדי לזהות מתי אלמנט נכנס למסך ולהוסיף לו מחלקת 'active' שתפעיל את האנימציה.
    */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15 // האלמנט יתגלה כשהוא נראה ב-15% מהגובה שלו
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* 
       0.1 החלפת מצב כהה/בהיר (Dark Mode):
       שומר את העדפת המשתמש ב-localStorage כדי שהיא תישמר גם לאחר רענון הדף.
    */
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }

    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }    
    }

    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', switchTheme, false);
    }

    /* 
       0.2 טיימר ספירה לאחור לבחירות:
       מחשב את הזמן שנותר עד לתאריך היעד ומעדכן את התצוגה בכל שנייה.
    */
    const countdownDate = new Date("2026-11-01T00:00:00").getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            if (document.getElementById("days")) {
                document.querySelector(".countdown-container").innerHTML = "<div class='h4 text-primary fw-bold'>יום הבחירות הגיע!</div>";
            }
            return true; // Stop the timer
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        if (document.getElementById("days")) {
            document.getElementById("days").innerHTML = String(days).padStart(2, '0');
            document.getElementById("hours").innerHTML = String(hours).padStart(2, '0');
            document.getElementById("minutes").innerHTML = String(minutes).padStart(2, '0');
        }
        return false;
    }

    // Run once immediately
    const shouldStop = updateTimer();
    
    if (!shouldStop) {
        const timer = setInterval(function() {
            if (updateTimer()) {
                clearInterval(timer);
            }
        }, 1000);
    }


    // 0.3 Back to Top Button
    const backToTopBtn = document.getElementById("backToTop");

    window.onscroll = function() {
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            backToTopBtn.style.display = "flex";
        } else {
            backToTopBtn.style.display = "none";
        }
    };

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 1. Voting Readiness Quiz Logic
    const quizForm = document.getElementById('quiz-form');
    const quizResult = document.getElementById('quiz-result');
    const progressBar = document.getElementById('quiz-progress-bar');
    const checkButton = document.getElementById('check-readiness');

    if (checkButton) {
        checkButton.addEventListener('click', () => {
            let score = 0;
            const totalQuestions = 5;

            // Loop through the 5 questions
            for (let i = 1; i <= totalQuestions; i++) {
                const answer = document.querySelector(`input[name="q${i}"]:checked`);
                if (answer && answer.value === 'yes') {
                    score++;
                }
            }

            // Update Progress Bar
            const progressPercentage = (score / totalQuestions) * 100;
            progressBar.style.width = `${progressPercentage}%`;
            progressBar.setAttribute('aria-valuenow', progressPercentage);

            // Determine Message
            let message = '';
            let alertClass = '';

            if (score <= 2) {
                message = "כדאי להתכונן עוד קצת לפני יום הבחירות.";
                alertClass = 'alert-warning';
            } else if (score <= 4) {
                message = "את/ה כמעט מוכן/ה!";
                alertClass = 'alert-info';
            } else {
                message = "מעולה! את/ה מוכן/ה ליום הבחירות.";
                alertClass = 'alert-success';
            }

            // Show Result
            quizResult.textContent = message;
            quizResult.className = `alert ${alertClass} mt-3 d-block`;
            quizResult.style.display = 'block';
        });
    }

    // 2. Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const agree = document.getElementById('agree').checked;

            let errors = [];

            if (name === "") {
                errors.push("נא להזין שם מלא.");
            }
            if (!email.includes("@")) {
                errors.push("נא להזין כתובת אימייל תקינה.");
            }
            if (message.length < 10) {
                errors.push("ההודעה חייבת להכיל לפחות 10 תווים.");
            }
            if (!agree) {
                errors.push("יש לאשר קבלת מידע נוסף.");
            }

            if (errors.length > 0) {
                formFeedback.innerHTML = errors.join("<br>");
                formFeedback.className = "alert alert-danger mt-3 shadow-sm";
                formFeedback.style.display = 'block';
                formFeedback.style.animation = "shake 0.5s ease-in-out";
            } else {
                formFeedback.innerHTML = "<i class='bi bi-check-circle-fill me-2'></i> הודעתך נשלחה בהצלחה! תודה על הפנייה.";
                formFeedback.className = "alert alert-success mt-3 shadow-sm";
                formFeedback.style.display = 'block';
                formFeedback.style.animation = "fadeIn 0.5s ease-in-out";
                contactForm.reset();
            }
        });
    }

    // Add keyframe animations for feedback
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // 3. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
