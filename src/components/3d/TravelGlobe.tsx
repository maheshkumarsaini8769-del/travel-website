'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import GlobeMarker, { type GlobeMarkerData } from './GlobeMarker'
import TravelRoute from './TravelRoute'
import Airplane3D from './Airplane3D'

interface TravelGlobeProps {
  markers: GlobeMarkerData[]
  routes: { from: [number, number]; to: [number, number] }[]
  particles?: number
  reducedMotion?: boolean
  lightMode?: boolean
}

export const GLOBE_RADIUS = 1.55

export const EARTH_START_Y = -1.378

function GlobeMesh() {
  const texture = useTexture('/images/earth-texture.png')
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS, 96, 96]} />
      <meshStandardMaterial map={texture} roughness={0.85} metalness={0.03} />
    </mesh>
  )
}

function Atmosphere() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.09, 48, 48]} />
        <meshBasicMaterial
          color="#7ab8ff"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.035, 48, 48]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.012, 64, 64]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export default function TravelGlobe({ markers, routes, particles = 600, reducedMotion = false, lightMode = false }: TravelGlobeProps) {
  const spinRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!reducedMotion && spinRef.current) {
      spinRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <group>
      <group rotation={[0.08, EARTH_START_Y, 0.15]}>
        <group ref={spinRef}>
          <GlobeMesh />
          {markers.map((m) => (
            <GlobeMarker key={m.id} data={m} radius={GLOBE_RADIUS} />
          ))}
          {!reducedMotion && !lightMode ? (
            <>
              {routes.map((r, i) => (
                <TravelRoute
                  key={i}
                  from={{ lat: r.from[0], lon: r.from[1] }}
                  to={{ lat: r.to[0], lon: r.to[1] }}
                  radius={GLOBE_RADIUS}
                />
              ))}
            </>
          ) : null}
        </group>
      </group>
      <Atmosphere />
      {!reducedMotion && !lightMode ? <Airplane3D radius={GLOBE_RADIUS * 1.45} speed={0.09} /> : null}
    </group>
  )
}
