'use client'

import { useMemo } from 'react'
import { QuadraticBezierLine } from '@react-three/drei'
import * as THREE from 'three'
import { latLonToVector3 } from './GlobeMarker'

interface TravelRouteProps {
  from: { lat: number; lon: number }
  to: { lat: number; lon: number }
  radius: number
  color?: string
}

export default function TravelRoute({ from, to, radius, color = '#ffa033' }: TravelRouteProps) {
  const start = useMemo(() => latLonToVector3(from.lat, from.lon, radius), [from.lat, from.lon, radius])
  const end = useMemo(() => latLonToVector3(to.lat, to.lon, radius), [to.lat, to.lon, radius])
  const mid = useMemo(() => {
    const m = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(radius * 1.35)
    return m
  }, [start, end, radius])

  return (
    <QuadraticBezierLine
      start={start}
      end={end}
      mid={mid}
      color={color}
      lineWidth={0.6}
      transparent
      opacity={0.35}
      depthWrite={false}
    />
  )
}
