class VoiceCommands {
    constructor() {
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.recognition.continuous = true;
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = this.handleResult.bind(this);
        this.recognition.onerror = this.handleError.bind(this);

        this.commands = {
            'show dashboard': () => window.location.href = '/',
            'show logs': () => window.location.href = '/logs',
            'increase volume': () => this.adjustVolume(0.1),
            'decrease volume': () => this.adjustVolume(-0.1),
            'mute': () => this.setVolume(0),
            'unmute': () => this.setVolume(1),
            'go back': () => window.history.back(),
            'refresh page': () => window.location.reload(),
        };

        this.isListening = false;
        this.isActivated = false;
        this.activationPhrase = 'freight companion';

        // Start always-on listening for activation phrase
        this.startAlwaysListening();
    }

    startAlwaysListening() {
        this.alwaysOnRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.alwaysOnRecognition.continuous = true;
        this.alwaysOnRecognition.lang = 'en-US';
        this.alwaysOnRecognition.interimResults = false;
        this.alwaysOnRecognition.maxAlternatives = 1;

        this.alwaysOnRecognition.onresult = this.handleAlwaysOnResult.bind(this);
        this.alwaysOnRecognition.onerror = this.handleError.bind(this);

        this.alwaysOnRecognition.start();
        console.log('Always-on listening started. Say "Freight Companion" to activate!');
    }

    handleAlwaysOnResult(event) {
        const last = event.results.length - 1;
        const heard = event.results[last][0].transcript.toLowerCase().trim();

        if (heard.includes(this.activationPhrase)) {
            console.log('Activation phrase detected!');
            this.activate();
        }
    }

    activate() {
        if (!this.isActivated) {
            this.isActivated = true;
            this.start();
            console.log('Freight Companion activated! Listening for commands...');
            // Optionally, add a timeout to deactivate after a period of inactivity
            setTimeout(() => this.deactivate(), 30000); // Deactivate after 30 seconds
        }
    }

    deactivate() {
        if (this.isActivated) {
            this.isActivated = false;
            this.stop();
            console.log('Freight Companion deactivated. Say "Freight Companion" to activate again.');
        }
    }

    start() {
        if (!this.isListening) {
            this.recognition.start();
            this.isListening = true;
            console.log('Voice recognition started. Try saying a command!');
        }
    }

    stop() {
        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            console.log('Voice recognition stopped.');
        }
    }

    handleResult(event) {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase().trim();

        console.log('Voice command recognized:', command);

        for (const [key, action] of Object.entries(this.commands)) {
            if (command.includes(key)) {
                action();
                return;
            }
        }

        console.log('Unknown command:', command);
    }

    handleError(event) {
        console.error('Voice recognition error:', event.error);
        // Restart always-on listening if it crashes
        if (event.error === 'no-speech' || event.error === 'audio-capture' || event.error === 'not-allowed') {
            this.startAlwaysListening();
        }
    }

    adjustVolume(change) {
        const audio = document.querySelector('audio');
        if (audio) {
            audio.volume = Math.max(0, Math.min(1, audio.volume + change));
            console.log(`Volume adjusted to ${audio.volume.toFixed(2)}`);
        }
    }

    setVolume(level) {
        const audio = document.querySelector('audio');
        if (audio) {
            audio.volume = Math.max(0, Math.min(1, level));
            console.log(`Volume set to ${audio.volume.toFixed(2)}`);
        }
    }
}

export default VoiceCommands;
