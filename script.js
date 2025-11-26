class ProgressBar {
    constructor() {
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.status = document.getElementById('status');
        this.leakHole = document.getElementById('leakHole');
        this.waterDrip = document.getElementById('waterDrip');

        this.progress = 0;
        this.isLeaking = false;
        this.leakThreshold = 85;

        this.statusMessages = [
            "Initializing...",
            "Downloading updates...",
            "Verifying files...",
            "Installing components...",
            "Almost there...",
            "Optimizing system...",
            "Finalizing installation...",
        ];

        this.startProgress();
    }

    startProgress() {
        this.updateStatus(0);
        this.animateProgress();
    }

    animateProgress() {
        const speed = 20 + Math.random() * 30;

        const interval = setInterval(() => {
            if (this.isLeaking) {
                return;
            }

            this.progress += Math.random() * 2;
            
            if (Math.random() < 0.1) {
                this.progress += 0.1;
            }

            this.updateProgressBar();
            this.updateStatus(this.progress);

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

    triggerLeak() {
        this.isLeaking = true;
        this.status.textContent = "Critical error! System leak detected!";

        // Show the leak hole
        this.leakHole.style.opacity = '1';
        
        // Add shaking effect to the progress bar
        this.progressBar.classList.add('leaking-shake');

        // Create multiple water drips
        this.createWaterDrips();

        // Animate progress draining with water effect
        this.drainProgress();
    }

    createWaterDrips() {
        // Create continuous dripping effect
        this.waterDrip.classList.add('dripping');

        // Create water stream element
        const waterStream = document.createElement('div');
        waterStream.className = 'water-stream';
        this.progressBar.appendChild(waterStream);

        // Create additional random drips
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const extraDrip = document.createElement('div');
                extraDrip.className = 'water-drip dripping';
                extraDrip.style.left = (15 + Math.random() * 10) + 'px';
                extraDrip.style.animationDelay = (Math.random() * 0.5) + 's';
                this.progressBar.appendChild(extraDrip);
            }, i * 200);
        }
    }

    drainProgress() {
        const drainInterval = setInterval(() => {
            this.progress -= 1.5 + Math.random() * 2;
            
            // Make draining speed vary for more realistic effect
            if (this.progress < 50) {
                this.progress -= 0.5; // Slow down when almost empty
            }
            
            this.updateProgressBar();

            if (this.progress <= 10) {
                clearInterval(drainInterval);
                this.resetLeak();
            }
        }, 40);
    }

    resetLeak() {
        // Remove all water effects
        this.waterDrip.classList.remove('dripping');
        this.progressBar.classList.remove('leaking-shake');
        
        // Remove water stream and extra drips
        const waterEffects = this.progressBar.querySelectorAll('.water-stream, .water-drip:not(#waterDrip)');
        waterEffects.forEach(effect => effect.remove());

        this.leakHole.style.opacity = '0';
        this.status.textContent = "Repairing system...";

        setTimeout(() => {
            this.isLeaking = false;
            this.leakThreshold = 85 + Math.random() * 10;
            this.animateProgress();
        }, 1500);
    }

    updateProgressBar() {
        this.progressFill.style.setProperty('--progress', `${Math.round(this.progress)}%`);
        this.progressText.textContent = `${Math.round(this.progress)}%`;
    }

    updateStatus(progress) {
        const statusIndex = Math.min(Math.floor(progress / 15), this.statusMessages.length - 1);
        this.status.textContent = this.statusMessages[statusIndex];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProgressBar();
});