<script lang="ts">
  import { T } from '@threlte/core';
  import * as THREE from 'three';
  import { onMount } from 'svelte';

  export let rotation = 0;
  export let scale = 1;
  export let pointSize = 2.0;
  export let waveFreq1 = 1.0;
  export let waveAmp1 = 1.0;
  export let waveSpeed1 = 1.0;
  export let waveFreq2 = 1.0;
  export let waveAmp2 = 1.0;
  export let waveSpeed2 = 1.0;

  let clock = new THREE.Clock();
  let uniforms = {
    u_time: { value: 0 },
    u_pointsize: { value: pointSize },
    u_noise_amp_1: { value: waveAmp1 },
    u_noise_freq_1: { value: waveFreq1 },
    u_spd_modifier_1: { value: waveSpeed1 },
    u_noise_amp_2: { value: waveAmp2 },
    u_noise_freq_2: { value: waveFreq2 },
    u_spd_modifier_2: { value: waveSpeed2 },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  };

  $: {
    uniforms.u_pointsize.value = pointSize;
    uniforms.u_noise_amp_1.value = waveAmp1;
    uniforms.u_noise_freq_1.value = waveFreq1;
    uniforms.u_spd_modifier_1.value = waveSpeed1;
    uniforms.u_noise_amp_2.value = waveAmp2;
    uniforms.u_noise_freq_2.value = waveFreq2;
    uniforms.u_spd_modifier_2.value = waveSpeed2;
  }

  const vertexShader = `
    #define PI 3.14159265359

    uniform float u_time;
    uniform float u_pointsize;
    uniform float u_noise_amp_1;
    uniform float u_noise_freq_1;
    uniform float u_spd_modifier_1;
    uniform float u_noise_amp_2;
    uniform float u_noise_freq_2;
    uniform float u_spd_modifier_2;

    // 2D Random
    float random (in vec2 st) {
        return fract(sin(dot(st.xy,
                            vec2(12.9898,78.233)))
                    * 43758.5453123);
    }

    // 2D Noise based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        // Smooth Interpolation

        // Cubic Hermine Curve.  Same as SmoothStep()
        vec2 u = f*f*(3.0-2.0*f);
        // u = smoothstep(0.,1.,f);

        // Mix 4 corners percentages
        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    mat2 rotate2d(float angle){
        return mat2(cos(angle),-sin(angle),
                  sin(angle),cos(angle));
    }

    void main() {
      gl_PointSize = u_pointsize;

      vec3 pos = position;
      pos.z += noise(pos.xy * u_noise_freq_1 + u_time * u_spd_modifier_1) * u_noise_amp_1;
      pos.z += noise(rotate2d(PI / 4.) * pos.yx * u_noise_freq_2 - u_time * u_spd_modifier_2 * 0.6) * u_noise_amp_2;

      vec4 mvm = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvm;
    }
  `;

  const fragmentShader = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    #define PI 3.14159265359
    #define TWO_PI 6.28318530718
    
    uniform vec2 u_resolution;

    void main() {
      vec2 st = gl_FragCoord.xy/u_resolution.xy;
      gl_FragColor = vec4(vec3(0.0, st),1.0);
    }
  `;

  let material;
  onMount(() => {
    const animate = () => {
      if (material) {
        uniforms.u_time.value = clock.getElapsedTime();
      }
      requestAnimationFrame(animate);
    };
    animate();
  });
</script>

<T.Points rotation={[-Math.PI / 2, (rotation * Math.PI) / 180, 0]} position={[0, 0, 0]} scale={[scale, scale, scale]}>
  <T.PlaneGeometry args={[5, 5, 64, 64]} />
  <T.ShaderMaterial
    bind:ref={material}
    vertexShader={vertexShader}
    fragmentShader={fragmentShader}
    uniforms={uniforms}
    transparent={true}
    depthWrite={false}
    sizeAttenuation={true}
  />
</T.Points>
