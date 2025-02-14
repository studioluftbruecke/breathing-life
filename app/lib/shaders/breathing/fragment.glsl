uniform float uTime;
uniform float uWarpSpeed;
uniform float uWarpIntensity;
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  // Create a wave pattern that affects UV coordinates
  vec2 uvOffset = vec2(sin(vUv.y * 3.0 + uTime * uWarpSpeed) * uWarpIntensity, cos(vUv.x * 3.0 + uTime * uWarpSpeed) * uWarpIntensity);

  // Apply the wave pattern to create breathing effect
  vec2 distortedUV = vUv + uvOffset;

  // Sample the texture with the distorted UVs
  vec4 color = texture2D(uTexture, distortedUV);

  gl_FragColor = color;
}