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

            // Loop through the 5 questions and identify missing items
            let missingItems = [];
            const feedbackMap = {
                1: "נא לבדוק את מיקום הקלפי שלך באתר ועדת הבחירות.",
                2: "נא לוודא שיש לך תעודה מזהה בתוקף (תעודת זהות, רישיון או דרכון).",
                3: "מומלץ לתכנן מראש את זמן ההגעה לקלפי כדי להימנע מעומסים.",
                4: "חשוב לזכור שההצבעה היא אישית וחשאית לחלוטין.",
                5: "זכור/י שניתן להיעזר בחברי ועדת הקלפי לכל שאלה טכנית."
            };

            for (let i = 1; i <= totalQuestions; i++) {
                const answer = document.querySelector(`input[name="q${i}"]:checked`);
                if (answer) {
                    if (answer.value === 'yes') {
                        score++;
                    } else {
                        missingItems.push(feedbackMap[i]);
                    }
                } else {
                    missingItems.push(`שאלה ${i}: נא לסמן תשובה.`);
                }
            }

            // Update Progress Bar
            const progressPercentage = (score / totalQuestions) * 100;
            progressBar.style.width = `${progressPercentage}%`;
            progressBar.setAttribute('aria-valuenow', progressPercentage);

            // Determine Message and Class
            let alertClass = '';
            let finalHtml = '';

            if (score === totalQuestions) {
                finalHtml = `
                    <div class="text-center">
                        <i class="bi bi-check-circle-fill text-success" style="font-size: 2rem;"></i>
                        <p class="mt-2 mb-0"><strong>כל הכבוד!</strong> את/ה מוכן/ה לחלוטין ליום הבחירות. הקול שלך הולך להשפיע!</p>
                    </div>
                `;
                alertClass = 'alert-success';
            } else {
                alertClass = score <= 2 ? 'alert-warning' : 'alert-info';
                let listHtml = missingItems.map(item => `
                    <li class="mb-2">
                        <i class="bi bi-arrow-left-short text-primary"></i>
                        ${item}
                    </li>
                `).join('');
                finalHtml = `
                    <div class="mb-2"><strong>נשאר לכם עוד קצת!</strong> כדי להיות מוכנים ב-100%, כדאי להשלים את הצעדים הבאים:</div>
                    <ul class="list-unstyled mt-2 mb-0" style="text-align: right; padding-right: 0;">
                        ${listHtml}
                    </ul>
                    <div class="mt-3 small text-muted">* ניתן למצוא את כל המידע הרלוונטי בסקשן "איך מתכוננים" למעלה.</div>
                `;
            }

            // Show Result
            quizResult.innerHTML = finalHtml;
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

    /* 
       4. תוכן מתקדם (Advanced Content) - Chart.js Infographic
       זהו חלק מתקדם שאינו נלמד בקורס הבסיסי. 
       הוא משתמש בספריית Chart.js ליצירת אינפוגרפיקה אינטראקטיבית מבוססת נתונים.
    */
    const initInfographic = () => {
        const ctx = document.getElementById('votingChart');
        if (!ctx) return;

        // הגדרות הגרף
        new Chart(ctx, {
            type: 'line',
            plugins: [ChartDataLabels], // רישום התוסף להצגת מספרים
            data: {
                labels: ['2015', '2019א', '2019ב', '2020', '2021', '2022', '2026 (צפי)'],
                datasets: [{
                    label: 'אחוז הבוחרים בפועל (%)',
                    data: [72.3, 68.5, 69.8, 71.5, 67.4, 70.6, 74.2],
                    backgroundColor: 'rgba(75, 0, 130, 0.2)',
                    borderColor: 'rgba(75, 0, 130, 1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(75, 0, 130, 1)',
                    pointRadius: 6,
                    pointHoverRadius: 9,
                    datalabels: {
                        align: 'top',
                        offset: 5,
                        backgroundColor: 'rgba(75, 0, 130, 0.1)',
                        borderRadius: 4,
                        padding: 4,
                        font: { family: 'Assistant', weight: 'bold', size: 12 },
                        formatter: (value) => value + '%'
                    }
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: { family: 'Assistant', size: 14, weight: 'bold' }
                        }
                    },
                    datalabels: {
                        display: true, // הצגת המספרים על הגרף
                        color: 'var(--primary-color)'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { family: 'Assistant', size: 16 },
                        bodyFont: { family: 'Assistant', size: 14 },
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '% מהאזרחים הצביעו';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 80,
                        title: {
                            display: true,
                            text: 'אחוז הצבעה (%)',
                            color: '#4B0082',
                            font: { family: 'Assistant', size: 16, weight: '800' }
                        },
                        ticks: {
                            font: { family: 'Assistant', size: 12 }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'שנת בחירות',
                            color: '#4B0082',
                            font: { family: 'Assistant', size: 16, weight: '800' }
                        },
                        ticks: {
                            font: { family: 'Assistant', size: 12 }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    };

    // הפעלת האינפוגרפיקה
    initInfographic();

    /* 
       5. סרגל נגישות (Accessibility Toolbar)
    */
    const accessibilityToolbar = document.getElementById('accessibility-toolbar');
    const toggleToolbarBtn = document.getElementById('toggle-toolbar');
    const body = document.body;

    if (toggleToolbarBtn) {
        toggleToolbarBtn.addEventListener('click', () => {
            accessibilityToolbar.classList.toggle('active');
            const isExpanded = accessibilityToolbar.classList.contains('active');
            toggleToolbarBtn.setAttribute('aria-expanded', isExpanded);
        });
    }

    // פונקציות נגישות
    const accessibilityActions = {
        'btn-increase-font': () => {
            if (body.classList.contains('large-font')) {
                body.classList.replace('large-font', 'xlarge-font');
            } else {
                body.classList.add('large-font');
            }
        },
        'btn-decrease-font': () => {
            body.classList.remove('large-font', 'xlarge-font');
        },
        'btn-grayscale': () => body.classList.toggle('grayscale'),
        'btn-high-contrast': () => body.classList.toggle('high-contrast'),
        'btn-underline-links': () => body.classList.toggle('underline-links'),
        'btn-reset-accessibility': () => {
            body.classList.remove('large-font', 'xlarge-font', 'grayscale', 'high-contrast', 'underline-links');
        }
    };

    Object.keys(accessibilityActions).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', accessibilityActions[id]);
        }
    });
});
