import {O,R,SC,land,mod,dv,col,paint,LC,cls,rank,ll,hh} from './data.js';
export function drawInv(c,s){const x=c.getContext('2d'),w=c.width,H=c.height,o=O[s.sel],v=s.v;
 const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0d5a90');g.addColorStop(1,'#020a16');x.fillStyle=g;x.fillRect(0,0,w,H);
 const zs=[];for(let z=0;z<=200;z+=5)zs.push(z);const a=zs.map(z=>mod(v,o.x,o.y,z,s.t)),b=zs.map((z,i)=>a[i]-dv(s.sel,v,z,s.t));
 let lo=Math.min(...a,...b),hi=Math.max(...a,...b);const pd=(hi-lo)*.1||.1;lo-=pd;hi+=pd;
 const L=80,Rr=w-40,T=60,B=H-60,X=q=>L+(q-lo)/(hi-lo)*(Rr-L),Y=z=>T+z/200*(B-T);
 x.font='12px system-ui';x.fillStyle='#dbe9fb';x.fillText('Water column at '+ll(o)+' · '+R[v][3]+' · '+hh(s.t),L,30);
 x.strokeStyle='#ffffff30';[0,25,50,75,100,150,200].forEach(z=>{x.beginPath();x.moveTo(L,Y(z));x.lineTo(Rr,Y(z));x.stroke();x.fillStyle='#9fc0e6';x.fillText(z+' m',20,Y(z)+4)});
 [[a,'#4aa8ff'],[b,'#ff5a66']].forEach(q=>{x.beginPath();q[0].forEach((e,i)=>i?x.lineTo(X(e),Y(zs[i])):x.moveTo(X(e),Y(0)));x.strokeStyle=q[1];x.lineWidth=3;x.stroke()});
 const i=s.z/5;x.strokeStyle='#37d6ff';x.lineWidth=1;x.strokeRect(L-6,Y(s.z)-1,Rr-L+12,2);
 [[a[i],'#4aa8ff'],[b[i],'#ff5a66']].forEach(q=>{x.beginPath();x.arc(X(q[0]),Y(s.z),6,0,7);x.fillStyle=q[1];x.fill();x.strokeStyle='#fff';x.stroke()});
 x.fillStyle='#9fc0e6';x.fillText(lo.toFixed(2)+' '+R[v][2],L,H-36);x.fillText(hi.toFixed(2)+' '+R[v][2],Rr-60,H-36);x.fillStyle='#4aa8ff';x.fillText('● Model',L+140,H-36);x.fillStyle='#ff5a66';x.fillText('● Observation',L+210,H-36)}
export function drawDev(c,s){const x=c.getContext('2d'),w=c.width,H=c.height,v=s.v,f=document.createElement('canvas');
 paint(f,140,88,(u,q)=>{const y=1-q;if(land(u,y))return LC;let t=0;O.forEach((k,i)=>{t+=dv(i,v,s.z,s.t)*Math.exp(-((u-k.x)**2+((y-k.y)*.63)**2)/.012)});return col(Math.abs(t)/SC[v]*.9)});
 x.fillStyle='#030a16';x.fillRect(0,0,w,H);const mw=Math.min(w-80,(H-110)/.63),mh=mw*.63,ox=50,oy=20;x.imageSmoothingEnabled=true;x.drawImage(f,ox,oy,mw,mh);
 x.strokeStyle='#37d6ff66';x.strokeRect(ox,oy,mw,mh);x.fillStyle='#9fc0e6';x.font='12px system-ui';[60,70,80,90].forEach(l=>x.fillText(l+'°E',ox+(l-60)/35*mw-12,oy+mh+16));[0,10,20].forEach(l=>x.fillText(l+'°N',8,oy+mh-l/22*mh+4));
 const tp=rank(s).map(a=>a.i);O.forEach((o,i)=>{const px=ox+o.x*mw,py=oy+mh-o.y*mh;x.beginPath();x.arc(px,py,i==s.sel?10:7,0,7);x.strokeStyle=cls(s,i);x.lineWidth=2;x.stroke();const n=tp.indexOf(i);if(n>=0){x.fillStyle=cls(s,i);x.fillText(n+1,px-3,py+4)}});
 [['#ff3b4a','High (>0.5)'],['#ffb020','Medium (0.2–0.5)'],['#5fd0ff','Low (<0.2)']].forEach((q,i)=>{x.fillStyle=q[0];x.fillText('● '+q[1]+' (× variable scale)',ox+i*190,oy+mh+40)});
 return{ox,oy,mw,mh}}
