uniform float time;
uniform sampler2D imageTexture;
uniform float uWaveAmplitude;
uniform float uShiftAmplitude;
uniform float uShiftOffset;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float wave = sin(uv.y * 10.0 + time) * uWaveAmplitude;
  uv.x += wave;
  vec4 texColor = texture2D(imageTexture, uv);
  float shift = sin(time) * uShiftAmplitude + uShiftOffset;
  texColor.rgb = mix(texColor.rgb, texColor.bgr, shift);
  gl_FragColor = texColor;
}