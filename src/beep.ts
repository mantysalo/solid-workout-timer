export function beep(audioCtx: AudioContext, duration: number, frequency: number, volume: number){
    return new Promise<void>((resolve, reject) => {
        // Set default duration if not provided
        duration = duration || 200;
        frequency = frequency || 440;
        volume = volume || 100;

        try{
            let oscillatorNode = audioCtx.createOscillator();
            let gainNode = audioCtx.createGain();
            oscillatorNode.connect(gainNode);

            // Set the oscillator frequency in hertz
            oscillatorNode.frequency.value = frequency;

            // Set the type of oscillator
            oscillatorNode.type= "square";
            gainNode.connect(audioCtx.destination);

            // Set the gain to the volume
            gainNode.gain.value = volume * 0.01;

            // Start audio with the desired duration
            oscillatorNode.start(audioCtx.currentTime);
            oscillatorNode.stop(audioCtx.currentTime + duration * 0.001);

            // Resolve the promise when the sound is finished
            oscillatorNode.onended = () => {
                resolve();
            };
        }catch(error){
            reject(error);
        }
    });
}

export function wait(duration: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), duration);
    });
}