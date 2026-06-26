import { useContext } from 'react';
import { AudioCtx } from './audioContext.jsx';

export function useAudio() {
  return useContext(AudioCtx);
}