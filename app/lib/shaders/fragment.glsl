// shaders/fragment.glsl
uniform float uTime;
uniform sampler2D uTexture;
uniform float filterVar1; // Range 0.0 to 1.0 - Controls color shifting
uniform float filterVar2; // Range 0.0 to 1.0 - Controls pixelation/distortion

varying vec2 vUv;

void main() {
    // Get initial UV coordinates
    vec2 uv = vUv;
    
    // Apply distortion based on filterVar2
    float blockSize = max(0.001, 0.02 * filterVar2);
    vec2 blockifiedUV = floor(uv / blockSize) * blockSize;
    uv = mix(uv, blockifiedUV, filterVar2);
    
    // Sample the texture
    vec4 texColor = texture2D(uTexture, uv);
    
    // Color manipulation based on filterVar1
    vec3 shiftedColor = texColor.rgb;
    
    // Rotate the colors based on filterVar1
    shiftedColor.r = mix(texColor.r, texColor.g, filterVar1 * 0.5);
    shiftedColor.g = mix(texColor.g, texColor.b, filterVar1 * 0.5);
    shiftedColor.b = mix(texColor.b, texColor.r, filterVar1 * 0.5);
    
    // Add some wave distortion
    float wave = sin(uv.y * 10.0 + uTime) * filterVar2 * 0.1;
    shiftedColor += vec3(wave);
    
    // Mix between original and filtered
    vec3 finalColor = mix(texColor.rgb, shiftedColor, filterVar1);
    
    gl_FragColor = vec4(finalColor, texColor.a);
}