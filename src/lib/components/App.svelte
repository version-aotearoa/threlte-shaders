<script lang="ts">
  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  import { Button, Folder, Slider, Stepper } from 'svelte-tweakpane-ui';
  import { sceneScale, sceneNumber, planes } from '../stores/sceneStore';

  let scene = 1;
  let scale = 1;

  // Subscribe to store changes
  $: $sceneScale = scale;
  $: $sceneNumber = scene;

  const handleClick = () => {
    planes.update(ps => [...ps, {
      rotation: 0,
      scale: 1,
      pointSize: 2.0,
      waveFreq1: 1.0,
      waveAmp1: 1.0,
      waveSpeed1: 1.0,
      waveFreq2: 1.0,
      waveAmp2: 1.0,
      waveSpeed2: 1.0
    }]);
    console.log("Wave plane added to scene");
  }
</script>

<div class="container">
  <div class="controls col">
    <Slider
      bind:value={scale}
      min={-1}
      max={1}
      format={(v) => v.toFixed(2)}
      label="Scale"
    />
  </div>

  <div class="controls col">
    <Button on:click={handleClick} label="Shader" title="Add" />
  </div>

  {#each $planes as plane, index}
    <div class="controls col">
      <Folder title="Wave {index + 1}">
      <Slider bind:value={plane.rotation} label="Rotation" min={0} max={360} step={1} />
      <Slider bind:value={plane.scale} label="Scale" min={0.1} max={5} step={0.1} />
      <Slider bind:value={plane.pointSize} label="Point Size" min={0.1} max={10} step={0.1} />
      <Slider bind:value={plane.waveFreq1} label="Wave 1 Frequency" min={1} max={20} step={0.1} />
      <Slider bind:value={plane.waveAmp1} label="Wave 1 Amplitude" min={0.1} max={2} step={0.1} />
      <Slider bind:value={plane.waveSpeed1} label="Wave 1 Speed" min={0.1} max={5} step={0.1} />
      <Slider bind:value={plane.waveFreq2} label="Wave 2 Frequency" min={1} max={20} step={0.1} />
      <Slider bind:value={plane.waveAmp2} label="Wave 2 Amplitude" min={0.1} max={2} step={0.1} />
      <Slider bind:value={plane.waveSpeed2} label="Wave 2 Speed" min={0.1} max={5} step={0.1} />
      </Folder>
    </div>
  {/each}
</div>

<Canvas>
  <Scene {scale} />
</Canvas>

<style>
  .container {
    display: flex;
    flex-direction: row;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 10;
    padding: 0.5rem;
  }
  .controls {
    width: 30%;
  }
</style>