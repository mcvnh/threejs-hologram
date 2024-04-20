uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vec3 normal = normalize(vNormal);
    if (!gl_FrontFacing) {
        normal *= -1.0;
    }

    float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
    stripes = pow(stripes, 3.0);

    // Fresnel
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);

    // Falloff
    float falloff = smoothstep(0.8, 0.0, fresnel);

    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25;
    holographic *= falloff;

    // gl_FragColor = vec4(vec3(1.0), stripes);
    gl_FragColor = vec4(vec3(1.0), holographic);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}