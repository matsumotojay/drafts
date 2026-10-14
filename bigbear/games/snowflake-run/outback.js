import * as T from './vendor/three.module.js';
// Reference: Subaru's 2023 Outback brochure. Model coordinates: front -Z, rear +Z.
export function buildOutback(){
 const car=new T.Group(),shell=new T.Group();car.add(shell);
 const paint=new T.MeshStandardMaterial({color:0xf5f4ef,roughness:.32,metalness:.18});
 const rubber=new T.MeshStandardMaterial({color:0x20262b,roughness:.9});
 const chrome=new T.MeshStandardMaterial({color:0xbac3c9,roughness:.25,metalness:.75});
 const glass=new T.MeshStandardMaterial({color:0x233943,roughness:.17,metalness:.45});
 const red=new T.MeshStandardMaterial({color:0xa70c20,roughness:.25,emissive:0x490008,emissiveIntensity:.3});
 const clear=new T.MeshStandardMaterial({color:0xe4deda,roughness:.25});
 const seam=new T.MeshBasicMaterial({color:0x697074});
 function mesh(g,m,x=0,y=0,z=0){let o=new T.Mesh(g,m);o.position.set(x,y,z);shell.add(o);return o}
 function box(w,h,d,m,x,y,z){return mesh(new T.BoxGeometry(w,h,d),m,x,y,z)}
 function rounded(w,h,d,r,m,x,y,z){let sh=new T.Shape(),a=-w/2,b=-h/2;sh.moveTo(a+r,b);sh.lineTo(a+w-r,b);sh.quadraticCurveTo(a+w,b,a+w,b+r);sh.lineTo(a+w,b+h-r);sh.quadraticCurveTo(a+w,b+h,a+w-r,b+h);sh.lineTo(a+r,b+h);sh.quadraticCurveTo(a,b+h,a,b+h-r);sh.lineTo(a,b+r);sh.quadraticCurveTo(a,b,a+r,b);let g=new T.ExtrudeGeometry(sh,{depth:d,steps:1,bevelEnabled:true,bevelSize:.035,bevelThickness:.035,bevelSegments:2,curveSegments:8});g.translate(0,0,-d/2);return mesh(g,m,x,y,z)}
 function line(points,m=seam,r=.009){let curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return mesh(new T.TubeGeometry(curve,24,r,5,false),m)}
 // Rounded fenders and a lower wagon body, rather than a rectangular SUV block.
 rounded(1.84,.62,4.55,.2,paint,0,.83,0);
 rounded(1.87,.22,4.31,.09,rubber,0,.53,0);
 rounded(1.7,.12,1.05,.1,paint,0,1.17,-1.7);
 // Cabin side shape: raked windshield and distinct sloped D-pillar / liftgate.
 const side=new T.Shape();side.moveTo(-1.43,1.15);side.lineTo(-.8,1.82);side.quadraticCurveTo(-.7,1.88,-.55,1.88);side.lineTo(1.26,1.86);side.quadraticCurveTo(1.42,1.84,1.5,1.7);side.lineTo(2.1,1.21);side.closePath();let cabin=new T.ExtrudeGeometry(side,{depth:1.55,bevelEnabled:true,bevelSize:.045,bevelThickness:.04,bevelSegments:2});cabin.rotateY(-Math.PI/2);cabin.translate(.775,0,0);mesh(cabin,paint);
 // Side glass, window surrounds and rear quarter window.
 for(const sign of [-1,1]){
   const pts=[[-1.28,1.24],[-.71,1.78],[1.24,1.76],[1.77,1.27]];
   let sh=new T.Shape();pts.forEach((p,i)=>i?sh.lineTo(p[0],p[1]):sh.moveTo(...p));sh.closePath();let g=new T.ShapeGeometry(sh);g.rotateY(-Math.PI/2);const sideGlass=mesh(g,new T.MeshStandardMaterial({color:0x253a43,roughness:.2,side:T.DoubleSide}),sign*.825,0,0);
   line(pts.concat([pts[0]]).map(p=>[sign*.832,p[1],p[0]]),chrome,.018);
   box(.045,.59,.09,rubber,sign*.84,1.49,-.05);box(.045,.49,.1,paint,sign*.84,1.49,.99);
   rounded(.14,.17,.28,.04,paint,sign*1.01,1.3,-.91);
   for(let z of [-.28,.8])box(.04,.045,.24,chrome,sign*.94,1.09,z);
   line([[sign*.95,.68,-.6],[sign*.95,1.16,-.6],[sign*.85,1.28,-.6]],seam,.006);
   line([[sign*.95,.68,.65],[sign*.95,1.16,.65]],seam,.006);
   // Raised black rail feet with silver Touring rail tops.
   for(let z of [-.62,1.12])rounded(.12,.12,.3,.04,rubber,sign*.69,1.95,z);
   line([[sign*.69,1.98,-.79],[sign*.69,2.03,-.4],[sign*.69,2.03,.8],[sign*.69,1.98,1.3]],chrome,.038);
 }
 // Rear liftgate surface: broad white lower hatch, tapered upper corners.
 function rearPatch(points,m,zfun){let sh=new T.Shape();points.forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));sh.closePath();let g=new T.ShapeGeometry(sh,12);let p=g.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,zfun(p.getX(i),p.getY(i)));g.computeVertexNormals();return mesh(g,m)}
 const rearZ=(x,y)=>2.3-(Math.max(0,y-1.16)*.75)-Math.abs(x)*.035;
 rearPatch([[-.84,.66],[-.91,.87],[-.91,1.2],[-.79,1.69],[-.65,1.87],[.65,1.87],[.79,1.69],[.91,1.2],[.91,.87],[.84,.66]],paint,rearZ);
 const window=[[-.73,1.35],[-.7,1.62],[-.59,1.78],[.59,1.78],[.7,1.62],[.73,1.35],[.57,1.31],[-.57,1.31]];
 rearPatch(window,glass,(x,y)=>rearZ(x,y)+.018);
 line(window.concat([window[0]]).map(([x,y])=>[x,y,rearZ(x,y)+.025]),rubber,.015);
 // Roof spoiler with slim integrated brake lamp.
 rounded(1.55,.075,.25,.04,paint,0,1.87,1.79);box(.65,.028,.025,red,0,1.83,1.94);
 line([[-.03,1.34,2.192],[-.34,1.35,2.184]],rubber,.018);
 // Tailgate crease / recessed plate pocket under the central Subaru badge.
 rearPatch([[-.43,.81],[-.46,1.05],[-.35,1.13],[.35,1.13],[.46,1.05],[.43,.81]],new T.MeshStandardMaterial({color:0xd1d4d1,roughness:.45}),(x,y)=>rearZ(x,y)+.012);
 rounded(.56,.22,.015,.025,clear,0,.96,2.32);
 line([[-.78,.74,2.29],[-.74,1.15,2.29],[-.68,1.27,2.23],[.68,1.27,2.23],[.74,1.15,2.29],[.78,.74,2.29]],seam,.006);
 // Sculpted wraparound C-shaped tail lamps, with separate inner liftgate sections.
 for(const sign of [-1,1]){
  const shape=[ [.4,1.23],[.91,1.29],[.93,1.14],[.79,1.04],[.47,1.1] ];
  rearPatch(shape.map(([x,y])=>[x*sign,y]),rubber,(x,y)=>rearZ(x,y)+.042);
  rearPatch([[.43,1.205],[.88,1.255],[.88,1.18],[.76,1.085],[.48,1.13]].map(([x,y])=>[x*sign,y]),red,(x,y)=>rearZ(x,y)+.05);
  rearPatch([[.49,1.175],[.8,1.205],[.77,1.145],[.5,1.15]].map(([x,y])=>[x*sign,y]),clear,(x,y)=>rearZ(x,y)+.06);
  line([[sign*.64,1.24,rearZ(sign*.64,1.24)+.065],[sign*.64,1.1,rearZ(sign*.64,1.1)+.065]],rubber,.012);
 }
 // Dark bumper rises into the lower corners; silver lower protector stays narrow.
 rearPatch([[-.94,.48],[-.96,.72],[-.81,.85],[-.64,.73],[.64,.73],[.81,.85],[.96,.72],[.94,.48]],rubber,()=>2.34);
 rounded(1.22,.09,.06,.035,chrome,0,.48,2.37);
 for(const sign of [-1,1])rounded(.16,.045,.03,.018,red,sign*.81,.65,2.38);
 // Wheels with machined spoke faces, and black arch lips.
 for(const x of [-.94,.94])for(const z of [-1.47,1.4]){
  let wheel=mesh(new T.CylinderGeometry(.39,.39,.24,24),rubber,x,.43,z);wheel.rotation.z=Math.PI/2;
  let rim=mesh(new T.CylinderGeometry(.27,.27,.25,20),chrome,x,.43,z);rim.rotation.z=Math.PI/2;
  let hub=mesh(new T.CylinderGeometry(.07,.07,.27,12),rubber,x,.43,z);hub.rotation.z=Math.PI/2;
  let arch=mesh(new T.TorusGeometry(.42,.06,8,24,Math.PI),rubber,x,.43,z);arch.rotation.y=Math.PI/2;
 }
 // Windshield, grille and narrow headlights for jumps and spins.
 let windshield=box(1.39,.62,.02,glass,0,1.5,-1.1);windshield.rotation.x=-.73;
 rounded(1.13,.34,.04,.1,rubber,0,.88,-2.31);
 for(let y of [.77,.87,.97])box(.95,.018,.045,chrome,0,y,-2.34);
 for(let x of [-.65,.65])rounded(.4,.12,.06,.04,clear,x,1.065,-2.3);
 function label(words,x,y,w,color='#c3c8ca',z=2.34){const cv=document.createElement('canvas');cv.width=512;cv.height=128;const c=cv.getContext('2d');c.font='600 49px Arial';c.textAlign='center';c.fillStyle=color;c.fillText(words,256,80);const tx=new T.CanvasTexture(cv);tx.colorSpace=T.SRGBColorSpace;return mesh(new T.PlaneGeometry(w,w/4),new T.MeshBasicMaterial({map:tx,transparent:true}),x,y,z)}
 label('SUBARU',-.53,.84,.39,'#70777a');label('OUTBACK',.53,.84,.42,'#70777a');label('AWD',-.53,.78,.2,'#70777a');label('NIKK',0,.96,.38,'#29414f',2.335);
 const cv=document.createElement('canvas');cv.width=192;cv.height=96;const c=cv.getContext('2d');c.fillStyle='#aab6bd';c.beginPath();c.ellipse(96,48,92,42,0,0,7);c.fill();c.fillStyle='#173e72';c.beginPath();c.ellipse(96,48,82,33,0,0,7);c.fill();c.fillStyle='white';for(const [x,y,r] of [[55,42,22],[112,27,9],[142,39,9],[122,60,9],[92,65,8],[153,63,8]]){c.beginPath();c.moveTo(x-r,y);c.lineTo(x-2,y-3);c.lineTo(x,y-r*.6);c.lineTo(x+2,y-3);c.lineTo(x+r,y);c.lineTo(x+2,y+3);c.lineTo(x,y+r*.6);c.lineTo(x-2,y+3);c.closePath();c.fill()}const tx=new T.CanvasTexture(cv);tx.colorSpace=T.SRGBColorSpace;mesh(new T.PlaneGeometry(.24,.12),new T.MeshBasicMaterial({map:tx,transparent:true}),0,1.2,2.3);
 return {car,shell};
}
