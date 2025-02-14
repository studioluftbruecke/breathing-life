uniform float time;
uniform float speed;
uniform float intensity;
uniform float frequency;
uniform float noiseScale;
uniform int effectType;
uniform sampler2D texture1;
varying vec2 vUv;

// Simplex noise function
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

vec2 calculateOffset() {
    vec2 uvOffset = vec2(0.0);
    
    if (effectType == 0) {
        // Breathing wave effect
        uvOffset = vec2(
            sin(vUv.y * frequency + time * speed) * intensity,
            cos(vUv.x * frequency + time * speed) * intensity
        );
    }
    else if (effectType == 1) {
        // Spiral warp
        float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
        float dist = length(vUv - 0.5);
        float spiral = sin(dist * frequency - time * speed) * intensity;
        uvOffset = vec2(
            cos(angle) * spiral,
            sin(angle) * spiral
        );
    }
    else if (effectType == 2) {
        // Noise displacement
        float noiseValue = snoise(vUv * noiseScale + time * speed);
        uvOffset = vec2(
            noiseValue * intensity,
            noiseValue * intensity
        );
    }
    else if (effectType == 3) {
        // Ripple effect
        float dist = length(vUv - 0.5);
        float ripple = sin(dist * frequency - time * speed) * intensity;
        uvOffset = normalize(vUv - 0.5) * ripple;
    }
    else if (effectType == 4) {
        // Kaleidoscope warp
        vec2 center = vUv - 0.5;
        float angle = atan(center.y, center.x);
        float dist = length(center);
        float sector = floor(angle * frequency / 3.14159);
        float sectorAngle = sector * 3.14159 / frequency;
        uvOffset = vec2(
            cos(sectorAngle + time * speed) * dist * intensity,
            sin(sectorAngle + time * speed) * dist * intensity
        );
    }
    
    return uvOffset;
}

void main() {
    vec2 uvOffset = calculateOffset();
    vec2 distortedUV = vUv + uvOffset;
    vec4 color = texture2D(texture1, distortedUV);
    gl_FragColor = color;
}