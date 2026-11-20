export type DriveTelemetry = { speedKmh:number; rpm:number; gear:number };
const GEAR_LIMITS = [0,42,76,112,150,220];
export function stepDrive(speedKmh:number,throttle:number,brake:boolean,topSpeed:number,grip:number,dt:number):DriveTelemetry {
 const traction=Math.min(1.15,Math.max(.8,grip/.78));
 const acceleration=throttle*(20+Math.min(8,topSpeed/55))*traction;
 const rollingResistance=speedKmh*.02;
 const aerodynamicDrag=speedKmh*speedKmh*.0003;
 const braking=brake?42:0;
 const speed=Math.max(0,Math.min(topSpeed,speedKmh+(acceleration-rollingResistance-aerodynamicDrag-braking)*dt));
 const gear=speed<GEAR_LIMITS[1]?1:speed<GEAR_LIMITS[2]?2:speed<GEAR_LIMITS[3]?3:speed<GEAR_LIMITS[4]?4:5;
 const low=GEAR_LIMITS[gear-1],high=GEAR_LIMITS[gear];
 const ratio=Math.max(0,Math.min(1,(speed-low)/(high-low)));
 const rpm=Math.round(900+ratio*6100+(throttle&&speed<8?450:0));
 return {speedKmh:+speed.toFixed(1),rpm:Math.min(7200,rpm),gear};
}
