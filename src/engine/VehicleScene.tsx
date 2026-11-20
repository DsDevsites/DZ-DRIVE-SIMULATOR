import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export type CameraMode = 'orbit' | 'chase' | 'cockpit';
type Props = {
 color:string; turbo:boolean; intercooler:boolean; driving:boolean; throttle:number; steer:number; brake:boolean;
 speed:number; tyres:boolean; suspension:boolean; brakes:boolean; exhaust:boolean; cameraMode:CameraMode;
};

function Wheel({x,z,front,tyres,brakes,steer,speed}:{x:number;z:number;front:boolean;tyres:boolean;brakes:boolean;steer:number;speed:number}) {
 const wheel=useRef<THREE.Group>(null);
 useFrame((_,dt)=>{if(!wheel.current)return;wheel.current.rotation.x-=speed/3.6/.34*dt;if(front)wheel.current.rotation.y=THREE.MathUtils.damp(wheel.current.rotation.y,steer*.32,dt,8)});
 return <group ref={wheel} position={[x,.43,z]}>
  <mesh rotation={[0,0,Math.PI/2]} castShadow><cylinderGeometry args={[tyres?.47:.43,tyres?.47:.43,.27,32]}/><meshStandardMaterial color="#080a0d" roughness={.94}/></mesh>
  <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.315,.315,.275,32]}/><meshStandardMaterial color="#aab5c1" metalness={.92} roughness={.2}/></mesh>
  <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.255,.255,.282,32]}/><meshStandardMaterial color="#222b36" metalness={.8} roughness={.3}/></mesh>
  {Array.from({length:10},(_,i)=><mesh key={i} position={[0,0,0]} rotation={[0,0,i*Math.PI/5]}><boxGeometry args={[.045,.47,.045]}/><meshStandardMaterial color="#c1cbd5" metalness={.9} roughness={.2}/></mesh>)}
  <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.075,.075,.29,20]}/><meshStandardMaterial color="#7e8b99" metalness={.9}/></mesh>
  {brakes&&<mesh position={[x>0?-.075:.075,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.24,.24,.035,32]}/><meshStandardMaterial color="#b75a32" metalness={.7} roughness={.35}/></mesh>}
 </group>;
}

function Car({color,turbo,intercooler,driving,throttle,steer,brake,speed,tyres,suspension,brakes,exhaust}:Props) {
 const root=useRef<THREE.Group>(null);
 const bodyY=suspension?.62:.69;
 useFrame((_,dt)=>{if(!root.current)return;root.current.rotation.z=THREE.MathUtils.damp(root.current.rotation.z,-steer*(speed/150)*.075,dt,5);root.current.rotation.y=THREE.MathUtils.damp(root.current.rotation.y,-steer*(speed/200)*.12,dt,4);root.current.position.x=THREE.MathUtils.damp(root.current.position.x,THREE.MathUtils.clamp(root.current.position.x+steer*speed/3.6*dt*.34,-4.35,4.35),dt,7);});
 const paint=useMemo(()=>new THREE.MeshStandardMaterial({color,metalness:.72,roughness:.24}),[color]);
 const glass=new THREE.MeshPhysicalMaterial({color:'#101b28',metalness:.35,roughness:.12,clearcoat:1,clearcoatRoughness:.08});
 const dark=new THREE.MeshStandardMaterial({color:'#111820',metalness:.45,roughness:.42});
 const chrome=new THREE.MeshStandardMaterial({color:'#aeb9c5',metalness:.92,roughness:.18});
 return <group ref={root}>
  <group position={[0,bodyY-.69,0]}>
   <RoundedBox args={[2.02,.48,4.18]} radius={.13} smoothness={4} position={[0,.69,0]} castShadow receiveShadow><primitive object={paint} attach="material"/></RoundedBox>
   <RoundedBox args={[1.88,.31,1.12]} radius={.09} smoothness={3} position={[0,.88,1.48]} castShadow><primitive object={paint} attach="material"/></RoundedBox>
   <RoundedBox args={[1.86,.3,1.04]} radius={.08} smoothness={3} position={[0,.87,-1.5]} castShadow><primitive object={paint} attach="material"/></RoundedBox>
   <RoundedBox args={[1.66,.78,2.08]} radius={.2} smoothness={5} position={[0,1.16,-.23]} castShadow><primitive object={paint} attach="material"/></RoundedBox>
   <RoundedBox args={[1.51,.56,1.82]} radius={.12} smoothness={4} position={[0,1.2,-.2]}><primitive object={glass} attach="material"/></RoundedBox>
   <mesh position={[0,1.59,-.25]} castShadow><boxGeometry args={[1.56,.1,1.35]}/><primitive object={paint} attach="material"/></mesh>
   <mesh position={[0,1.18,.79]} rotation={[-.34,0,0]}><planeGeometry args={[1.46,.55]}/><primitive object={glass} attach="material"/></mesh>
   <mesh position={[0,1.17,-1.19]} rotation={[.3,Math.PI,0]}><planeGeometry args={[1.43,.5]}/><primitive object={glass} attach="material"/></mesh>
   {[-1,1].map(x=><group key={x}>
    <mesh position={[x*.84,1.1,-.15]} rotation={[0,0,x*.08]}><boxGeometry args={[.055,.52,1.72]}/><primitive object={paint} attach="material"/></mesh>
    <mesh position={[x*1.012,1.02,.5]}><boxGeometry args={[.025,.035,.12]}/><primitive object={chrome} attach="material"/></mesh>
    <mesh position={[x*1.08,1.17,.55]} rotation={[0,0,x*.08]}><boxGeometry args={[.22,.12,.3]}/><primitive object={paint} attach="material"/></mesh>
    <mesh position={[x*1.08,1.18,.56]}><boxGeometry args={[.19,.07,.24]}/><primitive object={glass} attach="material"/></mesh>
    <mesh position={[x*1.015,.55,-.05]}><boxGeometry args={[.035,.34,1.65]}/><primitive object={dark} attach="material"/></mesh>
   </group>)}
   <mesh position={[0,.55,2.12]}><boxGeometry args={[1.84,.18,.18]}/><primitive object={dark} attach="material"/></mesh>
   <mesh position={[0,.56,-2.12]}><boxGeometry args={[1.84,.2,.18]}/><primitive object={dark} attach="material"/></mesh>
   <mesh position={[0,.76,2.215]}><boxGeometry args={[.72,.2,.025]}/><meshStandardMaterial color="#080d13" metalness={.3}/></mesh>
   {Array.from({length:7},(_,i)=><mesh key={i} position={[0,.69+i*.023,2.23]}><boxGeometry args={[.65,.009,.012]}/><primitive object={chrome} attach="material"/></mesh>)}
   {[-.69,.69].map(x=><group key={x}>
    <RoundedBox args={[.42,.15,.055]} radius={.045} smoothness={3} position={[x,.82,2.2]}><meshStandardMaterial color="#eaf5ff" emissive="#b8ddff" emissiveIntensity={1.5}/></RoundedBox>
    <RoundedBox args={[.39,.13,.06]} radius={.035} smoothness={3} position={[x,.8,-2.2]}><meshStandardMaterial color="#a30f1d" emissive="#9b0c1a" emissiveIntensity={1.2}/></RoundedBox>
   </group>)}
   {[-1,1].map(x=><group key={x}>
    <mesh position={[x*1.015,.47,.05]}><boxGeometry args={[.08,.16,2.2]}/><primitive object={dark} attach="material"/></mesh>
    <mesh position={[x*1.01,.68,-1.1]}><boxGeometry args={[.08,.05,.48]}/><primitive object={chrome} attach="material"/></mesh>
   </group>)}
   {exhaust&&[-.55,.55].map(x=><mesh key={x} position={[x,.43,-2.22]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.075,.09,.18,16]}/><primitive object={chrome} attach="material"/></mesh>)}
   {intercooler&&<mesh position={[0,.56,2.23]}><boxGeometry args={[.92,.23,.1]}/><meshStandardMaterial color="#b3c3d1" metalness={.9} roughness={.23}/></mesh>}
   {turbo&&<group position={[.72,.98,-1.43]}><mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.15,.15,.16,24]}/><meshStandardMaterial color="#d58a36" metalness={.85}/></mesh><mesh position={[.1,0,0]}><torusGeometry args={[.12,.025,8,20]}/><meshStandardMaterial color="#f1b65f" metalness={.8}/></mesh></group>}
   {[-1,1].map(x=><mesh key={x} position={[x*.7,1.65,-1.05]}><boxGeometry args={[.32,.09,.35]}/><primitive object={paint} attach="material"/></mesh>)}
   {[-1,1].map(x=><mesh key={x} position={[x*.7,1.68,-1.05]}><boxGeometry args={[.035,.12,.38]}/><primitive object={dark} attach="material"/></mesh>)}
   {[-1,1].map(x=><mesh key={x} position={[x*.82,.46,0]}><boxGeometry args={[.18,.13,2.3]}/><primitive object={dark} attach="material"/></mesh>)}
  </group>
  {[-1,1].flatMap(x=>[-1.36,1.36].map(z=><Wheel key={x+'-'+z} x={x*1.01} z={z} front={z>0} tyres={tyres} brakes={brakes} steer={steer} speed={speed}/>))}
  {suspension&&[-1,1].map(x=><mesh key={x} position={[x*.85,.31,0]}><boxGeometry args={[.06,.2,2.1]}/><meshStandardMaterial color="#2f83ff" metalness={.65}/></mesh>)}
 </group>;
}

function Track({speed,driving}:{speed:number;driving:boolean}) {
 const track=useRef<THREE.Group>(null);
 useFrame((_,dt)=>{if(track.current&&driving)track.current.position.z=(track.current.position.z+speed/3.6*dt)%10});
 return <group>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.08,0]} receiveShadow><planeGeometry args={[300,500]}/><meshStandardMaterial color="#171e27" roughness={.88}/></mesh>
  {driving?<group ref={track}>
   <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.025,-180]} receiveShadow><planeGeometry args={[11,420]}/><meshStandardMaterial color="#242a32" roughness={.95}/></mesh>
   {Array.from({length:44},(_,i)=><group key={i} position={[0,0,-i*10]}><mesh position={[0,.012,0]}><boxGeometry args={[.12,.018,4.3]}/><meshStandardMaterial color="#d8dce2" roughness={.7}/></mesh><mesh position={[-5.15,.06,0]}><boxGeometry args={[.35,.12,8]}/><meshStandardMaterial color={i%2?'#d9dce1':'#bd3038'}/></mesh><mesh position={[5.15,.06,0]}><boxGeometry args={[.35,.12,8]}/><meshStandardMaterial color={i%2?'#d9dce1':'#bd3038'}/></mesh></group>)}
   {[-1,1].map(x=><group key={x}><mesh position={[x*5.75,.65,-180]}><boxGeometry args={[.18,1.1,420]}/><meshStandardMaterial color="#7d8b98" metalness={.65}/></mesh>{Array.from({length:42},(_,i)=><mesh key={i} position={[x*5.75,.65,-i*10]}><boxGeometry args={[.24,.14,.2]}/><meshStandardMaterial color="#c4cbd3" metalness={.5}/></mesh>)}</group>)}
  </group>:<><gridHelper args={[40,40,'#263b55','#172333']} position={[0,-.055,0]}/><mesh position={[0,.015,-4]}><boxGeometry args={[.025,.02,16]}/><meshStandardMaterial color="#3a526c"/></mesh><mesh position={[0,.015,4]}><boxGeometry args={[.025,.02,16]}/><meshStandardMaterial color="#3a526c"/></mesh></>}
 </group>;
}

export default function VehicleScene(props:Props) {
 const camPosition=props.cameraMode==='cockpit'?[0,1.38,.32]:props.cameraMode==='chase'?[0,3.05,8.2]:[5,3.2,6.5];
 const target=props.cameraMode==='cockpit'?[0,1.3,18]:[0,.75,0];
 return <Canvas shadows dpr={[1,1.5]} gl={{antialias:true,powerPreference:'high-performance'}} camera={{position:camPosition as [number,number,number],fov:props.cameraMode==='cockpit'?78:42}}>
  <color attach="background" args={['#090e16']}/><fog attach="fog" args={['#090e16',18,85]}/>
  <ambientLight intensity={.5}/><hemisphereLight args={['#c6ddff','#202632',.7]}/>
  <spotLight position={[4,9,6]} angle={.52} penumbra={.7} intensity={145} castShadow shadow-mapSize={[1024,1024]}/>
  <spotLight position={[-5,6,-3]} angle={.65} penumbra={.7} intensity={95} color="#287bff"/>
  <pointLight position={[0,2,-4]} color="#1477ff" intensity={props.driving?4:24}/>
  <Track speed={props.speed} driving={props.driving}/>
  <Car {...props}/>
  {!props.driving&&<><mesh position={[-5,2,-4]}><boxGeometry args={[.16,4,8]}/><meshStandardMaterial color="#202b38" metalness={.55}/></mesh><mesh position={[5,2,-4]}><boxGeometry args={[.16,4,8]}/><meshStandardMaterial color="#202b38" metalness={.55}/></mesh></>}
  <ContactShadows position={[0,-.01,0]} opacity={.5} scale={10} blur={2.5} far={4}/>
  <Environment preset="city"/>
  {props.cameraMode==='orbit'&&!props.driving?<OrbitControls enablePan={false} minDistance={4.2} maxDistance={10.5} minPolarAngle={.3} maxPolarAngle={1.42} target={[0,.75,0]}/>:<PerspectiveCamera makeDefault position={camPosition as [number,number,number]} fov={props.cameraMode==='cockpit'?78:42} />}
 </Canvas>;
}
