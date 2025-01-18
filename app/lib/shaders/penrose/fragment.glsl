// shaders/penroseFragment.glsl
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  // Base colors matching the image
  vec3 lightPink = vec3(1.0, 0.7, 0.75);
  vec3 darkPurple = vec3(0.5, 0.3, 0.5);
  
  // Calculate lighting based on surface normal
  vec3 lightDir = normalize(vec3(0.5, 1.0, 0.75));
  float diff = max(dot(vNormal, lightDir), 0.0);
  
  // Mix colors based on height and lighting
  vec3 finalColor = mix(darkPurple, lightPink, diff * 0.5 + 0.5);
  
  gl_FragColor = vec4(finalColor, 1.0);
}