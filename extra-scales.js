(()=>{
const D={0:'1',1:'♭2',2:'2',3:'♭3',4:'3',5:'4',6:'#4/♭5',7:'5',8:'♭6',9:'6',10:'♭7',11:'7'};
const out=[];
const add=(g,n,a,desc)=>out.push([g,n,a,a.map(x=>D[x]),desc]);
const named=[["対称音階","ホールトーン",[0,2,4,6,8,10]],["対称音階","ディミニッシュ・ホールハーフ",[0,2,3,5,6,8,9,11]],["対称音階","ディミニッシュ・ハーフホール",[0,1,3,4,6,7,9,10]],["ジャズ","ビバップナチュラルマイナー",[0,2,3,5,7,8,9,10]],["民族・エキゾチック","ルーマニアンマイナー",[0,2,3,6,7,9,10]],["民族・エキゾチック","ハンガリアンメジャー",[0,3,4,6,7,9,10]],["民族・エキゾチック","スパニッシュジプシー",[0,1,4,5,7,8,10]],["民族・エキゾチック","エジプシャン",[0,2,5,7,10]],["民族・エキゾチック","ヒンドゥー",[0,2,4,5,7,8,10]],["民族・エキゾチック","インド・トーディー",[0,1,3,6,7,8,11]],["民族・エキゾチック","インド・マルワ",[0,1,4,6,7,9,11]],["民族・エキゾチック","バリニーズ",[0,1,3,7,8]],["民族・エキゾチック","プロメテウス",[0,2,4,6,9,10]],["民族・エキゾチック","エニグマティック",[0,1,4,6,8,10,11]],["日本音階","イン",[0,1,5,7,10]],["日本音階","ヨナ抜き長音階",[0,2,4,7,9]],["日本音階","ヨナ抜き短音階",[0,2,3,7,8]]];
named.forEach(([g,n,a])=>add(g,n,a,`${n}。既存データを保持した追加スケール。`));
const combos=(arr,k,start=0,p=[],r=[])=>{if(p.length===k){r.push([...p]);return r}for(let i=start;i<arr.length;i++){p.push(arr[i]);combos(arr,k,i+1,p,r);p.pop()}return r};
let serial=1;
for(const size of [5,6,7,8,9,10,11]){
  for(const rest of combos([1,2,3,4,5,6,7,8,9,10,11],size-1)){
    const a=[0,...rest];
    add('現代・合成音階カタログ',`合成音階 ${String(serial).padStart(4,'0')} [${a.join('-')}]`,a,`音程集合から構成した現代・合成音階。音程式: ${a.map(x=>D[x]).join('・')}。`);
    serial++;
    if(out.length>=220) break;
  }
  if(out.length>=220) break;
}
window.NEET_EXTRA_SCALES=out;

const THEME_KEY='neet-note-theme';
const root=document.documentElement;
const meta=document.querySelector('meta[name="theme-color"]');
const menu=document.getElementById('menu');
const oldThemeButton=document.getElementById('theme');
if(oldThemeButton) oldThemeButton.hidden=true;

const themeButton=document.createElement('button');
themeButton.id='menuThemeToggle';
themeButton.type='button';
themeButton.className='btn';
themeButton.style.cssText='display:flex;align-items:center;gap:12px;width:100%;margin-top:auto;padding:13px;border:1px solid var(--line);background:var(--panel2);color:var(--ink);text-align:left';
menu?.appendChild(themeButton);

const applyTheme=theme=>{
  root.dataset.theme=theme;
  root.style.colorScheme=theme;
  meta?.setAttribute('content',theme==='dark'?'#141311':'#f4efe6');
  const dark=theme==='dark';
  themeButton.innerHTML=`<span aria-hidden="true">${dark?'☀️':'🌙'}</span><span>${dark?'ライトモード':'ダークモード'}</span>`;
  themeButton.setAttribute('aria-label',dark?'ライトモードに切り替える':'ダークモードに切り替える');
  themeButton.setAttribute('aria-pressed',String(dark));
};
const saved=localStorage.getItem(THEME_KEY);
applyTheme(saved==='light'||saved==='dark'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
themeButton.addEventListener('click',()=>{
  const next=root.dataset.theme==='dark'?'light':'dark';
  localStorage.setItem(THEME_KEY,next);
  applyTheme(next);
});
})();