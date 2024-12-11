import { writable } from 'svelte/store';

export interface PlaneState {
  rotation: number;
  scale: number;
  pointSize: number;
  waveFreq1: number;
  waveAmp1: number;
  waveSpeed1: number;
  waveFreq2: number;
  waveAmp2: number;
  waveSpeed2: number;
}

export const sceneScale = writable(1);
export const sceneNumber = writable(1);

export const planes = writable<PlaneState[]>([]);

export const addPlane = () => {
  planes.update((planes) => [
    ...planes,
    {
      rotation: 0,  // now in degrees
      scale: 1,
      pointSize: 1,
      waveFreq1: 10.0,
      waveAmp1: 1.0,
      waveSpeed1: 2.0,
      waveFreq2: 20.0,
      waveAmp2: 0.5,
      waveSpeed2: 1.5
    }
  ]);
};
