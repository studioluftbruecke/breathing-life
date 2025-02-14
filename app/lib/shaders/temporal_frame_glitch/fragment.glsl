uniform sampler2D currentFrameTexture;
uniform sampler2D previousFrameTexture;
uniform sampler2D imageTexture;
uniform float decaySpeed;
uniform float noiseFactor;
uniform float time;
uniform float mixFactor;
uniform float glitchIntensity;  // Controls glitch severity

varying vec2 vUv;

  // Pseudo-random generator
float random(vec2 uv) {
  return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

  // Glitch offset function
vec2 glitchOffset(vec2 uv, float strength) {
  float glitch = step(0.98, random(vec2(time, uv.y))); // 2% chance of glitch per row
  float distortion = strength * (random(uv) - 0.5);
  return uv + vec2(glitch * distortion, 0.0);  // Horizontal shift
}

void main() {
  vec4 initialImage = texture2D(imageTexture, vUv);
  vec4 currentFrame = texture2D(currentFrameTexture, glitchOffset(vUv, glitchIntensity));
  vec4 previousFrame = texture2D(previousFrameTexture, vUv);

      // Dynamic decay factor (introduces unpredictable temporal distortions)
  float dynamicDecay = decaySpeed + (random(vUv + time) - 0.5) * noiseFactor;

      // Blending previous frame into current frame with non-linear interpolation
  vec4 blendedFrame = mix(previousFrame, currentFrame, dynamicDecay);

      // Color channel glitching (RGB shift effect)
  float shift = glitchIntensity * (random(vUv + time) - 0.5) * 0.01;
  vec4 glitchColor = vec4(texture2D(currentFrameTexture, vUv + vec2(shift, 0.0)).r, texture2D(currentFrameTexture, vUv - vec2(shift, 0.0)).g, texture2D(currentFrameTexture, vUv + vec2(0.0, shift)).b, 1.0);

      // Mix glitch effect with blended frame
  vec4 glitchBlend = mix(blendedFrame, glitchColor, glitchIntensity);

      // Transition from initial image to the decay effect with glitching
  vec4 finalColor = mix(initialImage, glitchBlend, mixFactor);

  gl_FragColor = finalColor;
}
