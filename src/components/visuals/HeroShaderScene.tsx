"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { MathUtils, ShaderMaterial, Vector2 } from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uPointer;
  varying vec2 vUv;

  float hash(vec2 point) {
    point = fract(point * vec2(123.34, 456.21));
    point += dot(point, point + 45.32);
    return fract(point.x * point.y);
  }

  float noise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);

    float a = hash(cell);
    float b = hash(cell + vec2(1.0, 0.0));
    float c = hash(cell + vec2(0.0, 1.0));
    float d = hash(cell + vec2(1.0, 1.0));

    return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
  }

  float fbm(vec2 point) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(point);
      point = point * 2.03 + vec2(7.13, 3.71);
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 point = vUv * 2.0 - 1.0;
    point.x *= uAspect;

    vec2 center = vec2(0.38 * uAspect, 0.12);
    center += uPointer * vec2(0.075, 0.055);

    vec2 field = point - center;
    float angle = 0.32;
    field = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * field;

    float time = uTime * 0.055;
    float organic = fbm(field * 1.55 + vec2(time, -time * 0.72));
    organic += sin(field.y * 2.6 - time * 1.4) * 0.055;

    float radius = length(field * vec2(0.78, 1.08));
    float contourField = (radius + organic * 0.16) * 9.4;
    float contourDistance = abs(fract(contourField) - 0.5);
    float antialias = fwidth(contourField);
    float contour = 1.0 - smoothstep(
      0.012 + antialias * 0.28,
      0.034 + antialias * 0.86,
      contourDistance
    );

    float envelope = 1.0 - smoothstep(0.28, 1.48, radius);
    float edgeFade = smoothstep(0.0, 0.16, vUv.y) * smoothstep(0.0, 0.14, 1.0 - vUv.y);
    float rightBias = smoothstep(-0.24 * uAspect, 0.22 * uAspect, point.x);
    float shimmer = 0.55 + 0.45 * sin(contourField * 0.82 - time * 3.0);
    float goldMix = smoothstep(0.56, 0.92, organic + shimmer * 0.22);

    vec3 ivory = vec3(0.945, 0.937, 0.914);
    vec3 accent = vec3(0.765, 0.663, 0.475);
    vec3 color = mix(ivory, accent, goldMix * 0.72);

    float halo = (1.0 - smoothstep(0.16, 0.92, radius)) * 0.012;
    float alpha = (contour * 0.12 + halo) * envelope * edgeFade;
    alpha *= mix(0.08, 1.0, rightBias);

    gl_FragColor = vec4(color, alpha);
  }
`;

function ContourField() {
  const material = useRef<ShaderMaterial>(null);
  const targetPointer = useRef(new Vector2());
  const { size } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: size.width / Math.max(size.height, 1) },
      uPointer: { value: new Vector2() },
    }),
    [size.height, size.width],
  );

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      targetPointer.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1),
      );
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  useFrame(({ clock }, delta) => {
    if (!material.current) return;

    material.current.uniforms.uTime.value = clock.elapsedTime;
    const current = material.current.uniforms.uPointer.value as Vector2;
    const ease = 1 - Math.exp(-delta * 2.4);
    current.set(
      MathUtils.lerp(current.x, targetPointer.current.x, ease),
      MathUtils.lerp(current.y, targetPointer.current.y, ease),
    );
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function HeroShaderScene({ onReady }: { onReady: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 1] }}
      gl={{
        alpha: true,
        antialias: false,
        depth: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      onCreated={onReady}
    >
      <ContourField />
    </Canvas>
  );
}
