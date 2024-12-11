<script lang="ts">
  import { T } from '@threlte/core'
  import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras'
  import ShaderPlane from './ShaderPlane.svelte';
  import { planes } from '../stores/sceneStore';

  export let scale: number;

  $: console.log(scale);
</script>



<T.PerspectiveCamera
  makeDefault
  position={[-10, 10, 10]}
  fov={15}
>
  <OrbitControls
    autoRotate
    enableZoom={false}
    enableDamping
    autoRotateSpeed={0.5}
    target.y={1.5}
  />
</T.PerspectiveCamera>

<T.DirectionalLight
  intensity={0.8}
  position.x={5}
  position.y={10}
/>
<T.AmbientLight intensity={0.2} />

<Grid
  position.y={-0.001}
  cellColor="#ffffff"
  sectionColor="#ffffff"
  sectionThickness={0}
  fadeDistance={25}
  cellSize={2}
  scale={1}
/>

<ContactShadows
  scale={10}
  blur={2}
  far={2.5}
  opacity={0.5}
/>

<Float
  floatIntensity={1}
  floatingRange={[0, 1]}
>
  <T.Group scale={scale}>
    <T.Mesh
      position.y={1.2}
    >
      <T.BoxGeometry />
      <T.MeshStandardMaterial color="#0059BA" />
    </T.Mesh>
    <T.Mesh
      position={[1.2, 1.5, 0.75]}
      rotation.x={5}
      rotation.y={71}
    >
      <T.TorusKnotGeometry args={[0.5, 0.15, 100, 12, 2, 3]} />
      <T.MeshStandardMaterial color="#F85122" />
    </T.Mesh>
    <T.Mesh
      position={[-1.4, 1.5, 0.75]}
      rotation={[-5, 128, 10]}
    >
      <T.IcosahedronGeometry />
      <T.MeshStandardMaterial color="#F8EBCE" />
    </T.Mesh>
  </T.Group>
</Float>

{#each $planes as plane}
  <ShaderPlane 
    rotation={plane.rotation} 
    scale={plane.scale}
    pointSize={plane.pointSize}
    waveFreq1={plane.waveFreq1}
    waveAmp1={plane.waveAmp1}
    waveSpeed1={plane.waveSpeed1}
    waveFreq2={plane.waveFreq2}
    waveAmp2={plane.waveAmp2}
    waveSpeed2={plane.waveSpeed2}
  />
{/each}
