// PitchGuard Lite - Frontend JavaScript
// Handles client-side encryption and API communication

class PitchGuardClient {
    constructor() {
        this.apiUrl = 'http://localhost:8000';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const form = document.getElementById('pitchForm');
        const submitBtn = document.getElementById('submitBtn');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePitchSubmission();
        });

        // Add character count for textarea
        const textarea = document.getElementById('pitchText');
        textarea.addEventListener('input', this.updateCharacterCount.bind(this));
    }

    updateCharacterCount() {
        const textarea = document.getElementById('pitchText');
        const charCount = textarea.value.length;
        
        // You can add a character counter display here if needed
        if (charCount < 100) {
            textarea.classList.add('error-state');
        } else {
            textarea.classList.remove('error-state');
        }
    }

    async handlePitchSubmission() {
        const pitchText = document.getElementById('pitchText').value.trim();
        
        if (!pitchText) {
            this.showError('Please enter your pitch text.');
            return;
        }

        if (pitchText.length < 50) {
            this.showError('Pitch text is too short. Please provide more details for accurate scoring.');
            return;
        }

        try {
            this.setLoadingState(true);
            this.hideError();
            this.hideResults();

            // Step 1: Generate encryption key and IV
            const key = await this.generateAESKey();
            const iv = this.generateIV();

            // Step 2: Encrypt the pitch text
            const encryptedData = await this.encryptText(pitchText, key, iv);

            // Step 3: Export key to base64
            const keyBase64 = await this.exportKeyToBase64(key);

            // Step 4: Prepare payload
            const payload = {
                ciphertext: encryptedData.ciphertext,
                iv: encryptedData.iv,
                aes_key: keyBase64
            };

            // Step 5: Send to backend
            const response = await this.sendToBackend(payload);

            // Step 6: Display results
            this.displayResults(response);

        } catch (error) {
            console.error('Error processing pitch:', error);
            this.showError(`Failed to process pitch: ${error.message}`);
        } finally {
            this.setLoadingState(false);
        }
    }

    async generateAESKey() {
        return await window.crypto.subtle.generateKey(
            {
                name: 'AES-GCM',
                length: 256
            },
            true, // extractable
            ['encrypt', 'decrypt']
        );
    }

    generateIV() {
        return window.crypto.getRandomValues(new Uint8Array(12));
    }

    async encryptText(text, key, iv) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            data
        );

        return {
            ciphertext: this.arrayBufferToBase64(encrypted),
            iv: this.arrayBufferToBase64(iv)
        };
    }

    async exportKeyToBase64(key) {
        const exported = await window.crypto.subtle.exportKey('raw', key);
        return this.arrayBufferToBase64(exported);
    }

    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    async sendToBackend(payload) {
        const response = await fetch(`${this.apiUrl}/score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    displayResults(data) {
        const { scores, receipt } = data;
        
        // Hide no results placeholder
        document.getElementById('noResults').classList.add('hidden');
        
        // Show results container
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.classList.remove('hidden');
        resultsContainer.classList.add('fade-in-up');

        // Update score values and bars
        this.updateScore('clarity', scores.clarity);
        this.updateScore('originality', scores.originality);
        this.updateScore('team_strength', scores.team_strength);
        this.updateScore('market_fit', scores.market_fit);

        // Update receipt
        document.getElementById('receiptHash').textContent = receipt;

        // Animate bars with delay
        setTimeout(() => {
            this.animateScoreBars(scores);
        }, 300);
    }

    updateScore(criterion, score) {
        const scoreElement = document.getElementById(`${this.mapCriterionName(criterion)}Score`);
        scoreElement.textContent = score.toFixed(1);
        scoreElement.classList.add('score-value', 'updated');
        
        setTimeout(() => {
            scoreElement.classList.remove('updated');
        }, 300);
    }

    mapCriterionName(criterion) {
        const mapping = {
            'clarity': 'clarity',
            'originality': 'originality',
            'team_strength': 'team',
            'market_fit': 'market'
        };
        return mapping[criterion] || criterion;
    }

    animateScoreBars(scores) {
        const criteriaMapping = {
            'clarity': scores.clarity,
            'originality': scores.originality,
            'team': scores.team_strength,
            'market': scores.market_fit
        };

        Object.entries(criteriaMapping).forEach(([criterion, score], index) => {
            setTimeout(() => {
                const bar = document.getElementById(`${criterion}Bar`);
                const percentage = (score / 10) * 100;
                bar.style.width = `${percentage}%`;
            }, index * 200);
        });
    }

    setLoadingState(isLoading) {
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const loadingSpinner = document.getElementById('loadingSpinner');

        if (isLoading) {
            submitBtn.disabled = true;
            submitText.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            submitText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        }
    }

    showError(message) {
        const errorContainer = document.getElementById('errorContainer');
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.textContent = message;
        errorContainer.classList.remove('hidden');
        
        // Hide after 10 seconds
        setTimeout(() => {
            this.hideError();
        }, 10000);
    }

    hideError() {
        document.getElementById('errorContainer').classList.add('hidden');
    }

    hideResults() {
        document.getElementById('resultsContainer').classList.add('hidden');
        document.getElementById('noResults').classList.remove('hidden');
    }
}

// Utility functions for debugging and testing
window.PitchGuardUtils = {
    // Test encryption/decryption locally
    async testEncryption(text) {
        const client = new PitchGuardClient();
        const key = await client.generateAESKey();
        const iv = client.generateIV();
        
        const encrypted = await client.encryptText(text, key, iv);
        console.log('Encrypted:', encrypted);
        
        return {
            key: await client.exportKeyToBase64(key),
            ...encrypted
        };
    },

    // Generate sample payload for testing
    async generateSamplePayload() {
        const samplePitch = `
        Our startup, EcoClean, revolutionizes urban waste management through AI-powered sorting robots. 
        We've identified that 60% of recyclable materials end up in landfills due to improper sorting. 
        Our solution uses computer vision and machine learning to achieve 95% sorting accuracy, 
        reducing waste processing costs by 40%. With a team of MIT engineers and partnerships with 
        3 major cities, we're seeking $2M to scale our pilot program nationwide.
        `;
        
        return await this.testEncryption(samplePitch.trim());
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pitchGuardClient = new PitchGuardClient();
    
    // Add some helpful console messages for developers
    console.log('🔒 PitchGuard Lite initialized');
    console.log('💡 Use PitchGuardUtils.generateSamplePayload() to test encryption');
    console.log('🔧 Backend should be running on http://localhost:8000');
});

// Handle page visibility changes to clear sensitive data
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Clear any sensitive data from memory when page is hidden
        // This is a security best practice
        if (window.pitchGuardClient) {
            // Could implement memory clearing here if needed
        }
    }
});

// Add keyboard shortcuts for better UX
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const form = document.getElementById('pitchForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
});