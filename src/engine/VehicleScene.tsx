import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
type Props = { color:string; turbo:boolean; intercooler:boolean; driving:boolean; throttle:number; steer:number; brake:boolean };
function Car({color,turbo,intercooler,driving,throttle,steer,brake}:Props) {
 const root=useRef<THREE.Group>(null);const speed=useRef(0);
 useFrame((_,dt)=>{if(!root.current)return;const d=Math.min(dt,.04);if(driving){speed.current=THREE.MathUtils.damp(speed.current,throttle?Math.max(speed.current,throttle*8):0,d,2.1);if(brake)speed.current=THREE.MathUtils.damp(speed.current,0,d,5);root.current.position.z-=speed.current*d;root.current.rotation.y=THREE.MathUtils.damp(root.current.rotation.y,-steer*.18,d,4)}else root.current.rotation.y+=d*.055});
 const glass='#101c2b';
 return <group ref={root}>
  <mesh position={[0,.72,0]} castShadow><boxGeometry args={[2.05,.55,4.05]}/><meshStandardMaterial color={color} metalness={.72} roughness={.24}/></mesh>
  <mesh position={[0,1.16,-.35]} castShadow><boxGeometry args={[1.72,.75,2.12]}/><meshStandardMaterial color={color} metalness={.65} roughness={.22}/></mesh>
  <mesh position={[0,1.2,-.33]}><boxGeometry args={[1.62,.61,1.98]}/><meshStandardMaterial color={glass} metalness={.5} roughness={.16}/></mesh>
  <mesh position={[0,.77,2.02]}><boxGeometry args={[1.8,.19,.12]}/><meshStandardMaterial color="#111820"/></mesh>
  <mesh position={[0,.76,-2.02]}><boxGeometry args={[1.8,.18,.12]}/><meshStandardMaterial color="#111820"/></mesh>
  {[-1,1].map(x=>[-1.35,1.35].map(z=><group key={x+'-'+z} position={[x*1.02,.48,z]}><mesh rotation={[0,0,Math.PI/2]} castShadow><cylinderGeometry args={[.43,.43,.24,32]}/><meshStandardMaterial color="#090b0e" roughness={.88}/></mesh><mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.25,.25,.25,24]}/><meshStandardMaterial color="#8c9aa8" metalness={.85} roughness={.22}/></mesh><mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.11,.11,.26,20]}/><meshStandardMaterial color="#202b37" metalness={.6}/></mesh></group>))}
  {[-.68,.68].map(x=><mesh key={x} position={[x,.76,2.08]}><boxGeometry args={[.48,.16,.035]}/><meshStandardMaterial color="#e9f4ff" emissive="#9ecfff" emissiveIntensity={1.6}/></mesh>)}
  {[-.68,.68].map(x=><mesh key={x} position={[x,.76,-2.08]}><boxGeometry args={[.45,.16,.035]}/><meshStandardMaterial color="#a91420" emissive="#8d0711" emissiveIntensity={.8}/></mesh>)}
  {intercooler&&<mesh position={[0,.55,2.09]}><boxGeometry args={[.85,.22,.08]}/><meshStandardMaterial color="#aebbc7" metalness={.85} roughness={.25}/></mesh>}
  {turbo&&<mesh position={[.72,.92,-1.5]}><cylinderGeometry args={[.17,.17,.16,20]}/><meshStandardMaterial color="#d58a36" metalness={.8}/></mesh>}
  <mesh position={[0,.39,0]}><boxGeometry args={[1.5,.08,2.5]}/><meshStandardMaterial color="#111820"/></mesh>
 </group>
}
export default function VehicleScene(props:Props){return <Canvas shadows dpr={[1,1.6]} gl={{antialias:true,powerPreference:'high-performance'}}><PerspectiveCamera makeDefault position={[5,3.2,6.5]} fov={42}/><color attach="background" args={['#090e16']}/><fog attach="fog" args={['#090e16',12,28]}/><ambientLight intensity={.55}/><spotLight position={[4,8,5]} angle={.55} penumbra={.7} intensity={170} castShadow/><pointLight position={[0,2,-4]} color="#1477ff" intensity={28}/><mesh rotation={[-Math.PI/2,0,0]} position={[0,-.04,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color="#171e27" metalness={.58} roughness={.34}/></mesh><gridHelper args={[30,30,'#263b55','#172333']} position={[0,.005,0]}/><Car {...props}/><ContactShadows position={[0,0,0]} opacity={.55} scale={9} blur={2.5} far={4}/><Environment preset="city"/><OrbitControls enabled={!props.driving} enablePan={false} minDistance={4.5} maxDistance={11} minPolarAngle={.35} maxPolarAngle={1.35} target={[0,.7,0]}/></Canvas>}
