export class BackgroundMusic {
    private audio: HTMLAudioElement | null = null;
    private isPlaying: boolean = false;
    
    constructor() {
        if (typeof window !== 'undefined') {
            this.audio = new Audio('/roi_slowed.mp3');
            this.audio.loop = true;
            this.audio.volume = 0.5;
        }
    }
    
    async play() {
        if (!this.audio || this.isPlaying) return;
        
        try {
            await this.audio.play();
            this.isPlaying = true;
        } catch (e) {
            console.log('Audio playback requires user interaction first');
        }
    }
    
    pause() {
        if (this.audio && this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        }
    }
    
    async toggle(): Promise<boolean> {
        if (this.isPlaying) {
            this.pause();
        } else {
            await this.play();
        }
        return this.isPlaying;
    }
    
    setVolume(volume: number) {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
        }
    }
    
    getIsPlaying() {
        return this.isPlaying;
    }
}

// Celebration jingle when day puzzle is completed
export async function playDayComplete() {
    if (typeof window === 'undefined') return;
    
    try {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        
        // Happy ascending arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            const startTime = audioContext.currentTime + i * 0.15;
            gainNode.gain.setValueAtTime(0.15, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Unlock sound when new day becomes accessible
export async function playDayUnlock() {
    if (typeof window === 'undefined') return;
    
    try {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        
        // Sparkle sound effect
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(1600, audioContext.currentTime + 0.2);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Singleton instance for the background music
let backgroundMusicInstance: BackgroundMusic | null = null;

export function getBackgroundMusic(): BackgroundMusic {
    if (!backgroundMusicInstance) {
        backgroundMusicInstance = new BackgroundMusic();
    }
    return backgroundMusicInstance;
}