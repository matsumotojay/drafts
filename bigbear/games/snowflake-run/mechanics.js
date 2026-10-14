export const TURN_RADIUS=4;
export function jumpHeight(progress){return Math.sin(Math.max(0,Math.min(1,progress))*Math.PI)*5.2}
export function canCollectFlake(height,progress){return Math.abs(height-(jumpHeight(progress)+1.1))<=1.35}
export function cornerPose(road,progress){const h=road.h,dir=road.dir,t=Math.max(0,Math.min(1,progress)),a=dir*Math.PI/2*t,r=TURN_RADIUS;
 const f0={x:-Math.sin(h),z:-Math.cos(h)},f1={x:-Math.sin(h+dir*Math.PI/2),z:-Math.cos(h+dir*Math.PI/2)};
 const cx=road.x+f0.x*(road.len-r)+f1.x*r,cz=road.z+f0.z*(road.len-r)+f1.z*r;
 const vx=-f1.x*r,vz=-f1.z*r;return{x:cx+vx*Math.cos(a)+vz*Math.sin(a),z:cz-vx*Math.sin(a)+vz*Math.cos(a),yaw:h+a};}

export const TURN_DURATION=.18;
export const TURN_INPUT_DISTANCE=18;
export function turnOutcome(remaining,armed){return remaining>TURN_RADIUS?'approach':armed?'turn':'crash'}

export function itemVisible(item,segment){return Math.abs(item.seg-segment)<=2&&(!item.hit||item.type==='ramp'||item.type==='bear')}

export const RAMP_HALF_LENGTH=4;
export const RAMP_TOP=1.6;
export function rampSurface(distance,center){const p=(distance-(center-RAMP_HALF_LENGTH))/(2*RAMP_HALF_LENGTH);return p>=0&&p<=1?.1+1.5*p:0}
export function crossesRampLip(previous,current,center){const lip=center+RAMP_HALF_LENGTH;return previous<lip&&current>=lip}
export function flightHeight(progress,base=0){return jumpHeight(progress)+Math.max(0,Math.min(1,progress))*base}
export function rampLaunchProgress(previous,current,center,airborne){return !airborne&&crossesRampLip(previous,current,center)?1:null}
