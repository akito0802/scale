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

// 初めて使う人向けの選択ガイド
const guideStyle=document.createElement('style');
guideStyle.textContent=`
  .toolbar{align-items:start}.select-guide{display:grid;gap:6px;min-width:0}.select-guide label{display:flex;align-items:center;gap:7px;color:var(--ink);font-size:.82rem;font-weight:900}.guide-help{display:inline-grid;place-items:center;width:20px;height:20px;padding:0;border:1px solid var(--line);border-radius:50%;background:var(--panel2);color:var(--muted);font-size:.72rem;font-weight:900;cursor:pointer}.guide-text{margin:0;color:var(--muted);font-size:.72rem;line-height:1.55}.guide-detail{display:none;margin:0;padding:10px 11px;border:1px solid var(--line);border-radius:11px;background:var(--panel2);color:var(--muted);font-size:.74rem;line-height:1.6}.select-guide.open .guide-detail{display:block}.selection-guide-note{margin:13px 0 0;padding:11px 12px;border-left:3px solid var(--accent);border-radius:0 10px 10px 0;background:var(--panel2);color:var(--muted);font-size:.78rem;line-height:1.65}.actions .tempo-guide{display:inline-flex;align-items:center;gap:6px;color:var(--muted);font-size:.75rem}.compare-guide{margin:-4px 0 10px;color:var(--muted);font-size:.78rem;line-height:1.6}@media(max-width:760px){.guide-text{font-size:.76rem}.selection-guide-note{font-size:.8rem}}
`;
document.head.appendChild(guideStyle);

const guides=[
  {id:'key',label:'キー',short:'曲や演奏の中心となる音を選択',detail:'選んだ音がルート音になります。迷ったら、演奏する曲のキーと同じ音を選んでください。例：Cメジャーの曲なら「C」。'},
  {id:'group',label:'種類・ジャンル',short:'スケールを系統ごとに絞り込み',detail:'メジャー系、マイナー系、ジャズ、日本音階など、響きや理論上の仲間で分類しています。目的が決まっていない場合は、まず基本的な系統から探すのがおすすめです。'},
  {id:'scale',label:'スケール',short:'実際に表示・再生する音階を選択',detail:'選択したキーを基準に、そのスケールの構成音・度数・特徴・対応コードなどを表示します。名前が分からない場合は、種類を切り替えながら概要を確認してください。'}
];
const toolbar=document.querySelector('.toolbar');
guides.forEach(({id,label,short,detail})=>{
  const select=document.getElementById(id);
  if(!select||select.closest('.select-guide'))return;
  const box=document.createElement('div');
  box.className='select-guide';
  const labelEl=document.createElement('label');
  labelEl.htmlFor=id;
  labelEl.innerHTML=`<span>${label}</span><button class="guide-help" type="button" aria-label="${label}の詳しい説明を表示" aria-expanded="false">?</button>`;
  const shortEl=document.createElement('p');shortEl.className='guide-text';shortEl.textContent=short;
  const detailEl=document.createElement('p');detailEl.className='guide-detail';detailEl.textContent=detail;
  select.parentNode.insertBefore(box,select);box.append(labelEl,select,shortEl,detailEl);
  labelEl.querySelector('.guide-help').addEventListener('click',e=>{const open=box.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open));e.currentTarget.setAttribute('aria-label',`${label}の詳しい説明を${open?'閉じる':'表示'}`)});
});
if(toolbar&&!document.querySelector('.selection-guide-note')){
  const note=document.createElement('p');note.className='selection-guide-note';note.textContent='使い方：①キーを選ぶ → ②種類・ジャンルで絞る → ③スケールを選ぶ。下の音名を押さえたり再生したりして、響きを確認できます。';toolbar.parentElement.appendChild(note);
}
const tempo=document.getElementById('tempo');
if(tempo&&!tempo.previousElementSibling?.classList.contains('tempo-guide')){
  const text=document.createElement('span');text.className='tempo-guide';text.textContent='再生速度：';tempo.parentNode.insertBefore(text,tempo);
}
const compare=document.querySelector('.compare');
if(compare&&!compare.querySelector('.compare-guide')){
  const p=document.createElement('p');p.className='compare-guide';p.textContent='別のスケールを選ぶと、構成音や特徴の違いを並べて比較できます。似たスケールの使い分けを知りたいときに便利です。';compare.querySelector('h2')?.insertAdjacentElement('afterend',p);
}
})();