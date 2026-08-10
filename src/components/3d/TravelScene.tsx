'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import TravelGlobe, { GLOBE_RADIUS } from './TravelGlobe'
import TravelParticles from './TravelParticles'
import type { GlobeMarkerData } from './GlobeMarker'

function SoftGlow({ color = '#ff8c00' }: { color?: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    grad.addColorStop(0, 'rgba(255, 160, 60, 0.9)')
    grad.addColorStop(0.4, 'rgba(255, 140, 0, 0.35)')
    grad.addColorStop(1, 'rgba(255, 140, 0, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 256, 256)
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [])

  useFrame(() => {
    texture.needsUpdate = true
  })

  return (
    <sprite scale={[6.5, 6.5, 1]} position={[0, 0, -1.2]}>
      <spriteMaterial map={texture} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} color={color} />
    </sprite>
  )
}

function CameraRig() {
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

  useFrame((state, delta) => {
    if (isTouch) return
    const { camera, pointer } = state
    const targetX = pointer.x * 0.55
    const targetY = pointer.y * 0.35
    const k = 1 - Math.pow(0.001, delta)
    camera.position.x += (targetX - camera.position.x) * k
    camera.position.y += (targetY - camera.position.y) * k
    camera.lookAt(0, 0, 0)
  })
  return null
}

export const heroMarkers: GlobeMarkerData[] = [
  { id: 'rajasthan', name: 'Rajasthan', lat: 26.92, lon: 75.79, href: '/destinations/jaipur' },
  { id: 'kashmir', name: 'Kashmir', lat: 34.08, lon: 74.79, href: '/destinations/kashmir' },
  { id: 'goa', name: 'Goa', lat: 15.49, lon: 73.82, href: '/destinations/goa' },
  { id: 'dubai', name: 'Dubai', lat: 25.2, lon: 55.27, href: '/destinations/dubai' },
  { id: 'india', name: 'India', lat: 28.61, lon: 77.2, href: '/destinations/delhi' },
]

export const heroRoutes: { from: [number, number]; to: [number, number] }[] = [
  { from: [28.61, 77.2], to: [25.2, 55.27] },
  { from: [26.92, 75.79], to: [15.49, 73.82] },
  { from: [28.61, 77.2], to: [34.08, 74.79] },
]

export default function TravelScene({ particles = 600 }: { particles?: number }) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [lightMode, setLightMode] = useState(false)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      setSupported(!!gl)
    } catch {
      setSupported(false)
    }
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const nav = navigator as Navigator & { deviceMemory?: number }
    const touch = window.matchMedia('(pointer: coarse)').matches
    const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4
    const lowMem = (nav.deviceMemory ?? 8) <= 4
    setLightMode(touch || lowCores || lowMem)
  }, [])

  if (supported === false) return null

  return (
    <div className="h-full w-full" aria-hidden="true">
      {supported === null ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-500" />
        </div>
      ) : (
        <Canvas
          camera={{ position: [0, 0, 4.6], fov: 45 }}
          dpr={lightMode ? [1, 1.25] : [1, 1.75]}
          gl={{
            antialias: !lightMode,
            alpha: true,
            powerPreference: lightMode ? 'default' : 'high-performance',
          }}
        >
          <ambientLight intensity={0.55} />
          <directionalLight position={[4, 5, 6]} intensity={1.1} />
          <pointLight position={[-5, -2, -4]} color="#ff8c00" intensity={1.4} />
          <SoftGlow />
          <Suspense fallback={null}>
            <TravelGlobe
              markers={heroMarkers}
              routes={heroRoutes}
              particles={particles}
              reducedMotion={reducedMotion || lightMode}
            />
          </Suspense>
          <TravelParticles count={lightMode ? Math.min(particles, 220) : particles} />
          <CameraRig />
        </Canvas>
      )}
    </div>
  )
}
