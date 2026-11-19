(function(){ try{
/* 14/11 · SỐ CHIA MÃ HOÁ THEO NPP + TÀI KHOẢN NPP.
   - Mỗi NPP (TG3, TG19) có 1 khoá dữ liệu ngẫu nhiên 256-bit (DK). Mọi số chia (số chia mới theo tuần, đã bán DMS, luân chuyển, NPP bán/trả) lưu ở t12 dạng AES-GCM:
     t12/sca_<NPP> (số chia mới các tuần) · t12/scs_<NPP>_<sales> (đã bán DMS) · t12/lce_<NPP>_… (luân chuyển) · t12/np_<NPP>_<ngày>_… (NPP bán/trả). Chỉ có {iv, ct}.
   - DK được bọc bằng khoá sinh từ MẬT KHẨU app của từng người được phép (PBKDF2-SHA256 210k vòng, salt 'sc|NPP|memberId') ở t12/sck_<NPP>.
     Bản gốc DK chỉ nằm ở arch/sck_<NPP> (chỉ chủ app đọc/ghi). Chủ app mở app → tự cấp khoá cho người được phép.
   - NPP nhập (bán/trả) chỉ tính cho ngày DMS chưa có số (ngày > ngày "Đã bán tính đến" của sales đó); khi DMS phủ tới ngày đó thì số DMS thay thế. */
const SC=window.__SC; if(!SC) return;
const NPPS=['TG3','TG19'], NPPDIS={TG3:'10423306',TG19:'10459007'};
const AUTH0={TG3:['m_hau','m_bao','m_thanh','m_gbao','m_nam','m_trung','m_tan','m_phong','m_thinh','m_diep','m_binh'],TG19:['m_hau','m_trung','m_thinh','m_diep','m_binh']};
const REPS0={TG3:['hau','bao','thanh','gbao','nam','trung','tan','phong'],TG19:['hau','trung']};
const ITER=210000, LSK='tw.sck';
const X={raw:{},key:{},src:{},cache:{},lc:[],np:[],t12:null,busy:false,again:false,stale:[],err:{},st:'',has:false};
window.SCX=X;
const te=new TextEncoder(), tdc=new TextDecoder();
const b64=u=>{ let s=''; for(let i=0;i<u.length;i+=0x8000) s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000)); return btoa(s); };
const ub=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const imp=raw=>crypto.subtle.importKey('raw',raw,{name:'AES-GCM'},false,['encrypt','decrypt']);
async function enc(key,obj,aad){ const iv=crypto.getRandomValues(new Uint8Array(12)); const ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:te.encode(aad)},key,te.encode(JSON.stringify(obj)))); return {iv:b64(iv),ct:b64(ct)}; }
async function dec(key,x,aad){ const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:ub(x.iv),additionalData:te.encode(aad)},key,ub(x.ct)); return JSON.parse(tdc.decode(pt)); }
async function kek(pw,npp,mid,it){ const b=await crypto.subtle.importKey('raw',te.encode(String(pw)),'PBKDF2',false,['deriveKey']); return crypto.subtle.deriveKey({name:'PBKDF2',salt:te.encode('sc|'+npp+'|'+mid),iterations:it||ITER,hash:'SHA-256'},b,{name:'AES-GCM',length:256},false,['encrypt','decrypt']); }
async function wrap(raw,pw,npp,mid){ const k=await kek(pw,npp,mid,ITER); const iv=crypto.getRandomValues(new Uint8Array(12)); const ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:te.encode('sck|'+npp+'|'+mid)},k,raw)); return {iv:b64(iv),ct:b64(ct),it:ITER}; }
async function unwrap(w,pw,npp,mid){ const k=await kek(pw,npp,mid,w.it||ITER); return new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:ub(w.iv),additionalData:te.encode('sck|'+npp+'|'+mid)},k,ub(w.ct))); }
async function setKey(n,raw,src){ X.raw[n]=b64(raw); X.key[n]=await imp(raw); X.src[n]=src; }
X._setKey=setKey; X._b64=b64; X._ub=ub;
const f0=n=>Math.round(+n||0).toLocaleString('vi-VN');
const fd=s=>s?String(s).slice(8,10)+'/'+String(s).slice(5,7):'';
const nppOfId=id=>String(id).split('_')[1];
const me=()=>{ try{ return meId(); }catch(_){ return null; } };
const memOf=id=>(S.members||{})[id]||null;
const isNpp=()=>{ const m=memOf(me()); return !!(m&&m.role==='NPP'); };
const myNpp=()=>{ const m=memOf(me()); return m&&m.role==='NPP'?String(m.npp||'').toUpperCase():null; };
X.isNpp=isNpp; X.myNpp=myNpp;
X.canEdit=()=>!!S.isOwner&&!isNpp();
const userOf=mid=>{ const U=(S.auth&&S.auth.users)||{}; return Object.keys(U).sort().find(u=>U[u].m===mid)||null; };
/* ---------- khoá trên máy ---------- */
function saveLS(){ try{ if(!S.login) return; const k={}; Object.keys(X.raw).forEach(n=>{ if(X.src[n]==='user') k[n]=X.raw[n]; }); localStorage.setItem(LSK,JSON.stringify({u:S.login.u,k})); }catch(_){ } }
async function loadLS(){ try{ const x=JSON.parse(localStorage.getItem(LSK)||'null'); if(!x||!S.login||x.u!==S.login.u) return; for(const [n,r] of Object.entries(x.k||{})) if(!X.key[n]) await setKey(n,ub(r),'user'); }catch(_){ } }
X.clear=()=>{ try{ localStorage.removeItem(LSK); }catch(_){ } Object.keys(X.raw).forEach(n=>{ if(X.src[n]!=='owner'){ delete X.raw[n]; delete X.key[n]; delete X.src[n]; } }); X.cache={}; X.t12=null; X.err={}; X.lc=[]; X.np=[]; SC.d=null; SC.weeks=null; X.has=false; };
/* đăng nhập: mở khoá số chia bằng mật khẩu vừa gõ */
X.unlock=async(u,p)=>{ for(let i=0;i<25&&!S.t12;i++) await new Promise(r=>setTimeout(r,200)); u=String(u||'').trim().toLowerCase(); const a=S.auth&&S.auth.users&&S.auth.users[u]; if(!a) return 0; const mid=a.m; let ok=0;
  for(const n of NPPS){ const w=(((S.t12||{})['sck_'+n]||{}).w||{})[mid]; if(!w){ continue; } try{ await setKey(n,await unwrap(w,p,n,mid),'user'); ok++; delete X.err[n]; }catch(e){ X.err[n]='wrap'; } }
  saveLS(); X.t12=null; await X.sync(true); return ok; };
/* ---------- chủ app: khoá gốc + cấp khoá ---------- */
async function ownerKeys(){ if(!S.isOwner||!S.db||X.ownerTried||isNpp()) return; X.ownerTried=true;
  for(const n of NPPS){ try{ const g=await S.db.doc('arch/sck_'+n).get(); if(g.exists&&g.data()&&g.data().k) await setKey(n,ub(g.data().k),'owner'); }catch(e){ console.warn('scx arch',e); } } }
function repsOf(n){ const s=new Set(REPS0[n]||[]); Object.values(SC.weeks||{}).forEach(W=>{ Object.entries(W.base||{}).forEach(([sr,m])=>{ if(m&&m[n]) s.add(sr); }); Object.entries(W.sold||{}).forEach(([sr,m])=>{ if(m&&m[n]) s.add(sr); }); }); return [...s]; }
X.repsOf=repsOf;
function authz(n){ const s=new Set(AUTH0[n]); const reps=repsOf(n); reps.forEach(sr=>{ if(typeof SRK0!=='undefined'&&SRK0[sr]) s.add(SRK0[sr]); });
  Object.entries(S.members||{}).forEach(([id,m])=>{ if(!m||m.active===false) return; if(m.role==='ASM') s.add(id); if(m.role==='NPP'&&String(m.npp||'').toUpperCase()===n) s.add(id); if(m.key&&m.team&&(TEAMSR[m.team]||[]).some(sr=>reps.includes(sr))) s.add(id); });
  return [...s].filter(id=>S.members[id]&&S.members[id].active!==false); }
X.authz=authz;
async function ensureWraps(){ if(!S.isOwner||isNpp()||X.wrBusy||!S.auth||!S.auth.users||!S.ready||!S.ready.m||!S.t12) return; X.wrBusy=true; const stale=[];
  try{ for(const n of NPPS){ if(!X.raw[n]) continue; const id='sck_'+n; const cur=(S.t12||{})[id]||{}; const W={...(cur.w||{})}; let ch=0;
      for(const mid of authz(n)){ const u=userOf(mid); const a=u&&S.auth.users[u]; if(!a||!a.h) continue; if(W[mid]&&W[mid].hh===a.h.slice(0,12)) continue;
        if(await sha(u+':123456')===a.h){ W[mid]={...(await wrap(ub(X.raw[n]),'123456',n,mid)),hh:a.h.slice(0,12),u,at:new Date().toISOString()}; ch++; } else stale.push({n,mid,u}); }
      if(ch){ const rec={sck:true,npp:n,w:W,at:new Date().toISOString()}; await S.db.collection('t12').doc(id).set(rec); S.t12={...(S.t12||{}),[id]:rec}; } } }
  catch(e){ console.warn('scx wraps',e); } X.stale=stale; X.wrBusy=false; X.wrDone=true; }
X.reissue=async(n,mid,pw)=>{ const u=userOf(mid); const a=u&&S.auth.users[u]; if(!a) throw new Error('Không thấy tài khoản'); if(await sha(u+':'+pw)!==a.h) throw new Error('Mật khẩu không khớp tài khoản '+u);
  const id='sck_'+n; const cur=(S.t12||{})[id]||{}; const W={...(cur.w||{})}; W[mid]={...(await wrap(ub(X.raw[n]),pw,n,mid)),hh:a.h.slice(0,12),u,at:new Date().toISOString()};
  const rec={sck:true,npp:n,w:W,at:new Date().toISOString()}; await S.db.collection('t12').doc(id).set(rec); S.t12={...(S.t12||{}),[id]:rec}; X.stale=X.stale.filter(x=>!(x.n===n&&x.mid===mid)); };
/* ---------- đọc / ghi bản mã ---------- */
async function put(id,obj){ const n=nppOfId(id); if(!X.key[n]) throw new Error('Chưa có khoá số chia '+n); const x=await enc(X.key[n],obj,id); const rec={...x,v:1}; await S.db.collection('t12').doc(id).set(rec); X.cache[id]={ck:id+'|'+rec.iv,v:obj}; S.t12={...(S.t12||{}),[id]:rec}; return rec; }
async function getFresh(id){ const n=nppOfId(id); const g=await S.db.doc('t12/'+id).get(); if(!g.exists) return null; const d=g.data(); if(!d||!d.ct) return null; return dec(X.key[n],d,id); }
X.put=put;
X.sync=async force=>{ if(X.busy){ X.again=true; return; } const T=S.t12; if(!T||(!force&&T===X.t12)) return; X.busy=true; X.t12=T;
  try{ const live=new Set();
    for(const id of Object.keys(T)){ if(!/^(sca|scs|lce|np)_/.test(id)) continue; const d=T[id]; if(!d||!d.ct||!d.iv) continue; const n=nppOfId(id); if(!X.key[n]) continue; live.add(id); const ck=id+'|'+d.iv; if(X.cache[id]&&X.cache[id].ck===ck) continue;
      try{ X.cache[id]={ck,v:await dec(X.key[n],d,id)}; }catch(e){ X.cache[id]={ck,v:null,bad:1}; } }
    Object.keys(X.cache).forEach(id=>{ if(!live.has(id)) delete X.cache[id]; });
    build(); }
  catch(e){ console.warn('scx sync',e); } X.busy=false; if(X.again){ X.again=false; X.sync(true); } };
function build(){ const C=X.cache; const E=Object.entries(C).filter(([id,x])=>x&&x.v);
  X.lc=E.filter(([id])=>id.startsWith('lce_')).map(([id,x])=>[id,x.v]);
  X.np=E.filter(([id])=>id.startsWith('np_')).map(([id,x])=>({...x.v,id}));
  const A=E.filter(([id])=>id.startsWith('sca_')).map(([id,x])=>x.v);
  if(!A.length){ SC.d=null; SC.weeks=null; X.has=false; refresh(); return; }
  const sku=A[0].sku, aa=A[0].aa, bb=A[0].bb; const weeks={}; const names={};
  A.forEach(b=>Object.entries(b.weeks||{}).forEach(([wk,w])=>{ const W=weeks[wk]=weeks[wk]||{from:w.from,to:w.to,sku,aa,bb,base:{},sold:{},asOf:{},names,ak:new Set()}; Object.entries(w.base||{}).forEach(([sr,v])=>{ (W.base[sr]=W.base[sr]||{})[b.npp]=v; }); (w.ak||[]).forEach(k=>W.ak.add(k)); }));
  E.filter(([id])=>id.startsWith('scs_')).forEach(([id,x])=>{ const s=x.v; Object.assign(names,s.names||{});
    Object.entries(s.w||{}).forEach(([wk,v])=>{ const W=weeks[wk]; if(!W) return; (W.sold[s.sr]=W.sold[s.sr]||{})[s.npp]=v; });
    Object.entries(s.asOf||{}).forEach(([wk,a])=>{ const W=weeks[wk]; if(!W||!a) return; if(!W.asOf[s.sr]||a>W.asOf[s.sr]) W.asOf[s.sr]=a; }); });
  Object.values(weeks).forEach(W=>{ W.ak=[...W.ak]; W.alloc=JSON.parse(JSON.stringify(W.base)); });
  /* 19/11 · tuần chưa có trong sca_ (vd W47 ở script scw47) được thêm lại mỗi lần dựng — trước đây bị rơi, app nhảy về tuần 2 nên luân chuyển bị lưu nhầm tuần */
  try{ (window.__scxWeekHooks||[]).forEach(f=>f(weeks)); }catch(e){ console.warn('scx weekHooks',e); }
  const prev=SC.sel; SC.weeks=weeks; const ks=Object.keys(weeks).sort(); const td=today();
  if(!prev||!weeks[prev]){ const cur=ks.find(k=>td>=weeks[k].from&&td<=weeks[k].to); SC.sel=cur||ks.filter(k=>k<=td).pop()||ks[0]; }
  SC.mon=SC.sel.slice(0,7); SC.d=weeks[SC.sel]; try{ SC.calc(); }catch(e){ console.warn('scCalc',e); } X.has=true; refresh(); }
function refresh(){ try{ if(UI.view==='sochia'||isNpp()) changed(); }catch(_){ } }
SC.lcSrc=()=>X.lc;
X.lcGet=id=>{ const x=X.lc.find(([i])=>i===id); return x?x[1]:null; };
X.lcSave=async rec=>{ if(!X.canEdit()) throw new Error('Chỉ anh Thịnh sửa được số chia'); const n=rec.tn||'TG3'; await put('lce_'+n+'_'+rec.w+'_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),rec); X.t12=null; await X.sync(true); };
X.lcDel=async id=>{ if(!X.canEdit()) throw new Error('Chỉ anh Thịnh sửa được số chia'); await S.db.doc('t12/'+id).delete(); const T={...(S.t12||{})}; delete T[id]; S.t12=T; await X.sync(true); };
/* ---------- Đã bán từ nút "Update new sales volume" ---------- */
X.saveSold=async P=>{ const skipped=new Set(), done=[];
  for(const [sr,w] of Object.entries(P.sold||{})){ const npps=new Set(); Object.values(w||{}).forEach(v=>Object.keys(v||{}).forEach(n=>npps.add(n))); NPPS.forEach(n=>{ if((S.t12||{})['scs_'+n+'_'+sr]) npps.add(n); });
    for(const n of npps){ if(!X.key[n]){ skipped.add(n); continue; } const id='scs_'+n+'_'+sr; let cur=null; try{ cur=await getFresh(id); }catch(e){ skipped.add(n); continue; } cur=cur||{v:1,npp:n,sr,w:{},asOf:{},names:{}};
      const W={...(cur.w||{})}, A={...(cur.asOf||{})}; Object.entries(w).forEach(([wk,v])=>{ W[wk]=(v||{})[n]||{}; A[wk]=P.hi; });
      await put(id,{...cur,v:1,npp:n,sr,w:W,asOf:A,src:P.name,at:new Date().toISOString()}); done.push(id); } }
  X.t12=null; X.sync(true); return {done,skipped:[...skipped]}; };
/* ---------- NPP nhập: bán / trả chưa có trong DMS ---------- */
X.cover=sr=>{ let m=''; Object.values(SC.weeks||{}).forEach(W=>{ const a=(W.asOf||{})[sr]; if(a&&a>m) m=a; }); return m; };
SC.man=(sr,npp,ks,withRows)=>{ const D=SC.d; if(!D) return withRows?[]:0; const cv=X.cover(sr); const R=[];
  X.np.forEach(e=>{ if(e.sr!==sr||e.npp!==npp||!e.d||e.d<D.from||e.d>D.to||(cv&&e.d<=cv)) return; (e.items||[]).forEach(i=>{ if(ks.includes(i.k)) R.push({k:i.k,q:(e.t==='r'?-1:1)*(+i.q||0),c:e.c,n:e.n,d:e.d,t:e.t,id:e.id,at:e.at}); }); });
  return withRows?R:Math.round(R.reduce((a,r)=>a+r.q,0)*100)/100; };
SC.manDet=(sr,npp,ks)=>{ const R=SC.man(sr,npp,ks,true); if(!R.length) return ''; return '<div class="sc-det" style="padding-top:0">'+R.sort((a,b)=>String(b.at).localeCompare(String(a.at))).map(r=>`<div class="row"><span class="c">${esc(r.c||'')}</span><span class="n">${esc(((S.mst||{})[r.c]||{}).n||r.n||'')} <span class="p">${r.t==='r'?'NPP nhận trả':'NPP bán'} ${esc(fd(r.d))}${ks.length>1?' · '+esc(r.k):''}</span></span><span></span><b style="color:${r.q<0?'#1F6F98':'#B26A00'}">${r.q<0?'−':''}${f0(Math.abs(r.q))}</b></div>`).join('')+'</div>'; };
X.npSave=async rec=>{ const n=rec.npp; const id='np_'+n+'_'+rec.d+'_'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); await put(id,rec); X.t12=null; await X.sync(true); return id; };
X.npDel=async id=>{ await S.db.doc('t12/'+id).delete(); const T={...(S.t12||{})}; delete T[id]; S.t12=T; delete X.cache[id]; X.t12=null; await X.sync(true); };
/* ---------- số liệu dùng chung ---------- */
const nf=ks=>SC.nf(ks);
X.cell=(sr,n,ks)=>{ const D=SC.d; const al=((D.alloc||{})[sr]||{})[n]; const kk=nf(ks); const a=al?kk.reduce((t,k)=>t+(+al[k]||0),0):null; const s=kk.reduce((t,k)=>t+SC.sold(D,sr,n,k),0); const t=SC.man(sr,n,kk); return {a,s,t,l:(a||0)-s-t,has:!!al}; };
X.left=(sr,n,k)=>{ const D=SC.d; return (+((((D.alloc||{})[sr]||{})[n]||{})[k])||0)-SC.sold(D,sr,n,k)-SC.man(sr,n,[k]); };
/* ---------- màn hình khoá ---------- */
X.gateHTML=()=>{ const u=S.login&&S.login.u; const mid=me(); if(!mid) return '<div class="empty"><b>Đang tải số chia…</b></div>';
  const avail=NPPS.filter(n=>((((S.t12||{})['sck_'+n]||{}).w)||{})[mid]); const opened=Object.keys(X.key);
  if(S.isOwner&&!opened.length) return '<div class="empty"><b>Đang mở khoá số chia (chủ app)…</b></div>';
  if(opened.length&&!X.has) return '<div class="empty"><b>Đang giải mã số chia…</b></div>';
  if(!avail.length) return `<div class="npx-lock"><b>🔒 Tài khoản này chưa được cấp khoá số chia</b><span>Nhờ anh Thịnh mở app để cấp lại khoá số chia.</span></div>`;
  const bad=Object.values(X.err).includes('wrap');
  return `<form class="npx-lock" id="scxUnlock" autocomplete="off"><b>🔒 Số chia đã được mã hoá</b><span>Nhập lại mật khẩu app của tài khoản <b>${esc(u||'')}</b> để mở (chỉ cần 1 lần trên máy này).</span>
    <input type="password" id="scxPw" autocomplete="current-password" placeholder="Mật khẩu app" aria-label="Mật khẩu app"><button class="npx-btn pri" type="submit">Mở số chia</button>
    <span class="npx-err" id="scxErr">${bad?'Mật khẩu đúng nhưng khoá số chia đã cũ. Nhờ anh Thịnh mở app để cấp lại khoá số chia.':''}</span></form>`; };
document.addEventListener('submit',async e=>{ if(!e.target||e.target.id!=='scxUnlock') return; e.preventDefault(); const p=(document.getElementById('scxPw')||{}).value||''; const u=S.login&&S.login.u; const er=document.getElementById('scxErr');
  const a=u&&S.auth&&S.auth.users&&S.auth.users[u]; if(!a||await sha(u+':'+p)!==a.h){ if(er) er.textContent='Sai mật khẩu.'; return; }
  if(er) er.textContent='Đang mở khoá…'; const ok=await X.unlock(u,p); if(!ok&&er) er.textContent='Không mở được khoá. Nhờ anh Thịnh mở app để cấp lại khoá số chia.'; try{ render(); }catch(_){ } });
/* ---------- thanh quản trị của chủ app (trong tab Số chia) ---------- */
const OW={open:false,ed:null,msg:''};
X.ownerBar=()=>{ if(!X.canEdit()) return ''; const mg=X.mig?(X.mig.err?`<div class="npx-own-row npx-err">Chuyển sang mã hoá lỗi: ${esc(X.mig.err)}</div>`:`<div class="npx-own-row">Chuyển sang mã hoá ${esc(fd(X.mig.at))}: ${X.mig.ok?`<b style="color:#0D6B3D">khớp 100%</b> (${f0(X.mig.cells)} ô số đầu kỳ / đã bán / lố-dư so với dữ liệu cũ)`:`<b class="as">LỆCH ${f0((X.mig.diff||[]).length)} ô</b> ${esc((X.mig.diff||[]).slice(0,6).join(' · '))}`}</div>`):''; const ks=NPPS.map(n=>`${n} ${X.key[n]?'✓':'✗'}`).join(' · '); const nW=NPPS.reduce((t,n)=>t+Object.keys((((S.t12||{})['sck_'+n]||{}).w)||{}).length,0);
  let h=`<div class="npx-own"><div class="npx-ownh"><span>🔒 Số chia mã hoá theo NPP · khoá ${ks} · ${nW} lượt cấp khoá${X.stale.length?` · <b class="as">${X.stale.length} tài khoản cần cấp lại khoá</b>`:''}</span><button type="button" class="sc-mbtn${OW.open?' on':''}" data-scxown>${OW.open?'Đóng':'✎ Số chia mới / cấp khoá'}</button></div>`;
  if(OW.open){ h+=allocEditor()+staleForm(); }
  return h+mg+'</div>'; };
function staleForm(){ if(!X.stale.length) return '<div class="npx-own-row small muted">Mọi tài khoản được phép đã có khoá số chia (mật khẩu mặc định).</div>';
  return `<form class="npx-own-row" id="scxRe"><b>Cấp lại khoá</b><select id="scxReW">${X.stale.map((x,i)=>`<option value="${i}">${esc(x.u)} · ${esc(x.n)}</option>`).join('')}</select><input type="password" id="scxReP" placeholder="Mật khẩu hiện tại của tài khoản đó" autocomplete="off"><button class="npx-btn pri" type="submit">Cấp khoá</button><span class="npx-err" id="scxReE"></span></form>`; }
function allocEditor(){ const D=SC.d; if(!D) return ''; const n=OW.n||'TG3'; const b=(X.cache['sca_'+n]||{}).v; if(!b) return `<div class="npx-own-row">Chưa có khoá ${n}.</div>`; const wk=SC.sel; const w=(b.weeks||{})[wk]||{base:{}};
  const reps=[...new Set([...repsOf(n).filter(sr=>(REPS0[n]||[]).includes(sr)||(w.base||{})[sr]),...Object.keys(w.base||{})])];
  const K=D.sku; const nx=nextMon(Object.keys(SC.weeks).sort().pop());
  return `<form class="npx-own-row npx-ed" id="scxEd"><div class="npx-edh"><b>Số chia mới tuần ${fd(D.from)}–${fd(D.to)}</b><div class="npx-seg">${NPPS.map(x=>`<button type="button" data-scxn="${x}" aria-pressed="${x===n}">${x}</button>`).join('')}</div><span class="small muted">Số chia gốc của tuần (chưa cộng dư tuần trước, luân chuyển). Chỉ chủ app sửa.</span></div>
   <div class="sc-scroll"><table class="sc npx-edt"><thead><tr><th class="c0">Sales</th>${K.map(k=>`<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>${reps.map(sr=>`<tr><td class="c0">${esc(SRN2[sr]||sr)}</td>${K.map(k=>`<td><input type="number" inputmode="numeric" min="0" step="1" data-scxa="${sr}|${k}" value="${+(((w.base||{})[sr]||{})[k])||''}"></td>`).join('')}</tr>`).join('')}</tbody></table></div>
   <div class="npx-edf"><button class="npx-btn pri" type="submit">Lưu số chia ${n} tuần ${fd(D.from)}</button><button type="button" class="npx-btn" data-scxnew="${nx}">+ Tạo tuần ${fd(nx)}</button><span class="npx-err">${esc(OW.msg||'')}</span></div></form>`; }
const nextMon=k=>{ const d=new Date(k+'T00:00:00'); d.setDate(d.getDate()+7); return ymd(d); };
async function saveWeek(wk,from,to,npp,base){ const bs={}; NPPS.forEach(n=>{ const v=(X.cache['sca_'+n]||{}).v; if(v) bs[n]=JSON.parse(JSON.stringify(v)); }); if(!bs[npp]) throw new Error('Chưa có khoá '+npp);
  const ww=bs[npp].weeks[wk]||{from,to,base:{},ak:[]}; ww.from=from; ww.to=to; if(base) ww.base=base; bs[npp].weeks[wk]=ww;
  const sku=bs[npp].sku; const ak=sku.filter(k=>Object.values(bs).some(b=>Object.values(((b.weeks||{})[wk]||{}).base||{}).some(v=>+((v||{})[k])||0)));
  for(const n of Object.keys(bs)){ const w2=bs[n].weeks[wk]=bs[n].weeks[wk]||{from,to,base:{},ak:[]}; w2.ak=ak; await put('sca_'+n,bs[n]); } X.t12=null; await X.sync(true); }
document.addEventListener('click',async e=>{ const t=e.target; if(!t.closest) return;
  if(t.closest('[data-scxown]')){ e.preventDefault(); OW.open=!OW.open; OW.msg=''; render(); return; }
  const nb=t.closest('[data-scxn]'); if(nb){ e.preventDefault(); OW.n=nb.dataset.scxn; render(); return; }
  const nw=t.closest('[data-scxnew]'); if(nw){ e.preventDefault(); if(!X.canEdit()) return; const wk=nw.dataset.scxnew; const d=new Date(wk+'T00:00:00'); d.setDate(d.getDate()+6); try{ await saveWeek(wk,wk,ymd(d),OW.n||'TG3',null); SC.sel=wk; SC.mon=wk.slice(0,7); SC.d=SC.weeks[wk]; OW.msg='Đã tạo tuần '+fd(wk)+' (chưa có số).'; }catch(err){ OW.msg='Lỗi: '+(err.message||err); } render(); } });
document.addEventListener('submit',async e=>{ const f=e.target; if(!f||!X.canEdit()) return;
  if(f.id==='scxEd'){ e.preventDefault(); const n=OW.n||'TG3'; const base={}; f.querySelectorAll('[data-scxa]').forEach(i=>{ const [sr,k]=i.dataset.scxa.split('|'); const q=Math.max(0,Math.round(+i.value||0)); (base[sr]=base[sr]||{})[k]=q; });
    Object.keys(base).forEach(sr=>{ if(!Object.values(base[sr]).some(q=>q)) delete base[sr]; }); const D=SC.d; try{ await saveWeek(SC.sel,D.from,D.to,n,base); OW.msg='Đã lưu số chia '+n+' tuần '+fd(D.from)+'.'; }catch(err){ OW.msg='Lỗi: '+(err.message||err); } render(); }
  if(f.id==='scxRe'){ e.preventDefault(); const x=X.stale[+document.getElementById('scxReW').value]; const p=document.getElementById('scxReP').value; const er=document.getElementById('scxReE'); if(!x) return; try{ if(er) er.textContent='Đang cấp khoá…'; await X.reissue(x.n,x.mid,p); OW.msg=''; render(); }catch(err){ if(er) er.textContent=err.message||String(err); } } });
/* ---------- MÀN HÌNH NPP ---------- */
const NP={tab:'kho',mode:'sr',open:new Set(),c:'',it:{},conf:false,busy:false,msg:'',del:null,f:null};
const teamOfSr=sr=>Object.keys(TEAMSR).find(t=>TEAMSR[t].includes(sr))||'khac';
const ssOf=t=>{ const m=Object.values(S.members||{}).find(x=>x&&x.key&&x.team===t&&x.active!==false); return m?(m.short||m.name):t; };
function nppReps(n){ const D=SC.d; return repsOf(n).filter(sr=>((D.alloc||{})[sr]||{})[n]||Object.keys(((D.sold||{})[sr]||{})[n]||{}).length||(REPS0[n]||[]).includes(sr)); }
function nRow(lab,x,cls,attr,sub){ return `<tr class="${cls||''}" ${attr||''}><td class="c0">${lab}${sub?`<small>${sub}</small>`:''}</td><td>${x.a==null?'<span class="zero">chưa chia</span>':f0(x.a)}</td><td>${x.s?f0(x.s):'<span class="zero">-</span>'}</td><td class="tam">${x.t?f0(x.t):'<span class="zero">-</span>'}</td><td class="${x.a==null?'zero':Math.round(x.l)<0?'neg':''}"><b>${x.a==null?'–':f0(x.l)}</b></td></tr>`; }
const addC=(o,x)=>{ o.a=(o.a||0)+(x.a||0); o.s+=x.s; o.t+=x.t; o.l=(o.a||0)-o.s-o.t; return o; };
const HEAD='<tr><th class="c0">%</th><th>Đầu kỳ</th><th>Đã bán (DMS)</th><th>NPP nhập</th><th>Còn lại</th></tr>';
function khoSales(n){ const D=SC.d; const reps=nppReps(n); const teams={}; reps.forEach(sr=>{ (teams[teamOfSr(sr)]=teams[teamOfSr(sr)]||[]).push(sr); }); const G={a:0,s:0,t:0,l:0};
  let b=''; Object.entries(teams).forEach(([t,list])=>{ const T={a:0,s:0,t:0,l:0};
    const rows=list.map(sr=>{ const x=X.cell(sr,n,D.sku); addC(T,x); const k='s|'+sr; const op=NP.open.has(k); const cv=X.cover(sr);
      let h=nRow(`<span class="npx-car">${op?'▾':'▸'}</span>${esc(SRN2[sr]||sr)}`,x,'npx-sr'+(op?' open':''),`data-npo="${k}"`,cv?'DMS đến '+fd(cv):'chưa có số DMS');
      if(op) h+=D.sku.filter(k2=>!SC.free(k2)||SC.sold(D,sr,n,k2)).map(k2=>SC.free(k2)?`<tr class="npx-sub"><td class="c0">${esc(k2)}</td><td colspan="3"><span class="free">Tự do</span> · đã bán ${f0(SC.sold(D,sr,n,k2))}</td><td class="free">Tự do</td></tr>`:nRow(esc(k2),X.cell(sr,n,[k2]),'npx-sub')).join(''); return h; }).join('');
    addC(G,T); b+=`<tr class="npx-grp"><td class="c0" colspan="5">Team ${esc(ssOf(t))} · SS ${esc(ssOf(t))}</td></tr>`+rows+nRow('Tổng team '+esc(ssOf(t)),T,'npx-tot'); });
  b+=nRow('TỔNG NPP '+esc(n)+' · ASM',G,'npx-tot npx-gt');
  return `<div class="sc-scroll"><table class="sc npx-t">${HEAD.replace('%','Sales')}${b}</table></div>`; }
function khoSku(n){ const D=SC.d; const reps=nppReps(n); let b=''; const G={a:0,s:0,t:0,l:0};
  D.sku.forEach(k=>{ const fr=SC.free(k); const T={a:0,s:0,t:0,l:0}; let has=false; reps.forEach(sr=>{ const x=X.cell(sr,n,[k]); if(x.has) has=true; addC(T,x); }); const sold=reps.reduce((t,sr)=>t+SC.sold(D,sr,n,k),0); const key='k|'+k; const op=NP.open.has(key);
    if(fr){ b+=`<tr class="npx-sr"><td class="c0">${esc(k)}<small>${esc(skc(k)[0])}</small></td><td colspan="3"><span class="free">Tự do</span> · đã bán ${f0(sold)}</td><td class="free">Tự do</td></tr>`; return; }
    addC(G,T); if(!has) T.a=null;
    b+=nRow(`<span class="npx-car">${op?'▾':'▸'}</span>${esc(k)}`,T,'npx-sr'+(op?' open':''),`data-npo="${key}"`,esc(skc(k)[0]));
    if(op) b+=reps.map(sr=>nRow(esc(SRN2[sr]||sr),X.cell(sr,n,[k]),'npx-sub')).join(''); });
  b+=nRow('TỔNG NPP '+esc(n),G,'npx-tot npx-gt');
  return `<div class="sc-scroll"><table class="sc npx-t">${HEAD.replace('%','SKU')}${b}</table></div>`; }
function oName(c){ const o=(typeof OX==='function'?OX(c):null)||{}; return o.n||((SC.d||{}).names||{})[c]||''; }
const SKORD=['HS25','HSC','LMC','TS25','TSS','BIX','BVC','L35','TC25','TCS'];
const skList=()=>{ const D=SC.d; return [...SKORD.filter(k=>D.sku.includes(k)),...D.sku.filter(k=>!SKORD.includes(k))]; };
const skLab=k=>k==='L35'?'LB35':k;
function sellHTML(n){ const ret=NP.tab==='tra'; const o=NP.c?((typeof OX==='function'?OX(NP.c):null)||null):null; const sr=o&&o.sr; const reps=nppReps(n); const okSr=sr&&reps.includes(sr);
  let h=`<form class="npx-sell" id="npF" autocomplete="off"><div class="npx-row1"><label class="npx-lb">Outlet</label><div class="npx-q"><input type="search" id="npQ" data-osug="npp" placeholder="Gõ mã hoặc tên outlet" value="${esc(NP.c?NP.c+' '+oName(NP.c):'')}" aria-label="Tìm outlet theo mã hoặc tên">${NP.c?'<button type="button" class="npx-btn" data-npclr>Đổi</button>':''}</div></div>`;
  if(NP.c&&!o) h+=`<div class="npx-warn">Không tìm thấy outlet ${esc(NP.c)}.</div>`;
  if(!o) h+=`<div class="npx-row1"><label class="npx-lb">Sales phụ trách</label><div class="npx-oc npx-blank">&nbsp;</div></div>`;
  if(o) h+=`<div class="npx-row1"><label class="npx-lb">Sales phụ trách</label><div class="npx-oc ${okSr?'':'bad'}">${sr?`<b>${esc(SRN2[sr]||sr)}</b> <span>· Team ${esc(ssOf(teamOfSr(sr)))}${okSr&&X.cover(sr)?` · DMS có số đến ${fd(X.cover(sr))}`:''}</span>`:'Chưa gắn sales'}${okSr?'':`<div class="npx-err">Outlet này không thuộc sales nào của NPP ${esc(n)} → không ${ret?'nhận trả':'bán'} được.</div>`}</div></div>`;
  { const K=skList(); let tot=0; const on=!!okSr;
    h+=`<div class="sc-scroll"><table class="npx-st"><thead><tr><th class="c0">SKU</th><th>Tồn kho</th><th>${ret?'Trả':'Bán'}</th><th>Còn lại</th></tr></thead><tbody>`+K.map(k=>{ const fr=SC.free(k); const L=on?X.left(sr,n,k):0; const q=on?(+NP.it[k]||0):0; tot+=q; const af=ret?L+q:L-q;
      return `<tr data-nprow="${k}" class="${q>0?'on':'off'}"><td class="c0"><b>${esc(skLab(k))}</b><small>${esc(skc(k)[0])}</small></td><td>${on?(fr?'Tự do':f0(L)):''}</td><td><input type="number" inputmode="decimal" min="0" step="1" class="npx-in" data-npq="${k}" value="${on?esc(NP.it[k]||''):''}" ${on?'':'disabled'} aria-label="${ret?'Trả':'Bán'} ${esc(k)}"></td><td data-npaf="${k}" class="${on&&!fr&&af<0?'neg':''}">${on?(fr?'Tự do':f0(af)):''}</td></tr>`; }).join('')+
      `</tbody></table></div><div class="npx-bar"><span>Tổng <b data-nptot>${f0(tot)}</b> thùng</span><button type="submit" class="npx-ok" ${on?'':'disabled'}>OK</button></div>`; }
  if(NP.msg) h+=`<div class="npx-msg">${NP.msg}</div>`;
  h+='</form>';
  if(NP.conf&&okSr){ const Ls=skList().filter(k=>+NP.it[k]>0); const over=!ret&&Ls.some(k=>!SC.free(k)&&X.left(sr,n,k)-(+NP.it[k])<0);
    h+=`<div class="scrim" data-npno style="z-index:60"></div><div class="npx-dlg" role="dialog" aria-label="Kiểm tra lại"><b class="npx-dt">${ret?'Nhận trả hàng':'Bán hàng'} · NPP ${esc(n)}</b><div>${esc(NP.c)} · <b>${esc(o.n||'')}</b><br>Sales: <b>${esc(SRN2[sr]||sr)}</b> · ngày ${fd(today())}</div>
     <table class="npx-dl">${Ls.map(k=>`<tr><td><b>${esc(skLab(k))}</b> ${esc(skc(k)[0])}</td><td class="r"><b>${ret?'+':'−'}${f0(+NP.it[k])}</b> thùng</td></tr>`).join('')}<tr><td><b>Tổng</b></td><td class="r"><b>${f0(Ls.reduce((t,k)=>t+(+NP.it[k]),0))}</b> thùng</td></tr></table>
     ${over?'<div class="npx-err">Có SKU vượt số chia còn lại của sales (số âm = bán lố). Vẫn lưu được.</div>':''}
     <div class="small muted">Tính tạm vào "NPP nhập" cho tới khi file DMS có số của ngày ${fd(today())}.</div>
     <div class="npx-df"><button type="button" class="npx-btn" data-npno>Sửa lại</button><button type="button" class="npx-ok" data-npyes ${NP.busy?'disabled':''}>${NP.busy?'Đang lưu…':'Lưu'}</button></div></div>`; }
  return h; }
const ymdOf=s=>String(s||'').slice(0,10);
const hhmm2=at=>{ try{ const d=new Date(at); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }catch(_){ return ''; } };
function histList(n){ const F=NP.f; return X.np.filter(e=>e.npp===n&&e.d>=F.from&&e.d<=F.to&&(F.t==='all'||(F.t==='s'?e.t!=='r':e.t==='r'))).sort((a,b)=>String(b.at).localeCompare(String(a.at))); }
function histHTML(n){ const D=SC.d; const td=today(); if(!NP.f) NP.f={from:D.from,to:td<D.to?td:D.to,t:'all'}; const F=NP.f; const L=histList(n);
  const bar=`<form class="npx-hf" id="npHF"><label>Từ<input type="date" id="npHFrom" value="${F.from}"></label><label>Đến<input type="date" id="npHTo" value="${F.to}"></label><label>Loại<select id="npHT">${[['all','Cả hai'],['s','Bán'],['r','Trả']].map(([k,l])=>`<option value="${k}" ${F.t===k?'selected':''}>${l}</option>`).join('')}</select></label><button type="button" class="npx-btn" data-nphq="today">Hôm nay</button><button type="button" class="npx-btn" data-nphq="week">Tuần này</button><button type="button" class="npx-ok sm" data-npxls>⤓ Xuất Excel</button></form>`;
  if(!L.length) return bar+'<div class="npx-empty">Không có lượt bán / trả nào trong khoảng này.</div>';
  return bar+'<div class="npx-hl">'+L.map(e=>{ const cv=X.cover(e.sr); const covered=cv&&e.d<=cv; const tot=(e.items||[]).reduce((t,i)=>t+(+i.q||0),0); const can=X.canEdit()||(e.by===me()&&e.d===td);
    return `<div class="npx-h ${covered?'cov':''}"><div class="npx-hh"><span class="npx-b ${e.t==='r'?'r':'s'}">${e.t==='r'?'Trả':'Bán'}</span><b>${esc(e.c||'')} · ${esc(e.n||oName(e.c))}</b><span class="small muted">${esc(fd(e.d))} ${esc(hhmm2(e.at))} · ${esc(SRN2[e.sr]||e.sr)}</span></div>
      <div class="npx-hi">${(e.items||[]).map(i=>`<span>${esc(skLab(i.k))} <b>${e.t==='r'?'+':'−'}${f0(i.q)}</b></span>`).join('')}<span class="npx-ht">Tổng ${f0(tot)} thùng</span></div>
      <div class="npx-hs">${covered?`<span class="npx-cov">DMS đã có số tới ${fd(cv)} → lượt này không còn tính (số DMS thay thế)</span>`:'<span class="npx-tmp">Đang tính tạm vào NPP nhập</span>'}${can?(NP.del===e.id?`<button type="button" class="npx-btn danger" data-npdel="${esc(e.id)}">Bấm lần nữa để xoá</button>`:`<button type="button" class="npx-btn" data-npdel="${esc(e.id)}">Xoá</button>`):''}</div></div>`; }).join('')+'</div>'; }
const memName=id=>{ const m=(S.members||{})[id]; return m?(m.name||m.short||id):(id||''); };
const srFull=sr=>memName((typeof SRK0!=='undefined'&&SRK0[sr])||'')||SRN2[sr]||sr;
async function exportXlsx(n){ if(typeof XLSX==='undefined'){ try{ toast('Chưa tải được bộ tạo file Excel. Kiểm tra mạng rồi thử lại.'); }catch(_){ } return; }
  const F=NP.f; const L=histList(n).slice().reverse(); const K=skList(); const reps=nppReps(n); const sg=e=>e.t==='r'?-1:1;
  const wb=XLSX.utils.book_new(); const fmtD=d=>d.slice(8,10)+'/'+d.slice(5,7)+'/'+d.slice(0,4);
  const add=(name,rows,cols)=>{ const ws=XLSX.utils.aoa_to_sheet(rows); ws['!cols']=cols||rows.reduce((w,r)=>{ r.forEach((v,i)=>{ w[i]=Math.max(w[i]||6,Math.min(40,String(v??'').length+2)); }); return w; },[]).map(w=>({wch:w})); XLSX.utils.book_append_sheet(wb,ws,name.slice(0,31)); };
  const tl={all:'Bán + Trả',s:'Bán',r:'Trả'}[F.t];
  const det=[[`NPP ${n} (${NPPDIS[n]||''}) · chi tiết ${tl} từ ${fmtD(F.from)} đến ${fmtD(F.to)} · xuất lúc ${new Date().toLocaleString('vi-VN')}`],[],['Ngày','Giờ','Loại','Mã outlet','Tên outlet','Sales','SS','SKU','Số thùng','Người nhập','Trạng thái']];
  L.forEach(e=>{ const cv=X.cover(e.sr); (e.items||[]).forEach(i=>det.push([fmtD(e.d),hhmm2(e.at),e.t==='r'?'Trả':'Bán',e.c||'',e.n||oName(e.c),srFull(e.sr),'SS '+ssOf(teamOfSr(e.sr)),skLab(i.k),sg(e)*(+i.q||0),memName(e.by)||e.u||'',cv&&e.d<=cv?'DMS đã có số (không còn tính tạm)':'Đang tính tạm'])); });
  if(det.length===3) det.push(['Không có dữ liệu trong khoảng này']);
  add('Chi tiết',det);
  const days=[...new Set(L.map(e=>e.d))].sort();
  days.forEach(d=>{ const rows=[['','',`SỐ XUẤT CHI TIẾT NGÀY ${fmtD(d)} · NPP ${n} · ${tl} (bán +, trả −)`],['STT','SALES',...K.map(skLab),'TỔNG']]; const T=K.map(()=>0);
    reps.forEach((sr,ix)=>{ const v=K.map(k=>L.filter(e=>e.d===d&&e.sr===sr).reduce((t,e)=>t+(e.items||[]).filter(i=>i.k===k).reduce((a,i)=>a+sg(e)*(+i.q||0),0),0)); v.forEach((x,j)=>T[j]+=x); const s=v.reduce((a,b)=>a+b,0); rows.push([ix+1,srFull(sr),...v.map(x=>x||''),s||'']); });
    rows.push(['','TỔNG SỐ XUẤT',...T.map(x=>x||0),T.reduce((a,b)=>a+b,0)]); add(d.slice(8,10)+'-'+d.slice(5,7),rows); });
  const wk=Object.keys(SC.weeks||{}).sort().filter(k=>k<=F.to).pop(); const W=wk&&SC.weeks[wk];
  if(W){ const D0=SC.d; SC.d=W; try{ const hdr=['STT','SALES',...K.map(skLab)]; const blank=K.map(()=>''); const head=['','',`SỐ CHIA TUẦN ${fd(W.from)}–${fd(W.to)} (đầu kỳ)`,...blank.slice(1),'',`TỔNG XUẤT QUA APP ${fd(F.from)}–${fd(F.to)} (${tl})`,...blank.slice(1),'','ĐÃ BÁN THEO DMS (cả tuần)',...blank.slice(1),'','SỐ CÒN (đầu kỳ − DMS − NPP nhập chưa có DMS)',...blank.slice(1)];
      const rows=[[`NPP ${n} · tuần ${fd(W.from)}–${fd(W.to)} · 'tự do' = tuần này SKU không có số chia`],head,[...hdr,'',...K.map(skLab),'',...K.map(skLab),'',...K.map(skLab)]];
      reps.forEach((sr,ix)=>{ const al=((W.alloc||{})[sr]||{})[n]; const a=K.map(k=>SC.free(k)?'tự do':(al?Math.round((+al[k]||0)*100)/100:'')); const x=K.map(k=>L.filter(e=>e.sr===sr&&e.d>=W.from&&e.d<=W.to).reduce((t,e)=>t+(e.items||[]).filter(i=>i.k===k).reduce((s2,i)=>s2+sg(e)*(+i.q||0),0),0)||'');
        const sd=K.map(k=>SC.sold(W,sr,n,k)||''); const c=K.map(k=>SC.free(k)?'tự do':(al?Math.round(X.left(sr,n,k)*100)/100:'')); rows.push([ix+1,srFull(sr),...a,'',...x,'',...sd,'',...c]); });
      add('Tuần',rows); } finally{ SC.d=D0; } }
  const out=XLSX.write(wb,{bookType:'xlsx',type:'array'}); const fn=`NPP_${n}_${F.t==='all'?'BanTra':F.t==='s'?'Ban':'Tra'}_${F.from}_${F.to}.xlsx`;
  let dl=null; try{ dl=await claude.use('downloads'); }catch(_){ }
  if(!dl){ try{ toast('Thiết bị này không tải được file. Mở app trong Claude rồi thử lại.'); }catch(_){ } return; }
  try{ await dl.save({filename:fn,data:new Uint8Array(out)}); try{ toast('Đã tải '+fn); }catch(_){ } }catch(err){ if(err&&err.code==='declined') return; try{ toast('Không tải được file: '+((err&&(err.message||err.code))||'lỗi')); }catch(_){ } } }
X.exportXlsx=exportXlsx;
function nppHTML(){ const n=myNpp(); if(!n) return '<div class="empty"><b>Tài khoản NPP chưa gắn mã NPP</b></div>';
  if(!X.key[n]) return `<div class="npx">${X.gateHTML()}</div>`;
  if(!SC.d) return '<div class="empty"><b>Đang giải mã số chia…</b></div>';
  const D=SC.d; const td=today(); const nT=X.np.filter(e=>e.npp===n&&e.d===td).length;
  const tabs=[['kho','📦 Tồn kho'],['ban','🛒 Bán hàng'],['tra','↩ Trả hàng'],['ls','🧾 Lịch sử'+(nT?` <i>${nT}</i>`:'')]];
  let body=''; if(NP.tab==='kho') body=`<div class="npx-kh"><div class="npx-seg">${[['sr','Theo sales'],['sku','Theo SKU']].map(([k,l])=>`<button type="button" data-npm="${k}" aria-pressed="${NP.mode===k}">${l}</button>`).join('')}</div>${SC.weekBar()}</div>`+(NP.mode==='sku'?khoSku(n):khoSales(n))+`<div class="small muted npx-note"><b>Đầu kỳ</b> = dư tuần trước + số chia mới + luân chuyển · <b>Đã bán</b> = đơn DMS của NPP ${esc(n)} · <b>NPP nhập</b> = NPP bán − nhận trả qua app những ngày DMS chưa có số (khi DMS có số ngày đó thì số DMS thay thế) · <b>Còn lại</b> = Đầu kỳ − Đã bán − NPP nhập · số âm = bán lố.</div>`;
  else if(NP.tab==='ls') body=histHTML(n); else body=sellHTML(n);
  return `<div class="npx"><div class="npx-hd"><div><h2>NPP ${esc(n)}</h2><span>Mã NPP ${esc(NPPDIS[n]||'')} · số chia tuần ${fd(D.from)}–${fd(D.to)}</span></div></div>
   <div class="npx-tabs" role="tablist">${tabs.map(([k,l])=>`<button type="button" role="tab" data-npt="${k}" aria-selected="${NP.tab===k}">${l}</button>`).join('')}</div>${body}</div>`; }
let rIn=false;
function nppRoot(){ if(rIn){ setTimeout(()=>{ try{ render(); }catch(_){ } },0); return; } rIn=true; try{ nppRoot0(); } finally{ rIn=false; } }
function nppRoot0(){ document.body.classList.add('nppmode'); const v=$('#view'); const m=memOf(me())||{};
  const dot=$('#dot'); if(dot) dot.className='dot '+(S.conn==='on'?'on':S.conn==='off'?'off':'');
  const wt=$('#whoTxt'); if(wt) wt.innerHTML=`<b>${esc(m.name||'NPP')}</b> <span class="muted">· NPP</span> <button type="button" class="btn sm ghost" id="lgOut">Đăng xuất</button>`; const lo=$('#lgOut'); if(lo) lo.onclick=doLogout;
  const y=window.scrollY; v.innerHTML=nppHTML(); window.scrollTo(0,y); }
X.nppRoot=nppRoot;
/* outlet gợi ý: tài khoản NPP chỉ thấy outlet của sales thuộc NPP mình */
try{ const oc1=oCands; oCands=function(q){ if(!isNpp()) return oc1(q); const n=myNpp(); const reps=SC.d?nppReps(n):(REPS0[n]||[]); q=nrm(q); if(!q) return []; const out=[]; Object.values(S.mst||{}).forEach(o=>{ if(!reps.includes(o.sr)) return; const c=String(o.code), nn=nrm(o.n); const sc=c.startsWith(q)?0:c.includes(q)?1:nn.startsWith(q)?2:nn.includes(q)?3:nn.split(/\s+/).some(w=>w.startsWith(q))?4:9; if(sc<9) out.push([sc,o]); }); return out.sort((a,b)=>a[0]-b[0]||String(a[1].n).localeCompare(String(b[1].n),'vi')).slice(0,8).map(x=>x[1]); }; }catch(_){ }
document.addEventListener('change',e=>{ const t=e.target; if(!t||t.id!=='npQ'||!isNpp()) return; const m=String(t.value||'').match(/\d{8}/); if(m&&(S.mst||{})[m[0]]&&NP.c!==m[0]){ NP.c=m[0]; NP.msg=''; NP.it={}; setTimeout(()=>{ try{ render(); }catch(_){ } },0); } });
document.addEventListener('input',e=>{ const t=e.target; if(!t||!t.dataset||!t.dataset.npq) return; const k=t.dataset.npq; NP.it[k]=t.value; const n=myNpp(); const o=OX(NP.c)||{}; const fr=SC.free(k); const L=X.left(o.sr,n,k); const q=+t.value||0; const af=NP.tab==='tra'?L+q:L-q; const c=document.querySelector(`[data-npaf="${k}"]`); if(c){ c.className=!fr&&af<0?'neg':''; c.textContent=fr?'Tự do':f0(af); } const r=document.querySelector(`[data-nprow="${k}"]`); if(r) r.className=q>0?'on':'off'; const tt=document.querySelector('[data-nptot]'); if(tt) tt.textContent=f0(skList().reduce((s2,k2)=>s2+(+NP.it[k2]||0),0)); });
document.addEventListener('wheel',e=>{ const t=e.target; if(t&&t.classList&&t.classList.contains('npx-in')&&document.activeElement===t) t.blur(); },{passive:true});
document.addEventListener('change',e=>{ const t=e.target; if(!t||!isNpp()) return; if(t.id==='npHFrom'||t.id==='npHTo'||t.id==='npHT'){ const F=NP.f||{}; if(t.id==='npHFrom') F.from=t.value||F.from; if(t.id==='npHTo') F.to=t.value||F.to; if(t.id==='npHT') F.t=t.value; if(F.from>F.to){ const x=F.from; F.from=F.to; F.to=x; } NP.f=F; setTimeout(()=>{ try{ render(); }catch(_){ } },0); } });
document.addEventListener('submit',e=>{ if(!e.target||e.target.id!=='npF') return; e.preventDefault(); const L=skList().filter(k=>+NP.it[k]>0); if(!L.length){ NP.msg='<span class="npx-err">Nhập số thùng cho ít nhất 1 SKU.</span>'; render(); return; } NP.conf=true; NP.msg=''; render(); });
document.addEventListener('click',async e=>{ const t=e.target; if(!t.closest||!isNpp()) return; let b;
  if((b=t.closest('[data-npt]'))){ e.preventDefault(); const nt=b.dataset.npt; if((nt==='ban'||nt==='tra')&&NP.tab!==nt){ NP.it={}; NP.conf=false; } NP.tab=nt; NP.msg=''; NP.del=null; render(); window.scrollTo(0,0); return; }
  if((b=t.closest('[data-npm]'))){ e.preventDefault(); NP.mode=b.dataset.npm; render(); return; }
  if((b=t.closest('[data-nphq]'))){ e.preventDefault(); const D=SC.d; const td=today(); NP.f={...(NP.f||{t:'all'}),...(b.dataset.nphq==='today'?{from:td,to:td}:{from:D.from,to:td<D.to?td:D.to})}; render(); return; }
  if(t.closest('[data-npxls]')){ e.preventDefault(); exportXlsx(myNpp()); return; }
  if((b=t.closest('[data-npo]'))){ e.preventDefault(); const k=b.dataset.npo; NP.open.has(k)?NP.open.delete(k):NP.open.add(k); render(); return; }
  if(t.closest('[data-npclr]')){ e.preventDefault(); NP.c=''; NP.it={}; NP.msg=''; render(); setTimeout(()=>{ const i=document.getElementById('npQ'); if(i) i.focus(); },30); return; }
  if(t.closest('[data-npno]')){ e.preventDefault(); NP.conf=false; render(); return; }
  if(t.closest('[data-npyes]')){ e.preventDefault(); if(NP.busy) return; const n=myNpp(); const o=OX(NP.c)||{}; const L=skList().filter(k=>+NP.it[k]>0).map(k=>({k,q:Math.round((+NP.it[k])*100)/100})); if(!L.length||!o.sr) return; NP.busy=true; render();
    const rec={t:NP.tab==='tra'?'r':'s',npp:n,sr:o.sr,c:NP.c,n:o.n||'',items:L,d:today(),by:me(),u:S.login&&S.login.u,at:new Date().toISOString()};
    try{ await X.npSave(rec); const tot=L.reduce((s,x)=>s+x.q,0); NP.msg=`✓ Đã lưu ${rec.t==='r'?'nhận trả':'bán'} ${f0(tot)} thùng · ${esc(NP.c)} ${esc(o.n||'')} (${esc(SRN2[o.sr]||o.sr)}). Số chia của sales đã cập nhật.`; NP.c=''; NP.it={}; NP.conf=false; try{ toast('Đã lưu'); }catch(_){ } }
    catch(err){ NP.msg=`<span class="npx-err">Chưa lưu được: ${esc(err.message||err.code||String(err))}</span>`; NP.conf=false; }
    NP.busy=false; render(); return; }
  if((b=t.closest('[data-npdel]'))){ e.preventDefault(); const id=b.dataset.npdel; if(NP.del!==id){ NP.del=id; render(); return; } const x=X.np.find(y=>y.id===id); if(!x) return; if(!(X.canEdit()||(x.by===me()&&x.d===today()))){ try{ toast('Chỉ xoá được lượt của mình trong ngày'); }catch(_){ } return; }
    try{ await X.npDel(id); NP.del=null; try{ toast('Đã xoá'); }catch(_){ } }catch(err){ try{ toast('Chưa xoá được: '+(err.message||err.code)); }catch(_){ } } render(); return; } });
/* ---------- gắn vào app ---------- */
try{ const dl0=doLogin; doLogin=async function(u,p){ const r=await dl0.apply(this,arguments); if(!r){ X.clear(); X.unlock(u,p).then(()=>{ try{ render(); }catch(_){ } }); } return r; }; }catch(e){ console.warn('scx login',e); }
try{ const lo0=doLogout; doLogout=function(){ X.clear(); document.body.classList.remove('nppmode'); return lo0.apply(this,arguments); }; }catch(e){ console.warn('scx logout',e); }
function hook(){ const r0=render; render=function(){ if(isNpp()){ try{ nppRoot(); }catch(e){ console.error(e); const v=$('#view'); if(v) v.innerHTML=`<div class="empty"><b>Màn hình NPP đang gặp lỗi</b><span class="small muted">${esc(String(e&&e.message||e))}</span></div>`; } return; } document.body.classList.remove('nppmode'); return r0.apply(this,arguments); }; }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hook); else hook();
X.kick=()=>tick();
let lsDone=null;
let tBusy=false;
async function tick(){ if(tBusy||X.migBusy) return; tBusy=true; try{ if(typeof S==='undefined'||!S.db) return;
  if(isNpp()&&Object.values(X.src).includes('owner')){ Object.keys(X.src).forEach(n=>{ if(X.src[n]==='owner'){ delete X.raw[n]; delete X.key[n]; delete X.src[n]; } }); X.ownerTried=false; X.cache={}; X.t12=null; SC.d=null; SC.weeks=null; X.has=false; } const u=S.login&&S.login.u; if(u!==lsDone){ lsDone=u; await loadLS(); X.t12=null; }
  if(S.isOwner&&!isNpp()){ await ownerKeys(); if(X.migrate&&!X.migDone&&S.t12&&S.ready&&S.ready.m) await X.migrate(); }
  if(S.t12) await X.sync(false);
  if(S.isOwner&&!isNpp()&&X.has&&!X.wrDone) await ensureWraps(); }catch(e){ console.warn('scx tick',e); } finally{ tBusy=false; } }
setInterval(tick,700);
}catch(e){ console.warn('scx',e); } })();
