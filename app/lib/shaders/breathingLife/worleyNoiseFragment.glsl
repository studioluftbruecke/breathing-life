uniform float uTime;
uniform float uSpeed;
uniform float uIntensity;
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
      point = 0.5 + 0.5 * sin(uTime * uSpeed + 6.2831 * point);

      vec2 diff = neighbor + point - f_st;
      float dist = length(diff);
      minDist = min(minDist, dist);
    }
  }
  return minDist;
}

// Improved gradient function
vec2 worleyGradient(vec2 p) {
  float eps = 0.001;
  vec2 dx = vec2(eps, 0.0);
  vec2 dy = vec2(0.0, eps);

    // Calculate gradient using central differences
  float gradX = (worleyNoise(p + dx) - worleyNoise(p - dx)) / (2.0 * eps);
  float gradY = (worleyNoise(p + dy) - worleyNoise(p - dy)) / (2.0 * eps);

  return vec2(gradX, gradY);
}

void main() {
    // Create more organic movement using both noise and its gradient
  vec2 gradient = worleyGradient(vUv);
  float noise = worleyNoise(vUv);

    // Combine noise and gradient for more natural flow
  vec2 uvOffset = (gradient * noise) * uIntensity;

    // Add some temporal variation
  uvOffset *= sin(uTime * 0.5) * 0.5 + 0.5;

  vec2 distortedUV = vUv + uvOffset;
  vec4 color = texture2D(uTexture, distortedUV);
  gl_FragColor = color;
}