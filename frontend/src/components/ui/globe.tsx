"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";

interface Point {
    order: number;
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    arcAlt: number;
    color: string;
    radius?: number;
    progress?: number;
}

interface GlobeConfig {
    pointSize: number;
    globeColor: string;
    showAtmosphere: boolean;
    atmosphereColor: string;
    atmosphereAltitude: number;
    emissive: string;
    emissiveIntensity: number;
    shininess: number;
    polygonColor: string;
    ambientLight: string;
    directionalLeftLight: string;
    directionalTopLight: string;
    pointLight: string;
    arcTime: number;
    arcLength: number;
    rings: number;
    maxRings: number;
    initialPosition: { lat: number; lng: number };
    autoRotate: boolean;
    autoRotateSpeed: number;
}

const RING_PROPAGATION_SPEED = 3;
const NUMBER_OF_RINGS = 3;

export function World({ data, globeConfig }: { data: Point[]; globeConfig: GlobeConfig }) {
    const pointsMaterialRef = useRef<THREE.PointsMaterial>(null);
    const groupRef = useRef<THREE.Group>(null);
    const globeRef = useRef<THREE.Mesh>(null);

    const [globeData, setGlobeData] = React.useState<Point[]>([]);
    const [ringData, setRingData] = React.useState<Point[]>([]);

    React.useEffect(() => {
        setGlobeData(data);
    }, [data]);

    useFrame(({ clock, camera }) => {
        if (pointsMaterialRef.current) {
            pointsMaterialRef.current.size = globeConfig.pointSize / 30;
        }
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.005;
        }
        if (globeRef.current) {
            globeRef.current.rotation.y += 0.005;
        }

        const time = Date.now() * 0.001;
        const rings = [];

        for (let i = 0; i < NUMBER_OF_RINGS; i++) {
            const ring = globeData[i % globeData.length];
            if (ring) {
                const ringAge = (time - ring.order * RING_PROPAGATION_SPEED) % globeConfig.arcTime;
                const ringProgress = ringAge / globeConfig.arcTime;
                const ringRadius = ringProgress * globeConfig.arcLength;

                rings.push({
                    ...ring,
                    progress: ringProgress,
                    radius: ringRadius,
                });
            }
        }

        setRingData(rings);
    });

    // Generate continent points
    const continentPoints = useMemo(() => {
        const points = [];
        // Major cities/continents as points
        const cities = [
            { lat: 40.7128, lng: -74.0060, name: "New York" },
            { lat: 51.5074, lng: -0.1278, name: "London" },
            { lat: 35.6762, lng: 139.6503, name: "Tokyo" },
            { lat: 22.3193, lng: 114.1694, name: "Hong Kong" },
            { lat: -33.8688, lng: 151.2093, name: "Sydney" },
            { lat: -22.9068, lng: -43.1729, name: "Rio" },
            { lat: 28.6139, lng: 77.2090, name: "Delhi" },
            { lat: 55.7558, lng: 37.6176, name: "Moscow" },
            { lat: 31.2304, lng: 121.4737, name: "Shanghai" },
            { lat: 19.0760, lng: 72.8777, name: "Mumbai" },
            { lat: 25.2048, lng: 55.2708, name: "Dubai" },
            { lat: 1.3521, lng: 103.8198, name: "Singapore" },
        ];

        cities.forEach(city => {
            const phi = (90 - city.lat) * (Math.PI / 180);
            const theta = (city.lng + 180) * (Math.PI / 180);
            const x = -(Math.sin(phi) * Math.cos(theta));
            const z = Math.sin(phi) * Math.sin(theta);
            const y = Math.cos(phi);

            points.push(new THREE.Vector3(x, y, z));
        });

        return points;
    }, []);

    return (
        <>
            <group ref={groupRef}>
                {/* Continent points */}
                <points>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={continentPoints.length}
                            array={new Float32Array(continentPoints.flatMap(p => [p.x, p.y, p.z]))}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        ref={pointsMaterialRef}
                        size={0.02}
                        color="#ffffff"
                        sizeAttenuation={true}
                    />
                </points>

                {/* Arc lines */}
                {globeData.map((point, index) => {
                    const startLat = point.startLat;
                    const startLng = point.startLng;
                    const endLat = point.endLat;
                    const endLng = point.endLng;

                    const startPhi = (90 - startLat) * (Math.PI / 180);
                    const startTheta = (startLng + 180) * (Math.PI / 180);
                    const startX = -(Math.sin(startPhi) * Math.cos(startTheta));
                    const startZ = Math.sin(startPhi) * Math.sin(startTheta);
                    const startY = Math.cos(startPhi);

                    const endPhi = (90 - endLat) * (Math.PI / 180);
                    const endTheta = (endLng + 180) * (Math.PI / 180);
                    const endX = -(Math.sin(endPhi) * Math.cos(endTheta));
                    const endZ = Math.sin(endPhi) * Math.sin(endTheta);
                    const endY = Math.cos(endPhi);

                    // Create arc curve
                    const curve = new THREE.CubicBezierCurve3(
                        new THREE.Vector3(startX, startY, startZ),
                        new THREE.Vector3(startX, startY + point.arcAlt, startZ),
                        new THREE.Vector3(endX, endY + point.arcAlt, endZ),
                        new THREE.Vector3(endX, endY, endZ)
                    );

                    const points = curve.getPoints(50);
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);

                    return (
                        <primitive key={index} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: point.color, transparent: true, opacity: 0.6 }))} />
                    );
                })}

                {/* Ring effects */}
                <group>
                    {ringData.map((ring, index) => {
                        const lat = ring.startLat;
                        const lng = ring.startLng;
                        const phi = (90 - lat) * (Math.PI / 180);
                        const theta = (lng + 180) * (Math.PI / 180);
                        const x = -(Math.sin(phi) * Math.cos(theta));
                        const z = Math.sin(phi) * Math.sin(theta);
                        const y = Math.cos(phi);

                        return (
                            <mesh key={index} position={[x, y, z]}>
                                <sphereGeometry args={[ring.radius, 16, 16]} />
                                <meshBasicMaterial color={ring.color} transparent opacity={1 - ring.progress} />
                            </mesh>
                        );
                    })}
                </group>
            </group>
            <mesh ref={globeRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    color={globeConfig.globeColor}
                    emissive={globeConfig.emissive}
                    emissiveIntensity={globeConfig.emissiveIntensity}
                    roughness={0.8}
                    metalness={0.2}
                    transparent
                    opacity={0.3}
                />
            </mesh>
            {globeConfig.showAtmosphere && (
                <mesh scale={[1.1, 1.1, 1.1]}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshStandardMaterial
                        color={globeConfig.atmosphereColor}
                        emissive={globeConfig.atmosphereColor}
                        emissiveIntensity={0.1}
                        roughness={0.1}
                        metalness={0.1}
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            )}
        </>
    );
}

export function Globe({ data, globeConfig }: { data: Point[]; globeConfig: GlobeConfig }) {
    return (
        <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
            <ambientLight intensity={0.1} color={globeConfig.ambientLight} />
            <directionalLight
                position={[400, 400, 400]}
                intensity={0.6}
                color={globeConfig.directionalLeftLight}
            />
            <directionalLight
                position={[-400, 100, 400]}
                intensity={0.6}
                color={globeConfig.directionalTopLight}
            />
            <pointLight
                position={[-200, 500, 200]}
                intensity={0.8}
                color={globeConfig.pointLight}
            />
            <World data={data} globeConfig={globeConfig} />
        </Canvas>
    );
} 