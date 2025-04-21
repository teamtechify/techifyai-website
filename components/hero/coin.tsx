"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

// Define a custom dot matrix shader
const DotMatrixShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2() },
    dotSize: { value: 6.0 },
    time: { value: 0.0 }, // Add time uniform for animation
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float dotSize;
    uniform float time;
    varying vec2 vUv;

    // Simple noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    // Improved noise with interpolation
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      
      // Four corners of a tile
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      
      // Smooth interpolation
      vec2 u = smoothstep(0.0, 1.0, f);
      
      // Mix the four corners
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      // Calculate grid position
      vec2 p = vUv * resolution;
      vec2 grid = floor(p / dotSize) * dotSize + dotSize/2.0;
      vec2 diff = p - grid;
      
      // Sample the texture at the grid center
      vec4 color = texture2D(tDiffuse, grid / resolution);
      
      // Calculate distance from pixel to center of the grid cell
      float dist = length(diff);
      
      // Size of the circle based on the brightness
      float brightness = (color.r + color.g + color.b) / 3.0;
      
      // Add time-based noise for sparkling effect
      float noiseValue = noise(grid * 0.5 + time * 0.2);
      
      // Adjust radius with noise for sparkle effect
      float sparkle = 0.95 + noiseValue * 0.1;
      float radius = (dotSize / 2.0) * (sparkle + brightness * 0.05);
      
      // Create harder edges for circles
      float circle = step(dist, radius);
      
      // Create a color diffusion effect
      vec3 diffusedColor = color.rgb;
      
      // Add subtle color shifts based on time and position
      float hueShift = sin(time * 0.5 + grid.x * 0.01) * 0.1;
      float satShift = cos(time * 0.3 + grid.y * 0.01) * 0.1;
      
      // Apply color variations to add more visual interest
      diffusedColor.r += hueShift * noiseValue * 0.5;
      diffusedColor.g += satShift * noiseValue * 0.5;
      diffusedColor.b += (1.0 - hueShift) * noiseValue * 0.5;
      
      // Normalize colors to prevent oversaturation
      diffusedColor = clamp(diffusedColor, 0.0, 1.0);
      
      // Render circle with diffused color
      gl_FragColor = circle * vec4(diffusedColor, color.a);
    }
  `
};

export const CoinCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  
  // State for UI controls



  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background
    
    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      1,
      3000
    );
    camera.position.z = 5;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;

    // Create ring material - metallic look
    const material = new THREE.MeshStandardMaterial({
      color: 0x333333, // Changed from black to dark gray
      roughness: 0.01, // Decreased to near zero for maximum reflectivity
      metalness: 0.99, // Increased for maximum reflectivity
      side: THREE.DoubleSide,
    });
    
    materialRef.current = material;

    // Create a flat ring shape with thickness
    // Using a custom approach to create a cylinder with a hole
    const outerRadius = 1.2;
    const innerRadius = 0.9;
    const height = 0.25;
    const segments = 96;
    
    // Create a shape (2D) with an outer circle and inner circle hole
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    
    // Create the hole
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    
    // Extrude the 2D shape to create a 3D geometry
    const extrudeSettings = {
      steps: 3,
      depth: height,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 5,
    };
    
    const ringGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Create ring mesh
    const ring = new THREE.Mesh(ringGeometry, material);
    // Rotate it to lie flat
    ring.rotation.x = Math.PI / 2;
    // Then tilt it slightly
    ring.rotation.x += Math.PI / 6;
    scene.add(ring);
    ringRef.current = ring;

    // Add central point light (the light the ring will orbit around)
    const centerLight = new THREE.PointLight(0x00ffff, 30, 20); // Increased intensity and range
    centerLight.position.set(0, 0, 0);
    scene.add(centerLight);
    
 
    
   
    // Add a directional scene light from above
    const sceneLight = new THREE.DirectionalLight(0x8080ff, 8); // Increased intensity
    sceneLight.position.set(0, 5, 3);
    scene.add(sceneLight);

    // Add ambient light for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Increased intensity
    scene.add(ambientLight);

    // Setup post-processing
    const renderModel = new RenderPass(scene, camera);
    const outputPass = new OutputPass();
    
    // Create the dot matrix effect pass
    const dotMatrixPass = new ShaderPass(DotMatrixShader);
    dotMatrixPass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    dotMatrixPass.uniforms.dotSize.value = 6.0;
    
    const composer = new EffectComposer(renderer);
    composer.addPass(renderModel);
    composer.addPass(dotMatrixPass);
    composer.addPass(outputPass);

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      composer.setSize(width, height);
      
      // Update resolution uniform
      dotMatrixPass.uniforms.resolution.value.set(width, height);
    };
    
    window.addEventListener('resize', handleResize);

    // Position the ring at the center
    ring.position.set(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update time uniform for shader animation
      const time = Date.now() * 0.001;
      dotMatrixPass.uniforms.time.value = time;
      
      if (ringRef.current) {
        // Make the ring rotate around its own axis
        ringRef.current.rotation.y -= 0.01;
        // Add a slight wobble for a more interesting effect
        ringRef.current.rotation.x = Math.PI / 6 + Math.sin(time * 0.001) * 0.1;
      }
      

      renderer.clear();
      composer.render();
    };

    animate();

    return () => {
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Effect to update material brightness when brightness state changes
  useEffect(() => {
    if (materialRef.current) {
      // Convert brightness (0-1) to a color value (dark gray to light gray)
      const colorValue = Math.floor(0.7 * 255);
      materialRef.current.color.setRGB(
        colorValue / 255,
        colorValue / 255,
        colorValue / 255
      );
    } 
  },);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block", zIndex: 50}}
      />
      
    
    </>
  );
};
