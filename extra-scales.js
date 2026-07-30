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
  .toolbar{align-items:start}.select-guide{display:grid;gap:6px;min-width:0}.select-guide label{display:flex;align-items:center;gap:7px;color:var(--ink);font-size:.82rem;font-weight:900}.guide-help{display:inline-grid;place-items:center;width:20px;height:20px;padding:0;border:1px solid var(--line);border-radius:50%;background:var(--panel2);color:var(--muted);font-size:.72rem;font-weight:900;cursor:pointer}.guide-text{margin:0;color:var(--muted);font-size:.72rem;line-height:1.55}.guide-detail{display:none;margin:0;padding:10px 11px;border:1px solid var(--line);border-radius:11px;background:var(--panel2);color:var(--muted);font-size:.74rem;line-height:1.6}.select-guide.open .guide-detail{display:block}.selection-guide-note{margin:13px 0 0;padding:11px 12px;border-left:3px solid var(--accent);border-radius:0 10px 10px 0;background:var(--panel2);color:var(--muted);font-size:.78rem;line-height:1.65}.actions .tempo-guide{display:inline-flex;align-items:center;gap:6px;color:var(--muted);font-size:.75rem}.compare-guide{margin:-4px 0 10px;color:var(--muted);font-size:.78rem;line-height:1.6}
  .help-menu-button{display:flex!important;align-items:center;gap:12px;width:100%;padding:13px;border:0;border-radius:12px;background:transparent;color:var(--ink);font:inherit;font-weight:800;text-align:left;cursor:pointer}.help-menu-button:hover,.help-menu-button:focus{background:var(--panel2);outline:none}.help-modal{position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.58)}.help-modal.open{display:flex}.help-dialog{width:min(100%,760px);max-height:min(88dvh,820px);overflow:auto;background:var(--panel);color:var(--ink);border:1px solid var(--line);border-radius:22px;box-shadow:0 24px 70px rgba(0,0,0,.35)}.help-head{position:sticky;top:0;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:18px 20px;border-bottom:1px solid var(--line);background:var(--panel)}.help-head h2{margin:0;font-size:1.3rem}.help-close{flex:0 0 40px;width:40px;height:40px;border:1px solid var(--line);border-radius:12px;background:var(--panel2);color:var(--ink);font-size:1.25rem;cursor:pointer}.help-body{padding:20px}.help-intro{margin:0 0 18px;padding:13px 14px;border-left:4px solid var(--accent);border-radius:0 12px 12px 0;background:var(--panel2);color:var(--muted);line-height:1.75}.help-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.help-item{padding:15px;border:1px solid var(--line);border-radius:15px;background:var(--panel2)}.help-item h3{margin:0 0 7px;font-size:1rem}.help-item p{margin:0;color:var(--muted);font-size:.86rem;line-height:1.7}.help-item.wide{grid-column:1/-1}.help-steps{margin:0;padding-left:1.25rem;color:var(--muted);line-height:1.8}.help-note{margin:17px 0 0;color:var(--muted);font-size:.8rem;line-height:1.7}
  @media(max-width:760px){.guide-text{font-size:.76rem}.selection-guide-note{font-size:.8rem}.help-modal{padding:0;align-items:flex-end}.help-dialog{width:100%;max-height:92dvh;border-radius:22px 22px 0 0}.help-grid{grid-template-columns:1fr}.help-item.wide{grid-column:auto}.help-body{padding:16px}.help-head{padding:15px 16px}}
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

// ハンバーガーメニュー内の総合ヘルプ
const helpButton=document.createElement('button');
helpButton.id='openScaleHelp';
helpButton.type='button';
helpButton.className='help-menu-button';
helpButton.innerHTML='<span aria-hidden="true">❓</span><span>ヘルプ・使い方</span>';
menu?.insertBefore(helpButton,themeButton);

const helpModal=document.createElement('div');
helpModal.id='scaleHelpModal';
helpModal.className='help-modal';
helpModal.setAttribute('aria-hidden','true');
helpModal.innerHTML=`
  <section class="help-dialog" role="dialog" aria-modal="true" aria-labelledby="scaleHelpTitle">
    <div class="help-head"><h2 id="scaleHelpTitle">スケール辞典の使い方</h2><button class="help-close" type="button" aria-label="ヘルプを閉じる">×</button></div>
    <div class="help-body">
      <p class="help-intro">キーとスケールを選ぶだけで、構成音・度数・特徴・対応コード・演奏例をまとめて確認できる音楽理論ツールです。</p>
      <div class="help-grid">
        <article class="help-item wide"><h3>基本の使い方</h3><ol class="help-steps"><li>「キー」で中心となる音を選ぶ</li><li>「種類・ジャンル」で候補を絞る</li><li>「スケール」で確認したい音階を選ぶ</li><li>構成音と解説を見ながら再生して響きを確認する</li></ol></article>
        <article class="help-item"><h3>🎹 キー</h3><p>スケールの始まりとなるルート音です。曲のキーに合わせて選ぶと、その曲で使いやすい構成音を確認できます。</p></article>
        <article class="help-item"><h3>🎼 種類・ジャンル</h3><p>メジャー、マイナー、ジャズ、日本音階などの系統でスケールを絞り込みます。</p></article>
        <article class="help-item"><h3>🎵 スケール</h3><p>表示する音階を選びます。選択すると音名、度数、特徴、対応コードなどが自動で切り替わります。</p></article>
        <article class="help-item"><h3>🔊 再生ボタン</h3><p>上昇・下降・往復・ランダムの順番で構成音を再生します。速度は「ゆっくり・普通・速い」から選べます。</p></article>
        <article class="help-item"><h3>★ お気に入り</h3><p>よく使うスケールを保存します。下部の「お気に入り」一覧からすぐに開けます。</p></article>
        <article class="help-item"><h3>🕘 最近見た</h3><p>直近で確認したスケールが自動保存されます。前に見たスケールへ戻りたいときに便利です。</p></article>
        <article class="help-item"><h3>📖 基本情報と評価</h3><p>難易度、使用頻度、特徴音、対応コード、関連スケールなどを確認できます。</p></article>
        <article class="help-item"><h3>🎸 音楽的アプローチ</h3><p>実際の演奏での使い方、注意音、向いているジャンルや雰囲気を確認できます。</p></article>
        <article class="help-item"><h3>🔁 コード進行・フレーズ</h3><p>スケールを使いやすいコード進行例や、音の並びを確認・再生できます。</p></article>
        <article class="help-item"><h3>⚖️ 比較モード</h3><p>別のスケールと構成音や特徴を並べて比較し、違いや共通点を確認できます。</p></article>
        <article class="help-item"><h3>🌙 表示テーマ</h3><p>ハンバーガーメニュー下部のボタンでライトモードとダークモードを切り替えられます。</p></article>
        <article class="help-item"><h3>📚 コード辞典との連携</h3><p>対応コードを確認したあと、コード辞典へ移動してフォームや構成音をさらに調べられます。</p></article>
      </div>
      <p class="help-note">音名の表記や理論情報は、選択したキーとスケールに応じて自動更新されます。</p>
    </div>
  </section>`;
document.body.appendChild(helpModal);
const closeHelp=()=>{helpModal.classList.remove('open');helpModal.setAttribute('aria-hidden','true');document.body.style.overflow='';helpButton.focus()};
helpButton.addEventListener('click',()=>{document.getElementById('menu')?.classList.remove('open');document.getElementById('overlay')?.classList.remove('open');helpModal.classList.add('open');helpModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';helpModal.querySelector('.help-close')?.focus()});
helpModal.querySelector('.help-close')?.addEventListener('click',closeHelp);
helpModal.addEventListener('click',event=>{if(event.target===helpModal)closeHelp()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&helpModal.classList.contains('open'))closeHelp()});
})();