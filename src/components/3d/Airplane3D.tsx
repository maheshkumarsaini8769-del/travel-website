'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Airplane3D({ radius = 2.15, speed = 0.1 }: { radius?: number; speed?: number }) {
  const group = useRef<THREE.Group>(null)
  const t = useRef(0)

  useFrame((_, delta) => {
    if (!group.current) return
    t.current += delta * speed
    const angle = t.current
    const y = Math.sin(angle * 0.6) * 0.35
    group.current.position.set(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    )
    group.current.rotation.y = -angle + Math.PI / 2
    group.current.rotation.z = 0.25 + Math.sin(angle) * 0.12
  })

  return (
    <group ref={group} scale={0.09}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.5, 1.6, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[2.4, 0.06, 0.55]} />
        <meshStandardMaterial color="#ff8c00" emissive="#b45500" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[1.1, 0.06, 0.5]} />
        <meshStandardMaterial color="#ffb35c" />
      </mesh>
      <pointLight color="#ff8c00" intensity={1.2} distance={3} />
    </group>
  )
}
