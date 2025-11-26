class PipeProgressSystem {
    constructor() {
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.status = document.getElementById('status');
        this.inputLiquid = document.getElementById('inputLiquid');
        this.outputLiquid = document.getElementById('outputLiquid');
        this.outputCircle = document.getElementById('outputCircle');
        this.progressBar = document.getElementById('progressBar');

        this.progress = 0;
        this.isLeaking = false;
        this.leakThreshold = 85;
        this.leakPosition = 85;

        this.statusMessages = [
            "Initializing system...",
            "Loading components...",
            "Processing data...",
            "Transferring files...",
            "Almost complete...",
            "Finalizing...",
            "Completing installation...",
        ];

        this.setupCircles();
        this.startProgress();
    }

    setupCircles() {
        // Input circle is always at the start (left side)
        // Output circle will be positioned at leak threshold
        this.updateOutputCirclePosition();
    }

    updateOutputCirclePosition() {
        // Position output circle at the current leak threshold
        this.outputCircle.style.left = `${this.leakPosition}%`;
    }

    startProgress() {
        this.updateStatus(0);
        this.inputLiquid.classList.add('flowing');
        this.animateProgress();
    }

    animateProgress() {
        const speed = 20 + Math.random() * 30;

        const interval = setInterval(() => {
            if (this.isLeaking) {
                return;
            }

            this.progress += Math.random() * 2;
            
            // Occasionally slow down for "realism"
            if (Math.random() < 0.1) {
                this.progress += 0.1;
            }

            this.updateProgressBar();
            this.updateInputCircle();
            this.updateStatus(this.progress);

            // Create bubbles in input circle occasionally
            if (Math.random() < 0.15) {
                this.createBubble(this.inputCircle, 'input');
            }

            if (this.progress >= this.leakThreshold && !this.isLeaking) {
                clearInterval(interval);
                this.triggerLeak();
            }

            if (this.progress >= 100) {
                clearInterval(interval);
                setTimeout(() => this.triggerLeak(), 500);
            }
        }, speed);
    }

    updateProgressBar() {
        this.progressFill.style.setProperty('--progress', `${Math.round(this.progress)}%`);
        this.progressText.textContent = `${Math.round(this.progress)}%`;
    }

    updateInputCircle() {
        // Input circle fills as progress increases
        const inputCircleHeight = (this.progress / 100) * 100;
        this.inputLiquid.style.height = `${inputCircleHeight}%`;
    }

    updateOutputCircle() {
        // Output circle fills as progress drains during leak
        const outputCircleHeight = (this.progress / 100) * 100;
        this.outputLiquid.style.height = `${outputCircleHeight}%`;
    }

    triggerLeak() {
        this.isLeaking = true;
        this.status.textContent = "Leak detected! Draining system...";

        // Show and activate output circle (hole)
        this.outputCircle.style.opacity = '1';
        this.outputCircle.classList.add('hole-connecting', 'leaking-hole');

        // Stop input flow
        this.inputLiquid.classList.remove('flowing');

        // Start output flow
        this.outputLiquid.classList.add('flowing');

        // Create dripping effect
        this.createDrippingEffect();

        // Begin draining progress
        this.drainProgress();
    }

    createDrippingEffect() {
        // Create multiple drips from the hole
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createDrip(this.outputCircle);
            }, i * 300);
        }
    }

    createDrip(holeElement) {
        const drip = document.createElement('div');
        drip.className = 'bubble dripping';
        
        const size = 4 + Math.random() * 3;
        const left = 8 + Math.random() * 9;
        
        drip.style.width = `${size}px`;
        drip.style.height = `${size}px`;
        drip.style.left = `${left}px`;
        drip.style.bottom = '-5px';
        drip.style.background = '#1abc9c';
        drip.style.animationDuration = '0.8s';
        
        holeElement.appendChild(drip);
        
        // Remove drip after animation
        setTimeout(() => {
            if (drip.parentNode) {
                drip.parentNode.removeChild(drip);
            }
        }, 1000);
    }

    drainProgress() {
        const drainInterval = setInterval(() => {
            this.progress -= 1.5 + Math.random() * 2;
            
            // Update both progress bar and circles
            this.updateProgressBar();
            this.updateInputCircle();
            this.updateOutputCircle();

            // Create bubbles in output circle during draining
            if (Math.random() < 0.3) {
                this.createBubble(this.outputCircle, 'output');
            }

            // Create occasional drips
            if (Math.random() < 0.2) {
                this.createDrip(this.outputCircle);
            }

            if (this.progress <= 5) {
                clearInterval(drainInterval);
                this.resetSystem();
            }
        }, 40);
    }

    resetSystem() {
        // Hide and deactivate output circle
        this.outputCircle.style.opacity = '0';
        this.outputCircle.classList.remove('leaking-hole', 'hole-connecting');

        // Stop output flow
        this.outputLiquid.classList.remove('flowing');
        
        // Reset output circle
        this.outputLiquid.style.height = '0%';

        this.status.textContent = "Patching leaks... Restarting flow...";

        setTimeout(() => {
            this.isLeaking = false;
            
            // Set new random leak position
            this.leakThreshold = 75 + Math.random() * 20;
            this.leakPosition = this.leakThreshold;
            this.updateOutputCirclePosition();
            
            // Restart input flow
            this.inputLiquid.classList.add('flowing');
            
            this.animateProgress();
        }, 2000);
    }

    createBubble(circleElement, type) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const size = 2 + Math.random() * 3;
        const left = 5 + Math.random() * 15;
        
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}px`;
        bubble.style.bottom = '5px';
        
        circleElement.appendChild(bubble);
        
        // Remove bubble after animation
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, 1500);
    }

    updateStatus(progress) {
        const statusIndex = Math.min(Math.floor(progress / 15), this.statusMessages.length - 1);
        this.status.textContent = this.statusMessages[statusIndex];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PipeProgressSystem();
});