document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // General Site Functionality
    // =============================================
    
    // Mobile Menu Toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking on a nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Make tables responsive for mobile
    function makeTablesResponsive() {
        const tables = document.querySelectorAll('table');
        const isMobile = window.innerWidth <= 768;
        
        tables.forEach(table => {
            if (table.classList.contains('responsive-processed')) return;
            
            if (isMobile) {
                const headers = [];
                table.querySelectorAll('thead th').forEach(th => {
                    headers.push(th.textContent.trim());
                });
                
                table.querySelectorAll('tbody tr').forEach(row => {
                    const cells = row.querySelectorAll('td');
                    cells.forEach((cell, index) => {
                        if (headers[index]) {
                            cell.setAttribute('data-label', headers[index]);
                        }
                    });
                });
                
                table.classList.add('responsive-processed');
            }
        });
    }

    // Apply responsive tables on load and resize
    makeTablesResponsive();
    window.addEventListener('resize', makeTablesResponsive);

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Card hover effects
    const cards = document.querySelectorAll('.topic-card, .feature-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Initialize tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = el.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = el.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            
            el.addEventListener('mouseleave', () => {
                tooltip.remove();
            }, { once: true });
        });
    });

    // Add focus styles for keyboard navigation
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Tab') {
            document.documentElement.classList.add('keyboard-focus');
        }
    });

    document.addEventListener('mousedown', () => {
        document.documentElement.classList.remove('keyboard-focus');
    });

    // Initialize Prism.js for code highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }


    Prism.highlightAll();

    // =============================================
    // Authentication System
    // =============================================
    
    const AUTH_CONFIG = {
        validCredentials: [
            { username: "admin", password: "admin123" },
            { username: "demo", password: "demo123" },
            { username: "user", password: "user123" }
        ],
        authKey: 'sqlmaster-auth',
        usernameKey: 'sqlmaster-username',
        redirectDelay: 1000
    };

    // Check authentication state and redirect if needed
    function checkAuthState() {
        const isAuthenticated = localStorage.getItem(AUTH_CONFIG.authKey) === 'true';
        const currentPage = window.location.pathname.split('/').pop();
        
        if (isAuthenticated && currentPage === 'login.html') {
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, AUTH_CONFIG.redirectDelay);
        }
        
        if (!isAuthenticated && currentPage === 'dashboard.html') {
            window.location.href = 'login.html';
        }
    }

    // Validate credentials against our predefined list
    function validateCredentials(username, password) {
        return AUTH_CONFIG.validCredentials.some(cred => 
            cred.username === username && cred.password === password
        );
    }

    // Show toast notification
    function showToast(message, type = '') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Handle login form submission
    function handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('loginUsername')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;
        
        if (!username || !password) {
            showToast('Please enter both username and password', 'error');
            return;
        }
        
        if (validateCredentials(username, password)) {
            localStorage.setItem(AUTH_CONFIG.authKey, 'true');
            localStorage.setItem(AUTH_CONFIG.usernameKey, username);
            showToast('Login successful!', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, AUTH_CONFIG.redirectDelay);
        } else {
            showToast('Invalid credentials', 'error');
        }
    }

    // Handle registration form submission
    function handleRegistration(event) {
        event.preventDefault();
        
        const name = document.getElementById('registerName')?.value.trim();
        const email = document.getElementById('registerEmail')?.value.trim();
        const password = document.getElementById('registerPassword')?.value;
        const confirmPassword = document.getElementById('registerConfirm')?.value;
        
        if (!name || !email || !password || !confirmPassword) {
            showToast('Please fill all fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        // In a real app, you would send this to your backend
        showToast('Registration successful! Please login', 'success');
        document.getElementById('registerForm').reset();
        
        // Switch to login form
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    }

    // Handle logout
    function handleLogout() {
        localStorage.removeItem(AUTH_CONFIG.authKey);
        localStorage.removeItem(AUTH_CONFIG.usernameKey);
        showToast('Logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, AUTH_CONFIG.redirectDelay);
    }

    // Initialize authentication forms
    function initAuthForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', handleRegistration);
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        
        // Toggle between login and register forms
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        
        if (showRegister && showLogin) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('registerForm').style.display = 'block';
            });
            
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('registerForm').style.display = 'none';
                document.getElementById('loginForm').style.display = 'block';
            });
        }
    }

    // Initialize authentication system
    checkAuthState();
    initAuthForms();
});