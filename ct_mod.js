/* ct_mod.js · 06/11/2026 · v7 */
(function(){ var st=document.createElement('style'); st.id='ctCss'; st.textContent="\n.ctw{display:grid;gap:12px}\n.ct-tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}\n@media (max-width:760px){.ct-tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}\n.ct-tile{--c:#0D6B3D;--t:#E6F4EC;display:grid;gap:4px;text-align:left;background:#fff;border:1.5px solid #B9C1BC;border-top:5px solid var(--c);border-radius:12px;padding:10px 14px 12px;cursor:pointer;font:inherit;color:#16241C;transition:box-shadow .15s}\n.ct-tile:hover{box-shadow:0 2px 10px rgba(0,0,0,.08)}\n.ct-tile.ctbadge-on{background:var(--t);border-color:var(--c);box-shadow:0 0 0 2px var(--c) inset}\n.ct-tile .t{font-weight:800;font-size:15px;display:flex;align-items:center;gap:8px;color:var(--c)}\n.ct-tile .ic{width:26px;height:26px;border-radius:8px;background:var(--c);color:#fff;display:inline-grid;place-items:center;font-size:14px}\n.ct-tile .n{font-size:30px;font-weight:800;line-height:1.05;color:var(--c)}\n.ct-tile .n small{font-size:14px;font-weight:600;color:#4A5A51}\n.ct-tile .s{font-size:12.5px;color:#4A5A51}\n.ct-tile .gp{display:inline-block;background:#C62828;color:#fff;font-weight:800;font-size:12px;border-radius:999px;padding:1px 8px;margin-left:4px}\n.ctbadge-so{--c:#0D6B3D;--t:#E6F4EC}.ctbadge-tb{--c:#1F5FA8;--t:#E7F0FA}.ctbadge-kc{--c:#B85600;--t:#FDF0E3}.ctbadge-md{--c:#6B3FA0;--t:#F1EAFA}\n.ct-dot{width:10px;height:10px;border-radius:50%;display:inline-block;flex:none}\n.ct-dot.bad{background:#C62828}.ct-dot.warn{background:#E3A800}.ct-dot.ok{background:#1E8E4E}.ct-dot.n{background:#9AA5A0}\n.ct-h2{font-size:17px;font-weight:800;margin:6px 0 0;color:var(--c,#16241C);border-left:5px solid var(--c,#16241C);padding-left:10px}\n.ct-h2 .k{color:#C62828}\n.ct-sub{font-size:12.5px;color:#4A5A51}\n.ct-progs{display:flex;flex-wrap:wrap;gap:8px}\n.ct-pg{border:1.5px solid var(--c);border-radius:10px;background:var(--t);padding:0;max-width:100%}\n.ct-pg>summary{list-style:none;cursor:pointer;padding:7px 12px;font-size:13.5px;display:flex;gap:8px;align-items:center;color:#16241C}\n.ct-pg>summary::-webkit-details-marker{display:none}\n.ct-pg>summary b{font-weight:800;color:var(--c)}\n.ct-pg>summary .cnt{background:#fff;border:1px solid var(--c);border-radius:999px;padding:1px 8px;font-weight:700;font-size:12.5px}\n.ct-pg>summary .cnt i{font-style:normal;color:#C62828}\n.ct-pg>summary .rq{font-size:12.5px;color:var(--c);font-weight:700}\n.ct-pg[open]{flex-basis:100%;background:#fff}\n.ct-note{padding:8px 12px 10px;font-size:13.5px;line-height:1.55;border-top:1px solid #DDE2DF;color:#1E2B24;white-space:pre-line}\n.ct-note .src{display:block;margin-top:6px;font-size:12px;color:#6B7A72}\n.ct-list{display:grid;gap:8px}\n.ct-o{background:#fff;border:1.5px solid #B9C1BC;border-radius:12px;padding:10px 12px;display:grid;gap:7px}\n.ct-o .h{display:flex;gap:8px;align-items:center;flex-wrap:wrap}\n.ct-o .h b{font-size:15px}\n.ct-o .h .cd{font-size:12.5px;color:#6B7A72;font-family:ui-monospace,monospace}\n.ct-o .h .srp{font-size:12px;font-weight:800;color:#fff;background:#3B4A42;border-radius:999px;padding:1px 9px}\n.ctg{border:1px solid #CDD3D0;border-radius:10px;background:#fff;overflow:hidden}\n.ctg>summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:auto auto 1fr auto;gap:10px;align-items:center;padding:9px 12px;font-size:14px}\n.ctg>summary::-webkit-details-marker{display:none}\n.ctg>summary .g{font-weight:800;color:#fff;background:var(--c,#3B4A42);border-radius:7px;padding:2px 9px;font-size:13px;min-width:84px;text-align:center}\n.ctg>summary .x{color:#1E2B24;overflow:hidden;text-overflow:ellipsis}\n.ctg>summary .x b.bad{color:#C62828;font-size:15px}\n.ctg>summary .x b.ok{color:#1E8E4E}\n.ctg>summary .x .pn{color:#4A5A51}\n.ctg>summary .ar{color:#6B7A72;font-size:12px;transition:transform .15s}\n.ctg[open]>summary .ar{transform:rotate(90deg)}\n.ctbadge-lv-bad{border-left:5px solid #C62828}.ctbadge-lv-bad>summary{background:#FDEEEE}\n.ctbadge-lv-warn{border-left:5px solid #E3A800}.ctbadge-lv-warn>summary{background:#FFF7E0}\n.ctbadge-lv-ok{border-left:5px solid #1E8E4E}.ctbadge-lv-ok>summary{background:#EAF6EF}\n.ctg .ib{border-top:1px solid #DDE2DF;padding:10px 12px;display:grid;gap:12px}\n.ct-it{display:grid;gap:3px}\n.ct-it .nm{font-weight:800;font-size:14px;color:var(--c,#16241C)}\n.ct-it .st{font-size:13px}\n.ct-it .rq{font-size:12.5px;color:#2E3B34;background:#F5F6F6;border:1px solid #DDE2DF;border-left:3px solid var(--c,#9AA5A0);border-radius:8px;padding:6px 10px;margin-top:4px;white-space:pre-line;line-height:1.5}\n.ctv{display:grid;gap:8px;padding:10px 12px 12px}\n.ct-mx{overflow:auto;border:1.5px solid #B9C1BC;border-radius:10px;background:#fff}\n.ct-mx table{border-collapse:collapse;width:100%;font-size:13.5px;min-width:520px}\n.ct-mx th,.ct-mx td{border:1px solid #CDD3D0;padding:7px 10px;text-align:right;white-space:nowrap}\n.ct-mx thead th{background:#16241C;color:#fff;font-weight:800}\n.ct-mx td:first-child,.ct-mx th:first-child{text-align:left}\n.ct-mx tr.ctbadge-gh td{background:var(--t);color:var(--c);font-weight:800;text-align:left;border-left:5px solid var(--c)}\n.ct-mx td.full{color:#1E8E4E;font-weight:800}.ct-mx td.low{color:#C62828;font-weight:800}\n.ct-more{justify-self:start}\n.org{display:grid;gap:10px}\n.org .asm,.org .ss{background:#fff;border:1.5px solid #B9C1BC;border-radius:10px;padding:8px 12px}\n.org .asm{border-color:#0D6B3D;border-width:2px}\n.org .lv{font-size:11.5px;font-weight:800;color:#0D6B3D;text-transform:uppercase;letter-spacing:.03em}\n.org .nm{font-weight:800}\n.org .u{font-size:12px;color:#4A5A51;font-family:ui-monospace,monospace}\n.org .sss{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;padding-left:14px;border-left:3px solid #CDD3D0}\n.org .srs{display:grid;gap:3px;margin-top:6px;padding-top:6px;border-top:1px solid #DDE2DF;font-size:13px}\n.org .nod{color:#8A9690;font-size:12px}\n\n.ctg .ib{padding:4px 0 2px;gap:0}\n.cti{border-top:1px solid #E3E7E5}\n.cti:first-child{border-top:0}\n.ctr{list-style:none;cursor:pointer;display:grid;grid-template-columns:minmax(120px,1.3fr) auto minmax(60px,110px) auto minmax(0,1.4fr);gap:10px;align-items:center;padding:8px 12px;font-size:13.5px}\n.ctr::-webkit-details-marker{display:none}\n.ctr:hover{background:#F5F6F6}\n.ctr .pn2{font-weight:800;color:var(--c,#16241C);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.ctr .nu{white-space:nowrap;font-variant-numeric:tabular-nums}\n.ctr .mu{color:#6B7A72;font-size:12px}\n.ctr .mb{height:8px;border-radius:99px;background:#E3E7E5;overflow:hidden;display:block}\n.ctr .mb i{display:block;height:100%;background:#E3A800;border-radius:99px}\n.ctr .mb i.full{background:#1E8E4E}\n.ctr .chp{font-size:12px;font-weight:800;border-radius:999px;padding:2px 9px;white-space:nowrap}\n.ctr .chp.bad{background:#C62828;color:#fff}.ctr .chp.ok{background:#1E8E4E;color:#fff}\n.ctr .tl{color:#4A5A51;font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n@media (max-width:700px){.ctr{grid-template-columns:1fr auto auto;row-gap:4px}.ctr .mb{grid-column:1/-1;order:5}.ctr .tl{grid-column:1/-1;order:6;white-space:normal}}\n.cti[open]>.ctr{background:#F5F6F6}\n.cdet{padding:6px 12px 12px;border-top:1px dashed #CDD3D0}\n.cdet .vp>.vph{display:none}\n.crq{margin-top:6px}\n.crq>summary{cursor:pointer;font-size:12.5px;color:var(--c,#3B4A42);font-weight:700;list-style:none}\n.crq>summary::-webkit-details-marker{display:none}\n.crq .rq{font-size:12.5px;color:#2E3B34;background:#F5F6F6;border:1px solid #DDE2DF;border-radius:8px;padding:6px 10px;margin-top:4px;white-space:pre-line;line-height:1.5}\n\n.bctag{display:inline-block;font-size:10.5px;font-weight:800;color:#7A4D00;background:#FFE7A8;border:1px solid #E3B505;border-radius:5px;padding:0 5px;margin-left:4px;vertical-align:1px;letter-spacing:.01em}\n.ctx{padding:8px 12px;border-top:1px solid #E3E7E5}\n"; document.head.appendChild(st); })();
(function(){ try{
/* 06/11/2026 · HỆ THỐNG LẠI CHƯƠNG TRÌNH theo việc sales phải làm: Về số · Trưng bày · Kích cầu · Mở điểm.
   - Danh mục chương trình mới: prog/CT (defs) + prog/CT_<id> (outlet). Chương trình cũ (TIP, TLP, P4G, Big Campaign, Display, Bundle…) được xếp vào 4 nhóm.
   - Thẻ outlet ở Visit: mỗi nhóm 1 dòng, bấm mở ra từng chương trình + yêu cầu ngắn gọn.
   - Promotion: tab "Việc cần làm" = 4 ô lớn + danh sách outlet cần làm + bảng chương trình × sales (SS/ASM). */
const G=[['so','Sell-in','Mua đủ target trong kỳ'],['kc','Sell-out','Khuyến mãi tại quán'],['tb','Display','Trưng bày, chụp hình mỗi tháng'],['md','Việc khác','Plan, ký HĐ, mở phủ, task']];
/* Big Campaign chỉ là tag gắn lên chương trình (Trade Rural, A3, Rural HTT, Bivina…) */
const BIGC=k=>/^(D10|D20|SO_|A3D|GB|RUR)/.test(String(k||''));
const GN=Object.fromEntries(G.map(g=>[g[0],g[1]]));
const LV={bad:0,warn:1,ok:2};
const f0=n=>Math.round(+n||0).toLocaleString('vi-VN');
const ym=()=>{ try{ return curYM(); }catch(_){ return today().slice(0,7); } };
const ymL=m=>'T'+(+m.slice(5,7));
/* ---- yêu cầu ngắn của từng chương trình (hiện khi bấm vào) ---- */
const NOTE={
 TIP1:'Mua đủ target tháng (thùng), tính theo 3 nhóm SKU:\n• LB355, BIP, BVP: 10.000đ/thùng\n• LMC, BIX, LSC: 8.000đ/thùng\n• SKU khác: 4.000đ/thùng\nĐạt tháng nào trả tháng đó.',
 TIP2:'Hỗ trợ thêm cho outlet P4G bán tăng LB355 & BIP: mua đủ target LB355/BIP trong tháng, thưởng 10.000đ/thùng. Đạt tháng nào trả tháng đó.',
 TLP:'Mua đủ target tháng T10–T12/2026 để nhận thưởng TLP.',
 P4G:'Hợp đồng tie-up: mua đủ target tháng ghi trong HĐ để được chi theo từng kỳ. HĐ hết hạn thì chào ký lại.',
 P4GPLAN:'Outlet nằm trong kế hoạch ký P4G (OGSM): chào ký HĐ từ tháng plan.',
 RUR:'Outlet Rural (HTT) trong plan Q4/2026: làm theo hoạt động ghi trên plan, ký P4G theo target Q4.',
 D10:'Mua & trưng bày 10 thùng HVN, chụp 1 hình đạt mỗi tháng → tặng 1 thùng TC25/tháng.\nThời gian: 01/10 – 31/12/2026.',
 D20:'Mua & trưng bày 20 thùng HVN, chụp 1 hình đạt mỗi tháng → tặng 2 thùng TC25/tháng.\nThời gian: 01/10 – 31/12/2026.',
 A3D:'Trưng bày theo plan A3 (Winning in Rural), chụp hình mỗi tháng.',
 SO_TC25:'Sampling on-trade: khách uống 4 lon TC25 tặng 1 lon TC25.\nThời gian: 01/10 – 30/11/2026. Gratis tối đa theo outlet.',
 SO_LMC:'Sampling on-trade: khách uống 4 lon LMC tặng 1 lon LMC.\nThời gian: 01/11 – 30/11/2026. Gratis tối đa theo outlet.',
 GB:'Gratis Bundle: mua X tặng Y theo đề xuất đã duyệt, trong giới hạn gratis.',
 Display:'Trưng bày theo đề xuất, chụp hình mỗi tháng.'
};
const MASSN={1:'Scheme 1 · Mua 10 thùng HVN trong kỳ\n• Trưng bày 2 cây, mỗi cây tối thiểu 5 thùng: 1 cây Heineken & Tiger + 1 cây Larue & Bivina\n• Cần ít nhất 1 hình ĐẠT mỗi tháng\n→ Thưởng 1 thùng Bivina/tháng, trả 2 tháng/lần.',
  2:'Scheme 2 · Mua 20 thùng HVN trong kỳ\n• Trưng bày 4 cây, mỗi cây tối thiểu 5 thùng: Heineken, Tiger, Larue, Bivina mỗi brand 1 cây\n• Cần ít nhất 1 hình ĐẠT mỗi tháng\n→ Thưởng 2 thùng Bivina/tháng, trả 2 tháng/lần.'};
const DEFS=[
 {id:'MASSD',name:'Mass Display',grp:['so','tb'],from:'2026-11-01',to:'2027-06-30',src:'S15S27 MKD Display Project · mass display 11/26 – 06/27 (chỉ outlet đã đăng ký scheme 1/2; ô trống = không làm)'},
 {id:'HTT',name:'Rural HTT · cần ký P4G',grp:['md'],from:'2026-10-01',to:'2026-12-31',src:'S27 MKD Danh sách outlets Rural (HTT) update 23/10 · sheet Outlets'},
 {id:'BIXD',name:'Mở phủ Bivina',grp:['md'],from:'2026-10-01',to:'2026-12-31',src:'Winning in Rural A3 · Distribution Bivina (outlet pool S27)'},
 {id:'TIP1S',name:'TIP 1',grp:['so'],from:'2026-10-01',to:'2026-12-31',src:'File Target Inc 1 · sheet 10.26'},
 {id:'TIP2S',name:'TIP 2',grp:['so'],from:'2026-10-01',to:'2026-12-31',src:'File Target Inc 2 · sheet List'}];
const defs=()=>{ const d=((S.prog||{}).CT||{}).defs; return Array.isArray(d)&&d.length?d:DEFS; };
const ctRow=(id,c)=>(((S.prog||{})['CT_'+id]||{}).rows||{})[c]||null;
const live=d=>{ const t=today(); return (!d.from||t>=d.from)&&(!d.to||t<=d.to); };
/* nhóm của 1 chương trình cũ */
const grpOf=p=>{ const k=String(p.k||''); if(p.disp||k==='Display'||/^(D10|D20|A3D)/.test(k)) return 'tb'; if(/^(SO_|GB)/.test(k)||/bundle|banquet|mini/i.test(k+' '+(p.t||''))) return 'kc'; if(k==='P4GPLAN'||k==='RUR'||p.planK) return 'md'; if(['TIP1','TIP2','TLP','P4G'].includes(k)) return 'so'; return 'kc'; };
const noteOf=p=>NOTE[p.k]||(/^SO_/.test(p.k)?NOTE.SO_TC25:'')||'';
const lvOf=p=>{ const iss=String(p.issue||''); if(/hết hạn|Chậm|thiếu|Chưa có ảnh/i.test(iss)) return 'bad'; try{ if(progOK(p)||(isPlanP(p)&&p.done)) return 'ok'; }catch(_){ } if(p.disp&&!p.ph) return 'warn'; if(p.tgt&&p.act!=null&&p.act>=p.tgt) return 'ok'; return iss?'warn':'warn'; };
const gapOf=p=>{ if(p.tgt&&p.act!=null&&p.act<p.tgt) return p.tgt-p.act; if(p.k==='P4G'){ const m=(p.mi||[]).find(x=>x.st==='run'); if(m&&m.act<m.tgt) return m.tgt-m.act; } if(p.k==='TLP'){ const b=(p.bars||[])[0]; if(b&&b.tgt&&b.act<b.tgt) return b.tgt-b.act; } return 0; };
/* ---- gom mọi chương trình của 1 outlet ---- */
function items(c,pg){ c=String(c); const out=[]; const M=ym();
  try{ pg=pg||progsM(c); }catch(_){ pg=pg||{si:[],so:[],ds:[]}; }
  const all=[...(pg.si||[]),...(pg.so||[]),...(pg.ds||[])];
  const has=k=>all.some(p=>p.k===k);
  all.forEach(p=>{ let hide=false; try{ hide=progHide(p)&&!(p.k==='P4G'&&p.st==='exp')&&!(isPlanP(p)&&!p.done); }catch(_){ } if(hide) return;
    if(p.k==='P4G'&&p.st==='exp'){ out.push({g:'md',nm:'P4G hết hạn',st:'HĐ hết hạn '+String(p.per||'').split('–').pop().trim()+', chưa ký lại',rq:NOTE.P4G,lv:'bad',p}); return; }
    out.push({g:grpOf(p),nm:p.t||p.k,st:p.issue||'',rq:noteOf(p),lv:lvOf(p),gap:gapOf(p),p,tag:BIGC(p.k)?'Big Campaign':''}); });
  try{ const rp=rurPlan(c); if(rp) out.push({g:'md',nm:rp.t,st:rp.sub||'',rq:NOTE.RUR,lv:rp.done?'ok':'warn',tag:'Big Campaign'}); }catch(_){ }
  /* Banquet / Mini-Banquet = Sell-out */
  try{ const bm=today().slice(0,7);
    if(typeof CATS!=='undefined'&&CATS.has(c)){ const b=banqOf(c,bm); out.push({g:'kc',nm:'Banquet',cnt:b.n,tail:b.v?'giá trị '+fMs(b.v):'',lv:b.n?'ok':'warn',st:b.n?'':'Chưa có tiệc '+ymL(bm)}); }
    if(typeof MCATS!=='undefined'&&MCATS.has(c)){ const x=mbOf(c,bm); out.push({g:'kc',nm:'Mini-Banquet',cnt:x.n,tail:x.n?f0(x.t)+' thùng'+(x.n-x.gy?' · nợ quà '+(x.n-x.gy):''):'',lv:x.n?(x.n-x.gy?'warn':'ok'):'warn',st:x.n?'':'Chưa có tiệc '+ymL(bm)}); } }catch(_){ }
  const D=Object.fromEntries(defs().map(d=>[d.id,d]));
  const m=mtd(c);
  { const r=ctRow('MASSD',c); const d=D.MASSD; if(r&&d&&live(d)){ const s=(r.s||{})[M]; if(s){ const need=s==2?20:10; const g=Math.max(0,need-m);
      out.push({g:'so',act:m,tgt:need,nm:'Mass Display S'+s+' · mua '+need+' thùng',st:g?`Tháng này ${f0(m)}/${need} thùng · thiếu ${f0(g)}`:`Đủ ${need} thùng tháng này (${f0(m)})`,rq:MASSN[s],lv:g?'warn':'ok',gap:g,src:d.src});
      out.push({g:'tb',nm:'Mass Display S'+s+' · '+(s==2?'4 cây':'2 cây'),st:`Cần 1 hình đạt ${ymL(M)}`,rq:MASSN[s],lv:'warn',src:d.src}); } } }
  { const r=ctRow('HTT',c); const d=D.HTT; if(r&&d&&live(d)&&!(typeof EX==='function'&&EX(c,'RUR'))){ out.push({g:'md',tag:'Big Campaign',nm:'Rural HTT · cần ký P4G',st:`Target Q4 ${f0(r.t)} thùng · tài trợ ${fM(r.cs)}${r.act?' · '+r.act:''}`,rq:`Outlet Rural trong danh sách HTT cần ký P4G.\n• Target Q4/2026: ${f0(r.t)} thùng · tài trợ ${fM(r.cs)}\n• Plan 2027: ${f0(r.t27)} thùng · ${fM(r.c27)}\nViệc: chào ký HĐ P4G.`,lv:'warn',src:d.src}); } }
  { const r=ctRow('BIXD',c); const d=D.BIXD; if(r&&d&&live(d)){ const nd=(r.need||[]).join(', ')||'BIX/BXB'; out.push({g:'md',tag:'Big Campaign',nm:'Mở phủ Bivina',st:r.done?'Đã deal xong':'Bán '+nd+' vào outlet',rq:`Outlet chưa có ${nd}: bán vào để mở phủ Bivina.\n• Tối đa 1 suất/outlet · chi phí tối đa 33.000đ/thùng\n• Q4/2026${r.mech?'\n• Cơ chế: '+r.mech:''}`,lv:r.done?'ok':'warn',src:d.src}); } }
  { const r=ctRow('TIP1S',c); const d=D.TIP1S; if(r&&d&&live(d)&&!has('TIP1')){ const x=(r.mo||{})[M]; if(x&&x.t){ const g=Math.max(0,x.t-m); out.push({g:'so',act:m,tgt:x.t,cash:x.cash,nm:'TIP 1 · target '+ymL(M),st:`${f0(m)}/${f0(x.t)} thùng${g?' · thiếu '+f0(g):' · đạt'} · thưởng tối đa ${fM(x.cash)}`,rq:NOTE.TIP1+`\nTarget ${ymL(M)}: LB355/BIP/BVP ${f0(x.g1)} · LMC/BIX/LSC ${f0(x.g2)} · khác ${f0(x.o)} thùng.`,lv:g?'warn':'ok',gap:g,src:d.src}); } } }
  { const r=ctRow('TIP2S',c); const d=D.TIP2S; if(r&&d&&live(d)&&!has('TIP2')&&r.t){ out.push({g:'so',nm:'TIP 2 · LB355 & BIP',st:`Target ${f0(r.g1||r.t)} thùng LB355/BIP/tháng · thưởng tối đa ${fM(r.cash)}`,rq:NOTE.TIP2,lv:'warn',src:d.src}); } }
  return out; }
/* số thiếu + tiền của 1 chương trình: lấy đúng như dòng chi tiết (P4G = kỳ đang chạy) */
const gc=i=>{ const p=i.p; let a=null,t=null,cash=null;
  if(p){ if(p.k==='P4G'){ const m=(p.mi||[]).find(x=>x.st==='run'); if(m){ a=m.act; t=m.tgt; cash=m.cash; } }
    else if(p.k==='TLP'){ const b=(p.bars||[])[0]; if(b){ a=b.act; t=b.tgt; } cash=p.cash; }
    else if(p.disp&&p.dtgt){ a=p.dact; t=p.dtgt; }
    else if(p.tgt!=null){ a=p.act; t=p.tgt; cash=p.cash; } }
  else if(i.tgt!=null){ a=i.act; t=i.tgt; cash=i.cash; }
  return t?{t,g:Math.max(0,t-(a||0)),cash:+cash||0}:{t:0,g:0,cash:0}; };
const fK=n=>{ n=+n||0; return n>=1e6?(Math.round(n/1e5)/10).toFixed(1).replace('.',',')+'tr':Math.round(n/1000)+'k'; };
/* tóm tắt 1 dòng cho từng nhóm */
function groups(c,pg){ const L=items(c,pg); const by={}; L.forEach(i=>(by[i.g]=by[i.g]||[]).push(i));
  return G.filter(([g])=>by[g]).map(([g,l])=>{ const A=by[g]; const lv=A.reduce((a,i)=>LV[i.lv]<LV[a]?i.lv:a,'ok'); let s='';
    const nmL=L2=>esc(L2.map(i=>i.nm.split(' · ')[0]).filter((x,ix,ar)=>ar.indexOf(x)===ix).join(', '));
    if(g==='so'){ const X=A.map(i=>({i,...gc(i)})); const gp=X.filter(x=>x.g>0).sort((a,b)=>(b.cash||0)-(a.cash||0)||b.g-a.g); const ok=X.filter(x=>x.t&&!x.g).sort((a,b)=>(b.cash||0)-(a.cash||0));
      const tot=gp.reduce((t,x)=>t+x.g,0); const val=L3=>{ const m=L3.filter(x=>x.cash>0); const sm=m.reduce((t,x)=>t+x.cash,0); return m.length?(m.length>1?esc(m.map(x=>fK(x.cash)).join(' + '))+' = ':'')+'<b>'+fK(sm)+'</b>':''; };
      const sMiss=gp.length?`còn thiếu <b class="bad">${f0(tot)}</b> thùng <span class="pn">· ${nmL(gp.map(x=>x.i))}</span>${val(gp)?`<span class="gv"> · Giá trị ${val(gp)}</span>`:''}`:'';
      const sOk=ok.length?`<span class="okp"><b class="ok">✓ đủ</b> <span class="pn">${nmL(ok.map(x=>x.i))}</span>${val(ok)?` · nhận ${val(ok)}`:''}</span>`:'';
      s=sMiss||sOk?[sMiss,sOk].filter(Boolean).join('<span class="sep"> | </span>'):A.every(i=>i.lv==='ok')?'<b class="ok">✓ đã đủ</b>':`<span class="pn">${nmL(A)}</span>`; }
    else if(g==='tb'){ const nd=A.filter(i=>i.lv!=='ok'); s=nd.length?`cần <b class="bad">${nd.length}</b> hình ${ymL(ym())} <span class="pn">· ${esc(nd.map(i=>i.nm).join(', '))}</span>`:'<b class="ok">✓ đã chụp đủ</b>'; }
    else { const nd=A.filter(i=>i.lv!=='ok'); s=nd.length?`<span class="pn">${esc(nd.map(i=>i.nm).join(', '))}</span>`:'<b class="ok">✓ đang ổn</b>'; }
    return {g,l,lv,s,A}; }); }
/* 1 dòng gọn cho mỗi chương trình: tên · số/target · thanh tiến độ · còn thiếu / tiền · hạn. Bấm mở chi tiết đầy đủ. */
const dmS=d=>{ d=String(d||''); const m=d.match(/(\d{4})-(\d{2})-(\d{2})/); if(m) return m[3]+'/'+m[2]; const m2=d.match(/(\d{1,2}\/\d{1,2})(\/\d{2,4})?\s*$/); return m2?m2[1]:''; };
const fMs=n=>{ try{ return fM(n); }catch(_){ return f0(n); } };
function cline(i,c){ const p=i.p; let a=null,t=null,cash=null,end='',lab='',ok=i.lv==='ok',txt='';
  if(p){ if(p.k==='P4G'){ const m=(p.mi||[]).find(x=>x.st==='run'); if(m){ a=m.act; t=m.tgt; cash=m.cash; end=dmS(m.t); lab='kỳ '+m.k; } }
    else if(p.k==='TLP'){ const b=(p.bars||[])[0]; if(b){ a=b.act; t=b.tgt; } cash=p.cash; if(!cash) txt='đủ target mới có thưởng'; }
    else if(p.disp&&p.dtgt){ a=p.dact; t=p.dtgt; txt=p.ph?'<span class="ctcam ok">📷 đã chụp ✓</span>':p.phK&&c?`<button type="button" class="ctcam" data-ctcam="${esc(String(c))}|${esc(p.phK)}">📷 Chụp</button>`:'📷 chưa chụp'; }
    else if(p.tgt!=null){ a=p.act; t=p.tgt; cash=p.cash; end=dmS(String(p.per||'').split('–').pop()); } }
  else if(i.cnt!=null){ return {nums:`<b>${f0(i.cnt)}</b> tiệc ${ymL(ym())}`,bar:'',chip:i.cnt?'<span class="chp ok">✓ có tiệc</span>':'<span class="chp bad">chưa có tiệc</span>',tail:esc(i.tail||'')}; }
  else if(i.tgt!=null){ a=i.act; t=i.tgt; cash=i.cash; }
  if(t){ const g=Math.max(0,t-(a||0)); const pr=Math.min(1,(a||0)/t);
    return {nums:`<b>${f0(a)}</b>/${f0(t)}${lab?` <span class="mu">${lab}</span>`:''}`,bar:`<span class="mb"><i style="width:${Math.round(pr*100)}%" class="${g?'':'full'}"></i></span>`,
      chip:g?`<span class="chp bad">thiếu ${f0(g)}</span>`:`<span class="chp ok">✓ đủ</span>`,tail:[txt,cash?(g?'để nhận ':'nhận ')+fMs(cash):'',end?'đến '+end:''].filter(Boolean).join(' · ')}; }
  return {nums:'',bar:'',chip:ok?'<span class="chp ok">✓</span>':'',tail:esc(i.st||'')}; }
const itemHTML=(i,c)=>{ let det=''; try{ if(i.p&&typeof vProgHTML==='function') det=vProgHTML(i.p,c,1); }catch(_){ }
  const L=cline(i,c); const nm=String(i.nm||'').replace(/^P4G · Tie-up /,'P4G ');
  return `<details class="cti"><summary class="ctr"><span class="pn2">${esc(nm)}${i.tag?` <span class="bctag">${esc(i.tag)}</span>`:''}</span><span class="nu">${L.nums}</span>${L.bar}${L.chip}<span class="tl">${L.tail}</span></summary><div class="cdet">${det||(i.st?`<div class="st">${esc(i.st)}</div>`:'')}${i.rq?`<details class="crq"><summary>ⓘ Yêu cầu chương trình</summary><div class="rq">${esc(i.rq)}</div></details>`:''}</div></details>`; };
const grpHTML=(x,c,open,extra)=>`<details class="ctg ctbadge-${x.g} ctbadge-lv-${x.lv}" ${open?'open':''}><summary><span class="ct-dot ${x.lv}"></span><span class="g">${esc(x.l)}</span><span class="x">${x.s}</span><span class="ar">▶</span></summary><div class="ib">${x.A.map(i=>itemHTML(i,c)).join('')}${extra?`<div class="ctx">${extra}</div>`:''}</div></details>`;
window.CT={items,groups,G,NOTE};
/* ---- nút 📷 Chụp trên dòng display: bấm là mở camera, chụp xong tự lưu ảnh + ghi Đã chụp ---- */
(function(){ const css=document.createElement('style'); css.textContent='.ctcam{display:inline-flex;align-items:center;gap:4px;min-height:32px;padding:4px 14px;border-radius:999px;border:0;background:#0B8137;color:#fff;font:inherit;font-weight:800;font-size:13px;cursor:pointer;white-space:nowrap}.ctcam:active{transform:scale(.96)}.ctcam.ok{background:#E4F3E8;color:#0B5A2C;cursor:default}.ctcam.busy{background:#9AA5A0}.ctg .x .gv{color:#0E5A34}.ctg .x .gv b{color:#0B8137;font-weight:800}.ctg .x .okp{color:#0E5A34}.ctg .x .okp b{color:#0B8137;font-weight:800}.ctg .x .sep{color:#B9C4BE;font-weight:400}'; document.head.appendChild(css);
  let inp=null, cur=null;
  const getInp=()=>{ if(inp) return inp; inp=document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.setAttribute('capture','environment'); inp.hidden=true; document.body.appendChild(inp);
    inp.addEventListener('change',async()=>{ const f=inp.files&&inp.files[0]; const x=cur; inp.value=''; if(!f||!x) return; const [c,k]=x.k.split('|');
      try{ x.b.classList.add('busy'); x.b.textContent='Đang lưu…'; }catch(_){ }
      try{ keepPos(x.b); }catch(_){ }
      try{ await dphAdd(c,k,f); }catch(_){ }
      try{ if(!pDone(c,k)) await pDoneSet(c,k,true); }catch(e){ console.warn('ctcam',e); } });
    return inp; };
  document.addEventListener('click',e=>{ const b=e.target.closest('[data-ctcam]'); if(!b) return; e.preventDefault(); e.stopPropagation(); cur={k:b.dataset.ctcam,b}; getInp().click(); },true); })();
/* ---- thẻ Visit: thay 4 cột cũ bằng tối đa 4 dòng theo nhóm ---- */
if(typeof vcard2==='function'){ const _vc=vcard2; vcard2=function(r,VD){ const h=_vc(r,VD); try{ const c=r.code; const gs=groups(c,r.pg);
    let todo=''; try{ const all=[...r.pg.si,...r.pg.so]; todo=vTodoHTML(c,r.td,all.filter(isPlanP),[]); }catch(_){ }
    if(todo&&!gs.some(x=>x.g==='md')) gs.push({g:'md',l:'Việc khác',lv:'warn',s:'<span class="pn">task, note, plan</span>',A:[]});
    const blk=`<div class="ctv">${gs.length?gs.map(x=>grpHTML(x,c,false,x.g==='md'?todo:'')).join(''):'<div class="small muted">Outlet chưa có chương trình nào.</div>'}</div>`;
    const i=h.lastIndexOf('<div class="vc2g">'); if(i<0) return h; return h.slice(0,i)+blk+'</article>'; }catch(e){ console.warn('ct vcard',e); return h; } }; }
/* ---- Promotion · tab "Việc cần làm" ---- */
try{ if(Array.isArray(SUBS)){ if(!SUBS.some(s=>s[0]==='CT')) SUBS.unshift(['CT','Việc cần làm']); const qi=SUBS.findIndex(s=>s[0]==='Q4'); if(qi>=0) SUBS.splice(qi,1); } if(typeof UI!=='undefined'&&(!UI._ctInit||UI.sv==='Q4')){ UI._ctInit=1; UI.sv='CT'; } }catch(_){ } /* Big Campaign = tag, không còn là tab riêng */
const scopeSR=()=>isMgr()?(UI.ss==='all'?Object.keys(SRK):[UI.ss]):[mySR()].filter(Boolean);
window.vCT=function(){ const srs=scopeSR(); if(!srs.length) return '<div class="empty"><b>Tài khoản này chưa gắn với tuyến nào</b><span>Khi có dữ liệu tuyến, việc cần làm theo chương trình sẽ hiện ở đây.</span></div>';
  const q=(UI.sq||'').trim().toLowerCase();
  const outs=Object.values(S.mst||{}).filter(o=>srs.includes(o.sr)&&(!q||(String(o.code)+' '+(o.n||'')+' '+(o.w||o.ward||'')).toLowerCase().includes(q)));
  const R=outs.map(o=>({o,gs:groups(o.code)})).filter(x=>x.gs.length);
  const cnt=g=>{ const L=R.filter(x=>x.gs.some(y=>y.g===g)); return {all:L.length,need:L.filter(x=>x.gs.find(y=>y.g===g).lv!=='ok').length,bad:L.filter(x=>x.gs.find(y=>y.g===g).lv==='bad').length}; };
  const cur=UI.ctg||'so';
  const IC={so:'📦',tb:'🧱',kc:'🍺',md:'📋'};
  const tiles=`<div class="ct-tiles">${G.map(([g,l,d])=>{ const k=cnt(g); return `<button type="button" class="ct-tile ctbadge-${g}${cur===g?' ctbadge-on':''}" data-ctg="${g}" aria-pressed="${cur===g}"><span class="t"><span class="ic">${IC[g]}</span>${l}${k.bad?`<span class="gp">${k.bad} gấp</span>`:''}</span><span class="n">${k.need}<small> cần làm / ${k.all} outlet</small></span><span class="s">${d}</span></button>`; }).join('')}</div>`;
  /* chương trình trong nhóm đang chọn */
  const P={}; R.forEach(x=>{ const y=x.gs.find(z=>z.g===cur); if(!y) return; y.A.forEach(i=>{ const k=i.nm.split(' · ')[0]; const e=P[k]=P[k]||{n:0,need:0,rq:i.rq,src:i.src,tag:i.tag}; e.n++; if(i.lv!=='ok') e.need++; }); });
  const progs=Object.keys(P).length?`<div class="ct-progs">${Object.entries(P).sort((a,b)=>b[1].n-a[1].n).map(([k,e])=>`<details class="ct-pg"><summary><b>${esc(k)}</b>${e.tag?`<span class="bctag">${esc(e.tag)}</span>`:''}<span class="cnt">${e.need?`<i>${e.need}</i> / `:''}${e.n} outlet</span><span class="rq">Yêu cầu ›</span></summary><div class="ct-note">${esc(e.rq||'Chưa có mô tả.')}${e.src?`<span class="src">Nguồn: ${esc(e.src)}</span>`:''}</div></details>`).join('')}</div>`:'';
  const L=R.map(x=>({...x,y:x.gs.find(z=>z.g===cur)})).filter(x=>x.y).sort((a,b)=>LV[a.y.lv]-LV[b.y.lv]||(b.y.A.reduce((s,i)=>Math.max(s,i.gap||0),0)-a.y.A.reduce((s,i)=>Math.max(s,i.gap||0),0)));
  const lim=(UI.ctn||40); const multi=srs.length>1;
  const list=L.length?`<div class="ct-list">${L.slice(0,lim).map(x=>`<div class="ct-o"><div class="h">${oc(x.o.code,`<b>${esc(x.o.n||x.o.code)}</b>`)}<span class="cd">${esc(String(x.o.code))}</span>${multi?`<span class="srp">${esc(SRN2[x.o.sr]||x.o.sr)}</span>`:''}</div>${grpHTML(x.y,x.o.code,false)}</div>`).join('')}${L.length>lim?`<button type="button" class="btn sm ct-more" data-ctmore>Xem thêm ${f0(Math.min(40,L.length-lim))} outlet (còn ${f0(L.length-lim)})</button>`:''}</div>`:`<div class="empty small">Không có outlet nào trong nhóm ${esc(GN[cur])}.</div>`;
  /* bảng chương trình × sales cho SS / ASM */
  let mx='';
  if(isMgr()&&multi){ const PG={}; R.forEach(x=>x.gs.forEach(y=>y.A.forEach(i=>{ const k=y.g+'|'+i.nm.split(' · ')[0]; const e=PG[k]=PG[k]||{}; const s=x.o.sr; e[s]=e[s]||{n:0,ok:0}; e[s].n++; if(i.lv==='ok') e[s].ok++; })));
    const rows=G.map(([g,l])=>{ const ks=Object.keys(PG).filter(k=>k.startsWith(g+'|')).sort(); if(!ks.length) return ''; const cl=(o,n)=>!n?'':o>=n?'full':o/n<.3?'low':''; return `<tr class="ctbadge-gh ctbadge-${g}"><td colspan="${srs.length+2}">${l}</td></tr>`+ks.map(k=>{ const e=PG[k]; const tn=srs.reduce((s,r)=>s+((e[r]||{}).n||0),0), to=srs.reduce((s,r)=>s+((e[r]||{}).ok||0),0); return `<tr><td>${esc(k.split('|')[1])}</td>${srs.map(r=>`<td class="${e[r]?cl(e[r].ok,e[r].n):''}">${e[r]?`${e[r].ok}/${e[r].n}`:'<span style="color:#9AA5A0">–</span>'}</td>`).join('')}<td class="${cl(to,tn)}"><b>${to}/${tn}</b></td></tr>`; }).join(''); }).join('');
    mx=`<div class="ct-h2">Chương trình × sales</div><div class="ct-sub">Ô = số outlet đã ổn / số outlet có chương trình · ${esc(TEAMN())}</div><div class="ct-mx"><table><thead><tr><th>Chương trình</th>${srs.map(r=>`<th>${esc(SRN2[r]||r)}</th>`).join('')}<th>Tổng</th></tr></thead><tbody>${rows}</tbody></table></div>`; }
  return `<div class="ctw ctbadge-${cur}">${tiles}<div class="ct-h2">${esc(GN[cur])} · <span class="k">${L.filter(x=>x.y.lv!=='ok').length}</span> outlet cần làm</div><div class="ct-sub">Bấm tên chương trình để xem yêu cầu · bấm dòng của outlet để xem chi tiết từng chương trình</div>${progs}${list}${mx}</div>`; };
document.addEventListener('click',e=>{ const t=e.target.closest('[data-ctg]'); if(t){ e.preventDefault(); UI.ctg=t.dataset.ctg; UI.ctn=40; try{ render(); }catch(_){ } return; }
  const m=e.target.closest('[data-ctmore]'); if(m){ e.preventDefault(); UI.ctn=(UI.ctn||40)+40; try{ render(); }catch(_){ } } });
/* ---- Sơ đồ tổ chức: ASM > SS > Sales (tab Tool) ---- */
window.orgHTML=function(){ const M=S.members||{}; const U=((S.auth||{}).users)||{}; const un={}; Object.entries(U).forEach(([u,x])=>{ if(x&&x.m) un[x.m]=u; });
  const act=Object.entries(M).filter(([,m])=>m&&m.active!==false).map(([id,m])=>({id,...m}));
  const asm=act.filter(m=>m.role==='ASM'); const ss=act.filter(m=>m.key&&m.role!=='ASM');
  const tm=m=>m.team||'thinh'; const hasData=id=>{ const sr=Object.keys(SRK0||{}).find(k=>SRK0[k]===id); return !!sr; };
  const box=(m,lv)=>`<div class="lv">${lv}</div><div class="nm">${esc(m.name)}</div><div class="u">${esc(un[m.id]||'chưa có account')}</div>`;
  const ssB=s=>{ const t=tm(s); const srs=act.filter(m=>!m.key&&m.role!=='ASM'&&tm(m)===t);
    return `<div class="ss">${box(s,'SS · '+esc(t==='thinh'?'Team Thịnh':t==='diep'?'Team Điệp':'Team '+(s.short||s.name)))}<div class="srs">${srs.length?srs.map(m=>`<div>${esc(m.name)} <span class="u">${esc(un[m.id]||'')}</span>${hasData(m.id)?'':' <span class="nod">· chưa có data</span>'}</div>`).join(''):'<span class="nod">Chưa có sales</span>'}</div></div>`; };
  return `<details class="dsec" open><summary>Sơ đồ tổ chức S27 · ASM > SS > Sales</summary><div class="org">${asm.map(a=>`<div class="asm">${box(a,'ASM')}</div>`).join('')||'<div class="nod">Chưa có ASM</div>'}<div class="sss">${ss.sort((a,b)=>(a.order||0)-(b.order||0)).map(ssB).join('')}</div><div class="ct-sub">Mật khẩu mặc định 123456 · "chưa có data" = chưa nạp outlet/sản lượng, đăng nhập vẫn được.</div></div></details>`; };
if(typeof vPeople==='function'){ const _vp=vPeople; vPeople=function(v){ const r=_vp(v); try{ v.insertAdjacentHTML('afterbegin',orgHTML()); }catch(_){ } return r; }; }
}catch(e){ console.warn('ctmod',e); } })();
(function(){ try{
/* 06/11/2026 · nạp danh mục chương trình mới (Mass Display, Rural HTT, Mở phủ Bivina, TIP 1/2 cả S27) từ ct_rows.json vào prog/CT + prog/CT_<id>. Chạy 1 lần khi chủ app mở app; kết quả ở app/ctseed. */
let tries=0,busy=false;
const tick=async()=>{ try{ if(++tries>300) return clearInterval(T);
  if(busy||typeof S==='undefined'||!S.isOwner||!S.db||!S.ready||!S.ready.s) return;
  busy=true; clearInterval(T);
  const mk=S.db.doc('app/ctseed'); const mg=await mk.get(); if(mg.exists&&mg.data().done) return;
  const J=await (await fetch('ct_rows.json',{cache:'no-store'})).json(); const st={at:new Date().toISOString(),done:true,n:{}};
  for(const [id,rows] of Object.entries(J)){ await S.db.doc('prog/CT_'+id).set({rows,updated:'2026-11-06'}); st.n[id]=Object.keys(rows).length; }
  await S.db.doc('prog/CT').set({defs:(window.CT_DEFS||null)||[],updated:'2026-11-06',note:'defs trống = dùng danh mục trong code'});
  await mk.set(st); try{ toast('Đã nạp chương trình mới cho S27'); }catch(_){ }
  }catch(e){ console.warn('ctseed',e); try{ toast('Chưa nạp được chương trình mới: '+(e.message||e.code)); }catch(_){ } } };
const T=setInterval(tick,2000);
}catch(e){ console.warn('ctseed',e); } })();