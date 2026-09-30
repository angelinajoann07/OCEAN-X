import {useState,useEffect,useRef} from 'react';
import Scene from './Scene.jsx';
import {drawInv,drawDev} from './draw.js';
import {O,R,col,ll,hh,mod,dv,rank,nc,fv,sg,SC} from './data.js';
const K=({r})=><div className="k">{r.flatMap(([a,b],i)=>[<span key={'a'+i}>{a}</span>,<b key={'b'+i}>{b}</b>])}</div>;
function Cv({draw,s,onClick}){const r=useRef(),[n,setN]=useState(0);
 useEffect(()=>{const ro=new ResizeObserver(()=>setN(k=>k+1));ro.observe(r.current.parentNode);return()=>ro.disconnect()},[]);
 useEffect(()=>{const c=r.current,p=c.parentNode;c.width=p.clientWidth;c.height=p.clientHeight;c._g=draw(c,s)},[s,n]);
 return <canvas ref={r} className="fill" onClick={e=>onClick&&onClick(e,r.current._g)}/>}
function Right({s,set}){
 const o=O[s.sel],v=s.v,r=R[v],m=mod(v,o.x,o.y,s.z,s.t),d=dv(s.sel,v,s.z,s.t),u=' '+r[2],F=n=>fv(s,n),G=n=>sg(s,n);
 const head=[['Location',ll(o)],['Depth',s.z+' m'],['Time',hh(s.t)],['Variable',r[3]],['Source',o.s]];
 if(s.view==='ocean'){
  const a=[],c=[];for(let t=6;t<=18;t++){const q=mod(v,o.x,o.y,t===0?0:s.z,t);a.push(q);c.push(q-dv(s.sel,v,s.z,t))}
  const lo=Math.min(...a,...c),hi=Math.max(...a,...c),f=z=>z.map((q,i)=>(i*20+10)+','+(54-(q-lo)/(hi-lo||1)*48)).join(' ');
  return <><h3>Model–observation<span className="tag">Deviation</span></h3><K r={head}/>
  <button className="go" onClick={()=>set({view:'inv'})}>Investigate this deviation</button>
  <h3>Comparison</h3><K r={[['Model',F(m)+u],['Observed',F(m-d)+u],['Difference',G(d)+u]]}/>
  <svg viewBox="0 0 270 60"><polyline points={f(a)} fill="none" stroke="#4aa8ff" strokeWidth="2"/><polyline points={f(c)} fill="none" stroke="#ff5a66" strokeWidth="2"/></svg>
  <p className="note"><span style={{color:'#4aa8ff'}}>Model</span> · <span style={{color:'#ff5a66'}}>Observation</span>, 06:00–18:00 UTC</p>
  <h3>Investigation context</h3><p className="note">Model and observation differ at this location. A deviation flags a region to investigate, not an automatic model failure.</p></>}
 if(s.view==='inv'){
  const zs=[0,25,50,75,100,150,200],nz=zs.reduce((p,q)=>Math.abs(q-s.z)<Math.abs(p-s.z)?q:p),ds=[];for(let z=0;z<=200;z+=10)ds.push(dv(s.sel,v,z,s.t));
  const bi=ds.reduce((a,b)=>a+b,0)/ds.length,rm=Math.sqrt(ds.reduce((a,b)=>a+b*b,0)/ds.length),gx=Math.abs(o.lon*4-Math.round(o.lon*4))/4*111,gy=Math.abs(o.lat*4-Math.round(o.lat*4))/4*111;
  return <><h3>Deviation profile</h3><table><thead><tr><th>Depth</th><th>Model</th><th>Obs</th><th>Diff</th></tr></thead><tbody>{zs.map(z=>{const q=mod(v,o.x,o.y,z,s.t),e=dv(s.sel,v,z,s.t);return <tr key={z} className={z===nz?'cur':''} onClick={()=>set({z})} style={{cursor:'pointer'}}><td>{z} m</td><td>{F(q)}</td><td>{F(q-e)}</td><td>{G(e)}</td></tr>})}</tbody></table>
  <h3>Difference at {s.z} m</h3><div className="big">{G(d)+u}</div>
  <h3>Whole-column statistics</h3><K r={[['Bias (0–200 m)',G(bi)+u],['RMSE',F(rm)+u],['Grid offset',Math.hypot(gx,gy).toFixed(1)+' km'],['Time offset',(s.sel%3)*10+' min']]}/>
  <h3>Observation info</h3><K r={[['Source',o.s],['QC','● Available'],['Location',ll(o)],['Time',hh(s.t)]]}/>
  <button className="go b" onClick={()=>set({view:'ocean'})}>Compare at this depth</button></>}
 if(s.view==='replay')return <><h3>Current values</h3><K r={head.slice(0,4)}/><table><thead><tr><th>Time</th><th>Model</th><th>Obs</th><th>Diff</th></tr></thead><tbody>{[6,8,10,12,14,16,18].map(t=>{const q=mod(v,o.x,o.y,s.z,t),e=dv(s.sel,v,s.z,t);return <tr key={t} className={Math.abs(t-s.t)<1?'cur':''}><td>{String(t).padStart(2,'0')}:00</td><td>{F(q)}</td><td>{F(q-e)}</td><td>{G(e)}</td></tr>})}</tbody></table><p className="note">Press Play to watch the field and the difference evolve through the day.</p></>;
 const k=rank(s),al=k.filter(a=>nc(O[a.i])&&Math.abs(dv(a.i,v,s.z,s.t))/SC[v]>.5).length;
 return <><h3>Top deviations</h3><p className="note">Coastal watch: {al} high deviation(s) within ~350 km of the coast.</p><table><thead><tr><th>Location</th><th>Depth</th><th>Diff</th></tr></thead><tbody>{k.length?k.map((a,n)=><tr key={a.i} className={a.i===s.sel?'cur':''} onClick={()=>set({sel:a.i})}><td>{n+1}. {ll(O[a.i])}</td><td>{s.z} m</td><td>{G(dv(a.i,v,s.z,s.t))}</td></tr>):<tr><td colSpan="3">No region above the threshold. Lower the minimum deviation.</td></tr>}</tbody></table>
 <h3>Selected region</h3><K r={head}/><button className="go b" onClick={()=>set({view:'inv'})}>Investigate this region</button></>}
const dl=(n,u)=>{const a=document.createElement('a');a.href=u;a.download=n;a.click()};
export default function App(){
 const [s,setS]=useState(()=>{const o={v:'T',z:50,t:12,sel:0,view:'ocean',obs:true,sec:true,slice:true,part:true,cy:false,md:.2,play:false};
  try{location.hash.slice(1).split('&').forEach(p=>{const[k,v]=p.split('=');if(['v','z','t','sel','view'].includes(k)&&v)o[k]=isNaN(+v)?v:+v})}catch(e){}
  if(!R[o.v])o.v='T';if(!O[o.sel])o.sel=0;if(!['ocean','inv','replay','dev'].includes(o.view))o.view='ocean';o.z=Math.max(0,Math.min(200,Math.round(o.z/5)*5));o.t=Math.max(6,Math.min(18,o.t));return o});
 const set=p=>setS(q=>({...q,...p})),api=useRef(),gl=s.view==='ocean'||s.view==='replay',r=R[s.v];
 useEffect(()=>{if(!s.play)return;const id=setInterval(()=>setS(q=>({...q,t:q.t>=18?6:q.t+.25})),300);return()=>clearInterval(id)},[s.play]);
 const csv=()=>{const rows=['lon,lat,source,variable,depth_m,time_utc,model,observed,difference'];O.forEach((o,i)=>{const m=mod(s.v,o.x,o.y,s.z,s.t),d=dv(i,s.v,s.z,s.t);rows.push([o.lon,o.lat,o.s,r[3],s.z,hh(s.t),m.toFixed(3),(m-d).toFixed(3),d.toFixed(3)].join(','))});dl('ocean-x_deviations.csv','data:text/csv;charset=utf-8,'+encodeURIComponent(rows.join('\n')))};
 const png=()=>dl('ocean-x_'+s.view+'.png',gl?api.current.png():document.querySelector('#cv canvas.fill').toDataURL('image/png'));
 const link=()=>{try{history.replaceState(null,'','#'+['v','z','t','sel','view'].map(k=>k+'='+s[k]).join('&'))}catch(e){}navigator.clipboard&&navigator.clipboard.writeText(location.href)};
 const pick=(e,G)=>{if(!G)return;const b=e.target.getBoundingClientRect();let bi=-1,bd=24;O.forEach((o,i)=>{const d=Math.hypot(e.clientX-b.left-(G.ox+o.x*G.mw),e.clientY-b.top-(G.oy+G.mh-o.y*G.mh));if(d<bd){bd=d;bi=i}});if(bi>=0)set({sel:bi})};
 const grad='linear-gradient(90deg,'+[0,.25,.5,.75,1].map(f=>'rgb('+col(f).map(Math.round)+')').join(',')+')';
 return <><header className="top"><div className="lg">OCEAN-X</div><nav>{[['ocean','3D Ocean View'],['inv','Investigation'],['replay','Time Replay'],['dev','Deviation Explorer']].map(([k,n])=><button key={k} className={s.view===k?'on':''} onClick={()=>set({view:k})}>{n}</button>)}</nav><span className="live">Prototype · synthetic demo data</span></header>
 <main><aside className="p"><h4>Data layers</h4>{Object.keys(R).map(k=><button key={k} className={'ly'+(s.v===k?' on':'')} onClick={()=>set({v:k})}>{R[k][3]}</button>)}
  <label className="ck"><input type="checkbox" checked={s.obs} onChange={e=>set({obs:e.target.checked})}/>Observations</label>
  <h4>Controls</h4><label>Depth <b>{s.z} m</b></label><input type="range" min="0" max="200" step="5" value={s.z} onChange={e=>set({z:+e.target.value})} aria-label="Depth"/>
  <label>Time <b>{hh(s.t)}</b></label><input type="range" min="6" max="18" step=".25" value={s.t} onChange={e=>set({t:+e.target.value})} aria-label="Time"/>
  {s.view==='dev'&&<><label>Min. deviation <b>{s.md.toFixed(2)}</b></label><input type="range" min="0" max=".8" step=".05" value={s.md} onChange={e=>set({md:+e.target.value})} aria-label="Minimum deviation"/></>}
  <p className="note">Depth is vertically exaggerated in 3D. Drag to rotate, scroll to zoom. Click an observation marker to investigate.</p>
  <h4>Share and export</h4><button className="ly" onClick={csv}>Export deviations (CSV)</button><button className="ly" onClick={png}>Save view (PNG)</button><button className="ly" onClick={link}>Copy view link</button></aside>
 <section id="cv" className="p">{gl&&<Scene s={s} api={api} onPick={i=>set({sel:i})}/>}{s.view==='inv'&&<Cv draw={drawInv} s={s}/>}{s.view==='dev'&&<Cv draw={drawDev} s={s} onClick={pick}/>}
  {s.view!=='dev'&&<div id="lgd"><i id="bar" style={{background:grad}}/><span>{r[0]} {r[2]}</span><span id="hi">{r[1]} {r[2]}</span></div>}
  {gl&&<div id="bb"><button onClick={()=>set({play:!s.play})}>{s.play?'❚❚ Pause':'▶ Play'}</button>{[['sec','3D field'],['slice','Depth slices'],['part','Current particles'],['cy','Cyclone track (demo)']].map(([k,n])=><button key={k} className={'ch'+(s[k]?' on':'')} onClick={()=>set({[k]:!s[k]})}>{n}</button>)}<button className={'ch'+(s.view==='replay'?' on':'')} onClick={()=>set({view:s.view==='replay'?'ocean':'replay'})}>Time replay</button></div>}</section>
 <aside className="p"><Right s={s} set={set}/></aside></main></>}
