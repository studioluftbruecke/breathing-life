// shaders/vertex.glsl
uniform float uTime;
varying vec2 vUv;

void main() {
  vUv = uv;
  
  // Add some wave animation based on time
  vec3 pos = position;
  float wave = sin(pos.x * 2.0 + uTime) * 0.1;
  pos.z += wave; // Moving in z instead of y to distort the texture
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}