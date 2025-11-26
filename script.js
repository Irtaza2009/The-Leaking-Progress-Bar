class PipeProgressSystem {
    constructor() {
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.status = document.getElementById('status');
        this.inputLiquid = document.getElementById('inputLiquid');
        this.outputLiquid = document.getElementById('outputLiquid');
        this.outputCircle = document.getElementById('outputCircle');
        this.progressBar = document.getElementById('progressBar');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.container = document.querySelector('.container');

        this.progress = 0;
        this.isLeaking = false;
        this.isRunning = false;
        this.currentInterval = null;
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

        this.setupEventListeners();
        this.setupCircles();
        this.showIdleState();
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => {
            this.startSystem();
        });

        this.restartButton.addEventListener('click', () => {
            this.restartSystem();
        });
    }

    setupCircles() {
        this.updateOutputCirclePosition();
    }

    updateOutputCirclePosition() {
        this.outputCircle.style.left = `${this.leakPosition}%`;
    }

    showIdleState() {
        this.container.classList.add('system-idle');
        this.status.textContent = "Click Start to begin installation";
        this.startButton.style.display = 'block';
        this.restartButton.style.display = 'none';
    }

    showRunningState() {
        this.container.classList.remove('system-idle');
        this.startButton.style.display = 'none';
        this.restartButton.style.display = 'none';
    }

    showCompleteState() {
        this.restartButton.style.display = 'block';
    }

    startSystem() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.showRunningState();
        this.resetProgress();
        this.startProgress();
    }

    restartSystem() {
        if (this.isRunning) return;
        
        this.startSystem();
    }

    resetProgress() {
        this.progress = 0;
        this.isLeaking = false;
        this.updateProgressBar();
        this.updateInputCircle();
        this.outputLiquid.style.height = '0%';
        this.outputCircle.style.opacity = '0';
        this.outputCircle.classList.remove('leaking-hole', 'hole-connecting');
        
        // Clear any existing intervals
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = null;
        }
    }

    startProgress() {
        this.updateStatus(0);
        this.inputLiquid.classList.add('flowing');
        this.animateProgress();
    }

    animateProgress() {
        const speed = 20 + Math.random() * 30;

        this.currentInterval = setInterval(() => {
            if (this.isLeaking || !this.isRunning) {
                return;
            }

            this.progress += Math.random() * 2;
            
            if (Math.random() < 0.1) {
                this.progress += 0.1;
            }

            this.updateProgressBar();
            this.updateInputCircle();
            this.updateStatus(this.progress);

            if (Math.random() < 0.15) {
                this.createBubble(this.inputCircle, 'input');
            }

            if (this.progress >= this.leakThreshold && !this.isLeaking) {
                clearInterval(this.currentInterval);
                this.triggerLeak();
            }

            if (this.progress >= 100) {
                clearInterval(this.currentInterval);
                setTimeout(() => this.triggerLeak(), 500);
            }
        }, speed);
    }

    updateProgressBar() {
        this.progressFill.style.setProperty('--progress', `${Math.round(this.progress)}%`);
        this.progressText.textContent = `${Math.round(this.progress)}%`;
    }

    updateInputCircle() {
        const inputCircleHeight = (this.progress / 100) * 100;
        this.inputLiquid.style.height = `${inputCircleHeight}%`;
    }

    updateOutputCircle() {
        const outputCircleHeight = (this.progress / 100) * 100;
        this.outputLiquid.style.height = `${outputCircleHeight}%`;
    }

    triggerLeak() {
        this.isLeaking = true;
        this.status.textContent = "Leak detected! Draining system...";

        this.outputCircle.style.opacity = '1';
        this.outputCircle.classList.add('hole-connecting', 'leaking-hole');

        this.inputLiquid.classList.remove('flowing');
        this.outputLiquid.classList.add('flowing');

        this.createDrippingEffect();
        this.drainProgress();
    }

    createDrippingEffect() {
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
        
        setTimeout(() => {
            if (drip.parentNode) {
                drip.parentNode.removeChild(drip);
            }
        }, 1000);
    }

    drainProgress() {
        this.currentInterval = setInterval(() => {
            if (!this.isRunning) return;
            
            this.progress -= 1.5 + Math.random() * 2;
            
            this.updateProgressBar();
            this.updateInputCircle();
            this.updateOutputCircle();

            if (Math.random() < 0.3) {
                this.createBubble(this.outputCircle, 'output');
            }

            if (Math.random() < 0.2) {
                this.createDrip(this.outputCircle);
            }

            if (this.progress <= 5) {
                clearInterval(this.currentInterval);
                this.resetSystem();
            }
        }, 40);
    }

    resetSystem() {
        this.outputCircle.style.opacity = '0';
        this.outputCircle.classList.remove('leaking-hole', 'hole-connecting');

        this.outputLiquid.classList.remove('flowing');
        this.outputLiquid.style.height = '0%';

        this.status.textContent = "System drained. Ready for restart.";

        setTimeout(() => {
            this.isRunning = false;
            this.isLeaking = false;
            this.showCompleteState();
        }, 1000);
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