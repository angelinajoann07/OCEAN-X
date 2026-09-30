import {useEffect,useRef} from 'react';import * as THREE from 'three';
import {O,R,land,uv,mod,dv,cv,paint,LC,cls,ll,sg,cl} from './data.js';
const CY=[[88,9],[87,11],[85.5,13.5],[84,16],[82.5,18.5]],cx=p=>((p[0]-60)/35-.5)*10,cz=p=>(.5-p[1]/22)*7;
export default function Scene({s,onPick,api}){
 const host=useRef(),lab=useRef(),sr=useRef(s),g=useRef({});sr.current=s;
 useEffect(()=>{
  const el=host.current,ren=new THREE.WebGLRenderer({antialias:true,alpha:true}),cvs=ren.domElement;el.prepend(cvs);
  const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,1,.1,100),mk2=()=>document.createElement('canvas');
  const cS=mk2(),cF=mk2(),cR=mk2(),tx=c=>{const t=new THREE.CanvasTexture(c);t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;return t},tS=tx(cS),tF=tx(cF),tR=tx(cR);
  const slice=new THREE.Mesh(new THREE.PlaneGeometry(10,7),new THREE.MeshBasicMaterial({map:tS}));slice.rotation.x=-Math.PI/2;
  const front=new THREE.Mesh(new THREE.PlaneGeometry(10,3),new THREE.MeshBasicMaterial({map:tF,side:2}));front.position.set(0,-1.5,3.5);
  const right=new THREE.Mesh(new THREE.PlaneGeometry(7,3),new THREE.MeshBasicMaterial({map:tR,side:2}));right.rotation.y=Math.PI/2;right.position.set(5,-1.5,0);
  const box=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(10,3,7)),new THREE.LineBasicMaterial({color:0x37d6ff}));box.position.y=-1.5;
  const mk=new THREE.Group();O.forEach((o,i)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.13,14,14),new THREE.MeshBasicMaterial());m.userData.i=i;mk.add(m)});
  const ring=new THREE.Mesh(new THREE.RingGeometry(.22,.3,32),new THREE.MeshBasicMaterial({color:0xffffff,side:2}));ring.rotation.x=-Math.PI/2;
  const N=700,pp=new Float32Array(N*3),st=Array.from({length:N},()=>({x:Math.random(),y:Math.random(),l:Math.random()*150})),pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pp,3));
  const pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0xcff6ff,size:.07,transparent:true,opacity:.9}));pts.frustumCulled=false;
  const cyL=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0xffffff})),cyM=new THREE.Mesh(new THREE.SphereGeometry(.2,14,14),new THREE.MeshBasicMaterial({color:0xff2d55}));
  sc.add(slice,front,right,box,mk,ring,pts,cyL,cyM);g.current={cS,cF,cR,tS,tF,tR,slice,front,right,mk,ring,cyL,cyM};
  let th=.75,ph=1.05,rad=15,dr=null;const tg=new THREE.Vector3(0,-1.2,0);
  const oc=()=>{cam.position.set(tg.x+rad*Math.sin(ph)*Math.sin(th),tg.y+rad*Math.cos(ph),tg.z+rad*Math.sin(ph)*Math.cos(th));cam.lookAt(tg)};
  cvs.onpointerdown=e=>{dr={x:e.clientX,y:e.clientY,mx:0};cvs.setPointerCapture(e.pointerId)};
  cvs.onpointermove=e=>{if(!dr)return;const dx=e.clientX-dr.x,dy=e.clientY-dr.y;dr.mx+=Math.abs(dx)+Math.abs(dy);th-=dx*.006;ph=Math.max(.3,Math.min(1.5,ph-dy*.006));dr.x=e.clientX;dr.y=e.clientY;oc()};
  cvs.onpointerup=e=>{if(dr&&dr.mx<5&&sr.current.obs){const r=cvs.getBoundingClientRect(),rc=new THREE.Raycaster();rc.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),cam);const h=rc.intersectObjects(mk.children);if(h.length)onPick(h[0].object.userData.i)}dr=null};
  cvs.onwheel=e=>{e.preventDefault();rad=Math.max(7,Math.min(26,rad+e.deltaY*.01));oc()};
  const ro=new ResizeObserver(()=>{ren.setSize(el.clientWidth,el.clientHeight);cam.aspect=el.clientWidth/el.clientHeight;cam.updateProjectionMatrix();oc()});ro.observe(el);
  api.current={png:()=>{ren.render(sc,cam);return cvs.toDataURL('image/png')}};
  let raf,last=performance.now();
  const loop=n=>{const s=sr.current,dt=Math.min(.05,(n-last)/1000);last=n;pts.visible=s.part;
   if(s.part){st.forEach((p,i)=>{const w=uv(p.x,p.y,s.z,s.t);p.x+=w[0]*.012*dt*60;p.y+=w[1]*.018*dt*60;p.l--;if(p.l<0||p.x<0||p.x>1||p.y<0||p.y>1||land(p.x,p.y)){p.x=Math.random();p.y=Math.random();p.l=80+Math.random()*120}pp[i*3]=(p.x-.5)*10;pp[i*3+1]=slice.position.y+.05;pp[i*3+2]=(.5-p.y)*7});pg.attributes.position.needsUpdate=true}
   const lb=lab.current;lb.style.display=s.obs?'block':'none';
   if(s.obs){const q=mk.children[s.sel].position.clone().project(cam);lb.style.left=((q.x*.5+.5)*el.clientWidth+12)+'px';lb.style.top=((-q.y*.5+.5)*el.clientHeight-52)+'px';lb.innerHTML='<b style="color:'+cls(s,s.sel)+'">Deviation</b><br>'+ll(O[s.sel])+'<br>'+sg(s,dv(s.sel,s.v,s.z,s.t))+' '+R[s.v][2]}
   ren.render(sc,cam);raf=requestAnimationFrame(loop)};
  raf=requestAnimationFrame(loop);
  return()=>{cancelAnimationFrame(raf);ro.disconnect();ren.dispose();cvs.remove()};
 },[]);
 useEffect(()=>{const G=g.current,v=s.v;
  paint(G.cS,140,100,(u,w)=>land(u,1-w)?LC:cv(v,mod(v,u,1-w,s.z,s.t)));
  paint(G.cF,140,60,(u,w)=>cv(v,mod(v,u,0,w*200,s.t)));
  paint(G.cR,100,60,(u,w)=>land(1,u)?LC:cv(v,mod(v,1,u,w*200,s.t)));
  G.tS.needsUpdate=G.tF.needsUpdate=G.tR.needsUpdate=true;
  const y=-s.z/200*3;G.slice.position.y=y+.005;G.slice.visible=s.slice;G.front.visible=G.right.visible=s.sec;G.mk.visible=G.ring.visible=s.obs;
  O.forEach((o,i)=>{const m=G.mk.children[i];m.position.set((o.x-.5)*10,y+.06,(.5-o.y)*7);m.material.color.set(cls(s,i));m.scale.setScalar(i==s.sel?1.7:1)});
  G.ring.position.copy(G.mk.children[s.sel].position);G.ring.position.y+=.02;
  G.cyL.visible=G.cyM.visible=s.cy;
  if(s.cy){const y2=y+.1;G.cyL.geometry.setFromPoints(CY.map(p=>new THREE.Vector3(cx(p),y2,cz(p))));const f=cl((s.t-6)/12)*(CY.length-1),i=Math.min(CY.length-2,Math.floor(f)),a=CY[i],b=CY[i+1],q=f-i;G.cyM.position.set(cx(a)+(cx(b)-cx(a))*q,y2,cz(a)+(cz(b)-cz(a))*q)}
 },[s.v,s.z,s.t,s.sel,s.obs,s.sec,s.slice,s.cy]);
 return <div ref={host} className="fill"><div id="lab" ref={lab}/></div>;
}
