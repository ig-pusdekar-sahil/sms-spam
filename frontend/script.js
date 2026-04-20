// UPDATE THIS URL AFTER DEPLOYING YOUR BACKEND TO RENDER!
// For local development, keep it as 'http://127.0.0.1:8000'
const API_BASE_URL = 'https://sms-spam-backend-g2xn.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const smsInput = document.getElementById('sms-input');
    const btnText = analyzeBtn.querySelector('.btn-text');
    const loader = analyzeBtn.querySelector('.loader');
    const resultSection = document.getElementById('result-section');
    const resultCard = resultSection.querySelector('.result-card');
    const resultIcon = document.getElementById('result-icon');
    const resultHeading = document.getElementById('result-heading');
    const resultConfidence = document.getElementById('result-confidence');

    // Make UI interactive and clear result when typing
    smsInput.addEventListener('input', () => {
        if (!resultSection.classList.contains('hidden')) {
            resultSection.classList.add('hidden');
        }
    });

    analyzeBtn.addEventListener('click', async () => {
        const text = smsInput.value.trim();
        
        if (!text) {
            // Error shake animation or simply border highlight
            smsInput.style.borderColor = '#ef4444';
            smsInput.focus();
            setTimeout(() => {
                smsInput.style.borderColor = 'var(--glass-border)';
            }, 1000);
            return;
        }

        // Show Loading State
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        analyzeBtn.disabled = true;
        resultSection.classList.add('hidden');
        
        try {
            const encodedText = encodeURIComponent(text);
            const response = await fetch(`${API_BASE_URL}/predict?text=${encodedText}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Server non-ok response');
            }

            const data = await response.json();
            
            // Add a small artificial delay to make the loading feel like "deep analysis"
            // Typically great for aesthetics, makes the ML model seem more complex :)
            setTimeout(() => {
                updateResultUI(data.prediction);
                // Restore Button State
                btnText.classList.remove('hidden');
                loader.classList.add('hidden');
                analyzeBtn.disabled = false;
            }, 600);
            
        } catch (error) {
            console.error('Error during prediction:', error);
            alert('Failed to connect to the backend server. Make sure FastAPI server is running on https://sms-spam-backend-g2xn.onrender.com');
            // Restore Button State
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            analyzeBtn.disabled = false;
        }
    });

    function updateResultUI(prediction) {
        resultSection.classList.remove('hidden');
        resultCard.className = 'result-card ' + prediction;
        
        if (prediction === 'spam') {
            resultIcon.innerHTML = '⚠️';
            resultHeading.textContent = 'Spam Detected';
            resultConfidence.textContent = 'Warning: Our model has flagged this text as potential spam, phishing, or an unwanted message.';
        } else {
            resultIcon.innerHTML = '🛡️';
            resultHeading.textContent = 'Safe Message';
            resultConfidence.textContent = 'Clear: This appears to be a legitimate, normal text message.';
        }
    }
});
