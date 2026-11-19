/* Bản xem online (GitHub Pages): giả lập db của artifact, CHỈ ĐỌC từ snapshot.json. */
(function(){
var DOCS=null,COLL=null,P=null;
function load(){ if(!P) P=fetch('snapshot.json',{cache:'no-cache'}).then(function(r){return r.json();}).then(function(j){
  DOCS=j.docs||{}; COLL={}; window.__STATIC_META=j.meta||{};
  Object.keys(DOCS).forEach(function(p){ var i=p.lastIndexOf('/'); var c=p.slice(0,i); (COLL[c]=COLL[c]||[]).push(p); });
  Object.keys(COLL).forEach(function(c){ COLL[c].sort(function(a,b){ var x=a.slice(c.length+1),y=b.slice(c.length+1); return x<y?-1:x>y?1:0; }); });
  return DOCS; }); return P; }
load();
var MD={fromCache:false,hasPendingWrites:false};
function ro(){ var e=new Error('Bản online chỉ để xem, không lưu được.'); e.code='invalid_argument'; return Promise.reject(e); }
function snap(p){ var d=DOCS[p]; return {id:p.split('/').pop(),exists:!!d,data:function(){return d||undefined;},metadata:MD}; }
function docRef(p){ return {id:p.split('/').pop(),path:p,
  get:function(){ return load().then(function(){return snap(p);}); },
  set:ro,update:ro,delete:ro,acquire:function(){return Promise.resolve({acquired:false});},
  onSnapshot:function(n,e){ var on=true; load().then(function(){ if(on) n(snap(p)); },function(x){ if(on&&e) e({code:'unavailable',message:String(x)}); }); return function(){on=false;}; },
  collection:function(s){ return collRef(p+'/'+s); } }; }
function cmp(a,op,b){ switch(op){ case '==':return a===b; case '!=':return a!==b; case '<':return a<b; case '<=':return a<=b; case '>':return a>b; case '>=':return a>=b;
  case 'in':return (b||[]).indexOf(a)>=0; case 'not-in':return (b||[]).indexOf(a)<0; case 'array-contains':return Array.isArray(a)&&a.indexOf(b)>=0; } return false; }
function query(c,W,O,L){ function run(){ var ps=(COLL[c]||[]).slice(); var ds=ps.map(snap);
    W.forEach(function(w){ ds=ds.filter(function(s){ var v=s.data()[w[0]]; return v!==undefined&&cmp(v,w[1],w[2]); }); });
    if(O){ var f=O[0],dir=O[1]==='desc'?-1:1; ds.sort(function(a,b){ var x=a.data()[f],y=b.data()[f]; if(x===undefined) return 1; if(y===undefined) return -1; return x<y?-dir:x>y?dir:0; }); }
    if(L) ds=ds.slice(0,L);
    return {docs:ds,size:ds.length,empty:!ds.length,metadata:MD,forEach:function(fn){ds.forEach(fn);},docChanges:function(){return ds.map(function(d,i){return {type:'added',doc:d,oldIndex:-1,newIndex:i};});}}; }
  return {path:c,
    where:function(f,op,v){ return query(c,W.concat([[f,op,v]]),O,L); },
    orderBy:function(f,d){ return query(c,W,[f,d],L); },
    limit:function(n){ return query(c,W,O,n); },
    get:function(){ return load().then(run); },
    onSnapshot:function(n,e){ var on=true; load().then(function(){ if(on) n(run()); },function(x){ if(on&&e) e({code:'unavailable',message:String(x)}); }); return function(){on=false;}; } }; }
function collRef(c){ var q=query(c,[],null,0); q.doc=function(id){ return docRef(c+'/'+(id||Math.random().toString(36).slice(2))); }; q.add=ro; return q; }
var DB={doc:docRef,collection:collRef};
var NOID='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="16" fill="#9AA"/></svg>');
var ME={id:null,name:'',avatarUrl:NOID,color:'#889',email:null,isOwner:false,canEdit:false};
var USER={isOwner:function(){return Promise.resolve(false);},canEdit:function(){return Promise.resolve(false);},can:function(){return Promise.resolve(false);},
  me:function(){return Promise.resolve(ME);},id:function(){return Promise.resolve(null);},name:function(){return Promise.resolve('');},
  avatarUrl:function(){return Promise.resolve(null);},email:function(){return Promise.resolve(null);},search:function(){return Promise.resolve([]);},
  profiles:function(ids){ var o={}; [].concat(ids||[]).forEach(function(i){ o[i]={id:i,name:'',avatarUrl:NOID,color:'#889',email:null,isMe:false,guest:false}; }); return Promise.resolve(o); }};
window.claude={use:function(n){ return load().then(function(){ return n==='db'?DB:n==='user'?USER:null; },function(){ return null; }); }};
})();
