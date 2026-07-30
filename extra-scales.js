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

// NEET NOTE全体と共通のテーマ設定
const THEME_KEY='neet-note-theme';
const root=document.documentElement;
const metaTheme=document.querySelector('meta[name="theme-color"]');
const themeButton=document.getElementById('theme');
const systemDark=()=>window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;
const getTheme=()=>{
  const saved=localStorage.getItem(THEME_KEY);
  return saved==='light'||saved==='dark'?saved:(systemDark()?'dark':'light');
};
const applyTheme=theme=>{
  root.dataset.theme=theme;
  root.style.colorScheme=theme;
  if(metaTheme) metaTheme.setAttribute('content',theme==='dark'?'#141311':'#f4efe6');
  if(themeButton){
    const dark=theme==='dark';
    themeButton.textContent=dark?'☀️':'🌙';
    themeButton.title=dark?'ライトモードに切り替え':'ダークモードに切り替え';
    themeButton.setAttribute('aria-label',themeButton.title);
    themeButton.setAttribute('aria-pressed',String(dark));
  }
};
applyTheme(getTheme());
if(themeButton){
  themeButton.addEventListener('click',event=>{
    event.preventDefault();
    event.stopImmediatePropagation();
    const next=root.dataset.theme==='dark'?'light':'dark';
    localStorage.setItem(THEME_KEY,next);
    applyTheme(next);
  },true);
}
if(window.matchMedia){
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',event=>{
    if(!localStorage.getItem(THEME_KEY)) applyTheme(event.matches?'dark':'light');
  });
}

// ダークモード時の文字・操作部品の視認性を補強
const themeStyle=document.createElement('style');
themeStyle.textContent=`
html[data-theme="dark"] body{background:#141311;color:#f8f4ec}
html[data-theme="dark"] .card,html[data-theme="dark"] details,html[data-theme="dark"] .menu{background:#211f1b;color:#f8f4ec;border-color:#514a40}
html[data-theme="dark"] .box,html[data-theme="dark"] .rating,html[data-theme="dark"] .progression,html[data-theme="dark"] .phrase,html[data-theme="dark"] .mini,html[data-theme="dark"] .note,html[data-theme="dark"] .pill{background:#2d2924;color:#f8f4ec;border-color:#595146}
html[data-theme="dark"] select,html[data-theme="dark"] option,html[data-theme="dark"] .btn,html[data-theme="dark"] .icon{background:#302c27;color:#fffaf2;border-color:#62594d}
html[data-theme="dark"] .btn.primary{background:#b58f55;color:#14110d;border-color:#c6a269}
html[data-theme="dark"] .brand small,html[data-theme="dark"] .eyebrow,html[data-theme="dark"] .aliases,html[data-theme="dark"] .degree,html[data-theme="dark"] .box p,html[data-theme="dark"] .mini span,html[data-theme="dark"] .empty{color:#d4ccbf}
html[data-theme="dark"] summary,html[data-theme="dark"] h1,html[data-theme="dark"] h2,html[data-theme="dark"] b,html[data-theme="dark"] .menu a{color:#fffaf2}
html[data-theme="dark"] .menu a:hover{background:#38332d}
`;
document.head.appendChild(themeStyle);
})();