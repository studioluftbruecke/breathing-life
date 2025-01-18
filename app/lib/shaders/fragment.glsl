// shaders/fragment.glsl
uniform float uTime;
uniform sampler2D uTexture;
uniform float uIntensity;
varying vec2 vUv;

void main() {
  // Create animated UVs
  vec2 uv = vUv;
  uv.x += sin(uv.y * 10.0 + uTime * 0.5) * 0.1 * uIntensity;
  
  // Sample texture with distorted UVs
  vec4 texture = texture2D(uTexture, uv);
  
  // Add time-based color tinting
  vec3 tint = 0.5 + 0.5 * cos(uTime + vec3(0,2,4));
  
  // Mix texture with effects
  vec3 final = mix(texture.rgb, tint, 0.2 * uIntensity);
  
  gl_FragColor = vec4(final, texture.a);
}