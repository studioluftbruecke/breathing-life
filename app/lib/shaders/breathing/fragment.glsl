uniform float uTime;
uniform float uBreathingSpeed;
uniform float uBreathingIntensity;
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
    // Create a wave pattern that affects UV coordinates
  vec2 uvOffset = vec2(sin(vUv.y * 3.0 + uTime * uBreathingSpeed) * uBreathingIntensity, cos(vUv.x * 3.0 + uTime * uBreathingSpeed) * uBreathingIntensity);

    // Apply the wave pattern to create breathing effect
  vec2 distortedUV = vUv + uvOffset;

    // Sample the texture with the distorted UVs
  vec4 color = texture2D(uTexture, distortedUV);

  gl_FragColor = color;
}