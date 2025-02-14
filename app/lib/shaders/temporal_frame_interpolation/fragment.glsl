uniform sampler2D currentFrameTexture;
uniform sampler2D previousFrameTexture;
uniform sampler2D imageTexture;
uniform float decaySpeed;
uniform float noiseFactor;
uniform float time;
uniform float mixFactor;  // Controls blending between initial image and effect

varying vec2 vUv;

float random(vec2 uv) {
  return fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec4 initialImage = texture2D(imageTexture, vUv);
  vec4 currentFrame = texture2D(currentFrameTexture, vUv);
  vec4 previousFrame = texture2D(previousFrameTexture, vUv);

      // Dynamic decay factor (introduces unpredictable temporal distortions)
  float dynamicDecay = decaySpeed + (random(vUv + time) - 0.5) * noiseFactor;

      // Blending previous frame into current frame with non-linear interpolation
  vec4 blendedFrame = mix(previousFrame, currentFrame, dynamicDecay);

      // Transition from initial image to the decay effect
  vec4 finalColor = mix(initialImage, blendedFrame, mixFactor);

  gl_FragColor = finalColor;
}