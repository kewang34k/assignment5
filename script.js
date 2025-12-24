// Christmas-themed JavaScript functionality

function showMessage() {
    const message = document.getElementById('message');
    message.classList.remove('hidden');
    
    // Add sparkle effect
    createSparkles();
}

function hideMessage() {
    const message = document.getElementById('message');
    message.classList.add('hidden');
}

function createSparkles() {
    const sparkles = ['✨', '⭐', '🌟', '💫'];
    const messageContent = document.querySelector('.message-content');
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('span');
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.position = 'absolute';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.fontSize = '1.5rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.animation = 'sparkle 2s ease-out forwards';
            messageContent.style.position = 'relative';
            messageContent.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 2000);
        }, i * 100);
    }
}

// Add sparkle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Add click outside to close message
document.addEventListener('click', (e) => {
    const message = document.getElementById('message');
    if (!message.classList.contains('hidden') && e.target === message) {
        hideMessage();
    }
});

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideMessage();
    }
});

// Add some interactive Christmas cheer
document.addEventListener('DOMContentLoaded', () => {
    // Add twinkling effect to ornaments
    const ornaments = document.querySelectorAll('.ornament');
    ornaments.forEach((ornament, index) => {
        setInterval(() => {
            ornament.style.transform = 'scale(1.2)';
            setTimeout(() => {
                ornament.style.transform = 'scale(1)';
            }, 200);
        }, 2000 + index * 300);
    });
    
    // Add hover effect to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--christmas-gold)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'var(--christmas-red)';
        });
    });
});

// Console message for developers
console.log('%c🎄 Merry Christmas! 🎄', 'color: #C41E3A; font-size: 20px; font-weight: bold;');
console.log('%cHappy Holidays!', 'color: #228B22; font-size: 16px;');
