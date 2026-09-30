// Synthetic demo data. Replace mod()/dv()/O with real API calls (FastAPI + xarray).
export const $=s=>document.querySelector(s),cl=a=>Math.max(0,Math.min(1,a));
export const R={T:[22,30,'°C','Temperature',1],S:[32.5,36,'psu','Salinity',2],C:[0,.8,'m/s','Current velocity',2]},SC={T:1,S:.28,C:.12};
export const O=[[74.8,12.4,.9,'In-situ (CTD)'],[82.1,8.3,.75,'Argo float'],[68.7,15.2,.7,'Argo float'],[76.3,5.6,.4,'Glider'],[90.4,17.9,.35,'Argo float'],[65,8,.15,'Argo float'],[70,4,.2,'Glider'],[85,12,.3,'Argo float'],[88,8,-.3,'CTD'],[78,2.5,.1,'Argo float'],[62,12,-.25,'Argo float'],[91,10,.2,'Glider'],[72,9.5,.5,'CTD'],[84,15.5,.25,'Argo float']].map(a=>({lon:a[0],lat:a[1],a:a[2],s:a[3],x:(a[0]-60)/35,y:a[1]/22}));
export const ip=(p,l)=>{for(let i=1;i<p.length;i++)if(l<=p[i][0]){const a=p[i-1],b=p[i];return a[1]+(b[1]-a[1])*(l-a[0])/(b[0]-a[0])}return p[p.length-1][1]};
export const XW=[[8,77.2],[12,75.4],[16,74],[20,72.9],[22,72.5]],XE=[[8,77.8],[10,79.8],[13,80.3],[16,81.5],[20,86],[22,89]],LC=[74,66,54];
export const land=(x,y)=>{const lo=60+35*x,la=22*y;if(la>=21)return lo>66&&lo<90;if(la>=8&&lo>ip(XW,la)&&lo<ip(XE,la))return true;return lo>92&&la>16};
export const uv=(x,y,z,t)=>{const e=Math.exp(-z/150);return[.45*Math.cos(y*5+1)*e+.15*Math.sin(x*8+t*.2),.35*Math.sin(x*6+.5)*e+.1*Math.cos(y*9)]};
export function mod(v,x,y,z,t){
 if(v=='T'){const s=29.2-.07*Math.abs(y*22-9)+1.1*Math.sin(x*9+t*.12)*Math.cos(y*7)+.5*Math.sin((t-9)*Math.PI/12)*Math.exp(-z/40);return 24.8+(s-24.8)*Math.exp(-z/110)}
 if(v=='S')return 34.8+.8*Math.sin(x*7+y*3)-6*Math.max(0,x-.5)*Math.max(0,y-.3)+.4*(1-Math.exp(-z/100))+.1*Math.sin(t*.3);
 const w=uv(x,y,z,t);return Math.hypot(w[0],w[1])}
export const dv=(i,v,z,t)=>O[i].a*SC[v]*Math.exp(-(((z-50)/90)**2))*(.75+.25*Math.sin(t*.5+i));
export const col=f=>{f=cl(f);return[255*cl(1.5-Math.abs(4*f-3)),255*cl(1.5-Math.abs(4*f-2)),255*Math.max(.3,cl(1.5-Math.abs(4*f-1)))]};
export const cv=(v,q)=>col((q-R[v][0])/(R[v][1]-R[v][0]));
export const ll=o=>o.lat.toFixed(1)+'°N, '+o.lon.toFixed(1)+'°E',hh=t=>{const h=Math.floor(t),m=Math.round((t-h)*60);return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+' UTC'};
export function paint(c,w,h,fn){c.width=w;c.height=h;const x=c.getContext('2d'),d=x.createImageData(w,h);for(let j=0;j<h;j++)for(let i=0;i<w;i++){const r=fn(i/(w-1),j/(h-1)),k=4*(j*w+i);d.data[k]=r[0];d.data[k+1]=r[1];d.data[k+2]=r[2];d.data[k+3]=255}x.putImageData(d,0,0)}

export const fv=(s,n)=>n.toFixed(R[s.v][4]),sg=(s,n)=>(n>=0?'+':'')+fv(s,n);
export const cls=(s,i)=>{const r=Math.abs(dv(i,s.v,s.z,s.t))/SC[s.v];return r>.5?'#ff3b4a':r>.2?'#ffb020':'#5fd0ff'};
export const rank=s=>O.map((o,i)=>({i,d:Math.abs(dv(i,s.v,s.z,s.t))})).filter(a=>a.d/SC[s.v]>=s.md).sort((a,b)=>b.d-a.d).slice(0,5);
export const nc=o=>[0,1,2,3,4,5,6,7].some(a=>land(o.x+Math.cos(a*.785)*.09,o.y+Math.sin(a*.785)*.14));
