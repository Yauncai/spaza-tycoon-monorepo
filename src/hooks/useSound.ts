import { useCallback } from 'react';
import * as Tone from 'tone';

export const useSound = () => {
  const playSound = useCallback(async (type: string) => {
    try {
      await Tone.start();
      
      switch (type) {
        case 'coin':
        case 'kaching':
          // Play kaching audio file for successful transactions
          const kachingAudio = new Audio('/assets/kaching.wav');
          kachingAudio.play().catch(e => console.log('Audio play failed:', e));
          break;
        case 'error':
        case 'loss':
          // Loss sound removed
          break;
        case 'pop':
          const popSynth = new Tone.MembraneSynth().toDestination();
          popSynth.triggerAttackRelease("C3", "32n");
          break;
        case 'gameover':
          // Game over sound removed
          break;
        case 'start':
          const startSynth = new Tone.Synth().toDestination();
          startSynth.triggerAttackRelease("C4", "8n");
          break;
        case 'success':
          const successSynth = new Tone.Synth().toDestination();
          successSynth.triggerAttackRelease("C6", "8n");
          break;
      }
    } catch (error) {
      console.log('Sound error:', error);
    }
  }, []);

  return { playSound };
};