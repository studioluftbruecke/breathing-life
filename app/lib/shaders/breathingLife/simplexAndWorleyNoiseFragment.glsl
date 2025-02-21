uniform float uTime;
uniform float uSimplexSpeed;
uniform float uWorleySpeed;
uniform float uSimplexIntensity;
uniform float uWorleyIntensity;
uniform float uMixNoise;
uniform float uNoiseScale;
uniform sampler2D uTexture;
varying vec2 vUv;

// Hash function to generate random positions
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

// Worley noise function
float worleyNoise(vec2 p) {
  p *= uNoiseScale;
  vec2 i_st = floor(p);
  vec2 f_st = fract(p);
  float minDist = 1.0;

  // Check neighboring cells
  for(int y = -1; y <= 1; y++) {
    for(int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = hash2(i_st + neighbor);

      // Animate the point
      point = 0.5 + 0.5 * sin(uTime * uWorleySpeed + 6.2831 * point);

      vec2 diff = neighbor + point - f_st;
      float dist = length(diff);
      minDist = min(minDist, dist);
    }
  }
  return minDist;
}

// Improved gradient function
vec2 worleyGradient(vec2 p) {
  float eps = 0.01;
  vec2 dx = vec2(eps, 0.0);
  vec2 dy = vec2(0.0, eps);

  // Calculate gradient using central differences
  float gradX = (worleyNoise(p + dx) - worleyNoise(p - dx)) / (2.0 * eps);
  float gradY = (worleyNoise(p + dy) - worleyNoise(p - dy)) / (2.0 * eps);

  return vec2(gradX, gradY);
}

// Simplex noise function
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
  0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
  -0.577350269189626,  // -1.0 + 2.0 * C.x
  0.024390243902439); // 1.0 / 41.0
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // SIMPLEX NOISE
  float noiseValue = snoise(vUv * uNoiseScale + uTime * uSimplexSpeed);
  vec2 simplexUvOffset = vec2(noiseValue * uSimplexIntensity, noiseValue * uSimplexIntensity);

  // WORLEY NOISE
  // Create more organic movement using both noise and its gradient
  vec2 gradient = worleyGradient(vUv);
  float noise = worleyNoise(vUv);

  // Combine noise and gradient for more natural flow
  vec2 worleyUvOffset = (gradient * noise) * uWorleyIntensity;

  // Add some temporal variation
  worleyUvOffset *= sin(uTime) * 0.5;

  // Mix simplex and worley noise
  vec2 uvOffset = mix(simplexUvOffset, worleyUvOffset, uMixNoise);

  vec2 distortedUV = vUv + uvOffset;
  vec4 color = texture2D(uTexture, distortedUV);
  gl_FragColor = color;
}