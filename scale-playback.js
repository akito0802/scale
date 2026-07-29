(() => {
  let audioContext;
  let playbackToken = 0;

  const NOTE_TO_PC = {
    C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4,
    F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8,
    A: 9, 'A#': 10, Bb: 10, B: 11
  };

  function getAudioContext() {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  }

  function normalizeNoteName(value) {
    return String(value || '')
      .replace(/♯/g, '#')
      .replace(/♭/g, 'b')
      .replace(/[0-9]/g, '')
      .trim();
  }

  function noteToMidi(noteName, previousMidi = null) {
    const pc = NOTE_TO_PC[normalizeNoteName(noteName)];
    if (pc == null) return null;
    let midi = 60 + pc;
    if (previousMidi != null) {
      while (midi <= previousMidi) midi += 12;
    }
    return midi;
  }

  function currentScaleNotes() {
    const key = document.getElementById('keySelect')?.value;
    const group = document.getElementById('groupSelect')?.value;
    const scale = document.getElementById('scaleSelect')?.value;
    const data = window.scaleData?.[key]?.[group]?.[scale] ||
      (typeof scaleData !== 'undefined' ? scaleData?.[key]?.[group]?.[scale] : null);
    if (!Array.isArray(data)) return [];

    const result = [];
    let previous = null;
    data.forEach(item => {
      const midi = noteToMidi(item?.name, previous);
      if (midi != null) {
        result.push(midi);
        previous = midi;
      }
    });
    if (result.length) result.push(result[0] + 12);
    return result;
  }

  function pianoTone(midi, start, duration = 0.9, volume = 0.13) {
    const ctx = getAudioContext();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, start);
    filter.frequency.exponentialRampToValueAtTime(900, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    gain.connect(filter).connect(ctx.destination);

    [1, 2, 3].forEach((harmonic, index) => {
      const osc = ctx.createOscillator();
      const partial = ctx.createGain();
      osc.type = index === 0 ? 'triangle' : 'sine';
      osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12) * harmonic;
      partial.gain.value = index === 0 ? 1 : 0.16 / harmonic;
      osc.connect(partial).connect(gain);
      osc.start(start);
      osc.stop(start + duration + 0.05);
    });
  }

  function playSequence(mode = 'up') {
    const notes = currentScaleNotes();
    if (!notes.length) return;
    const token = ++playbackToken;
    let sequence = notes;
    if (mode === 'down') sequence = [...notes].reverse();
    if (mode === 'roundtrip') sequence = [...notes, ...notes.slice(0, -1).reverse().slice(1)];

    const ctx = getAudioContext();
    const start = ctx.currentTime + 0.04;
    sequence.forEach((midi, index) => {
      if (token !== playbackToken) return;
      pianoTone(midi, start + index * 0.32, 0.85, 0.12);
    });
  }

  function stopPlayback() {
    playbackToken += 1;
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
  }

  function mountControls() {
    if (document.getElementById('scalePlaybackControls')) return;
    const table = document.getElementById('scaleTable');
    if (!table) return;

    const controls = document.createElement('div');
    controls.id = 'scalePlaybackControls';
    controls.className = 'scale-playback-controls';
    controls.innerHTML = `
      <strong>🎹 スケール試聴</strong>
      <div class="scale-playback-buttons">
        <button type="button" data-scale-play="up">▶ 上昇</button>
        <button type="button" data-scale-play="down">◀ 下降</button>
        <button type="button" data-scale-play="roundtrip">↕ 往復</button>
        <button type="button" data-scale-play="stop">■ 停止</button>
      </div>
      <small>ピアノ音で選択中のスケールを確認できるよ</small>`;
    table.insertAdjacentElement('beforebegin', controls);

    controls.addEventListener('click', event => {
      const button = event.target.closest('[data-scale-play]');
      if (!button) return;
      const mode = button.dataset.scalePlay;
      if (mode === 'stop') stopPlayback();
      else playSequence(mode);
    });
  }

  function makeNoteCellsPlayable() {
    const cells = document.querySelectorAll('#scaleTable tr:nth-child(2) td');
    let previous = null;
    cells.forEach(cell => {
      cell.classList.add('playable-note');
      cell.title = 'タップして音を鳴らす';
      cell.onclick = () => {
        const midi = noteToMidi(cell.textContent, previous);
        if (midi != null) pianoTone(midi, getAudioContext().currentTime + 0.02, 1.1, 0.14);
      };
      const midi = noteToMidi(cell.textContent, previous);
      if (midi != null) previous = midi;
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    .scale-playback-controls{max-width:800px;margin:1rem auto .25rem;padding:14px;border:1px solid #cbd5e1;border-radius:14px;background:#fff;box-shadow:0 4px 16px rgba(15,23,42,.06)}
    .scale-playback-controls strong{display:block;margin-bottom:10px}
    .scale-playback-buttons{display:flex;justify-content:center;gap:8px;flex-wrap:wrap}
    .scale-playback-buttons button{min-height:42px;padding:9px 14px;border:1px solid #b8c4d1;border-radius:11px;background:#f8fafc;color:#1f2937;font:inherit;font-weight:700;cursor:pointer}
    .scale-playback-buttons button:active{transform:scale(.97)}
    .scale-playback-controls small{display:block;margin-top:9px;color:#64748b}
    #scaleTable .playable-note{cursor:pointer;user-select:none;transition:transform .12s ease,background .12s ease}
    #scaleTable .playable-note:active{transform:scale(.96);background:#dfeaf5}
    @media(max-width:560px){.scale-playback-buttons button{flex:1;min-width:42%}}
  `;
  document.head.appendChild(style);

  const table = document.getElementById('scaleTable');
  if (table) new MutationObserver(makeNoteCellsPlayable).observe(table, { childList: true, subtree: true });
  mountControls();
  makeNoteCellsPlayable();
})();