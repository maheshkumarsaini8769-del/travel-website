'use client'

import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useRouter } from 'next/navigation'

export interface GlobeMarkerData {
  id: string
  name: string
  lat: number
  lon: number
  href: string
}

export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lon + 180) * Math.PI) / 180
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

export default function GlobeMarker({ data, radius }: { data: GlobeMarkerData; radius: number }) {
  const router = useRouter()
  const pos = useMemo(() => latLonToVector3(data.lat, data.lon, radius), [data.lat, data.lon, radius])
  const glowRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = 1 + Math.sin(t * 2 + data.lat) * 0.25
    if (glowRef.current) {
      const s = (hovered ? 1.6 : 1) * pulse
      glowRef.current.scale.setScalar(s)
      ;(glowRef.current.material as THREE.MeshBasicMaterial).opacity = hovered ? 0.85 : 0.45
    }
    if (ringRef.current) {
      const s = (hovered ? 1.9 : 1.35) + ((t * 0.4 + data.lon) % 1)
      ringRef.current.scale.setScalar(s)
      ;(ringRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - s * 0.5)
    }
  })

  return (
    <group position={pos}>
      <mesh
        onClick={() => router.push(data.href)}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#ffa033" />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color="#ff8c00" transparent opacity={0.45} depthWrite={false} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.05, 0.07, 24]} />
        <meshBasicMaterial color="#ffd9a3" transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {hovered ? (
        <Html center distanceFactor={9} style={{ pointerEvents: 'none' }}>
          <div className="whitespace-nowrap rounded-full border border-orange-400/40 bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-orange-300 backdrop-blur-md">
            {data.name}
          </div>
        </Html>
      ) : null}
    </group>
  )
}
