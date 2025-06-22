// v10: CATEGORIES 明示定義で全分類固定表示（民族含む）
const CATEGORIES = ["メジャー", "マイナー", "チャーチ", "ジャズ", "ブルース", "民族"];

const keySel = document.getElementById("key-select");
const catSel = document.getElementById("category-select");
const scaleSel = document.getElementById("scale-select");
const output = document.getElementById("output");

let data = {};

fetch("scales.json")
  .then(r => r.json())
  .then(j => { data = j; init(); });

function init() {
  keySel.innerHTML = "";
  Object.keys(data).forEach(k => keySel.insertAdjacentHTML("beforeend", `<option value="${k}">${k}</option>`));
  keySel.value = "C";
  populateCategories();
}

function populateCategories() {
  catSel.innerHTML = "";
  const key = data[keySel.value];
  CATEGORIES.forEach(c => {
    const exists = key.hasOwnProperty(c);
    catSel.insertAdjacentHTML("beforeend",
      `<option value="${c}" ${exists ? "" : "disabled"}>${c}${exists ? "" : " (なし)"}</option>`);
  });
  catSel.value = CATEGORIES.find(c => key.hasOwnProperty(c));
  populateScales();
}

function populateScales() {
  scaleSel.innerHTML = "";
  const scalesObj = data[keySel.value][catSel.value];
  if (!scalesObj) {
    output.textContent = "このカテゴリにはスケールがありません。";
    return;
  }
  Object.keys(scalesObj).forEach(s => scaleSel.insertAdjacentHTML("beforeend", `<option value="${s}">${s}</option>`));
  scaleSel.value = Object.keys(scalesObj)[0];
  updateOutput();
}

function updateOutput() {
  const notes = data[keySel.value][catSel.value][scaleSel.value];
  output.innerHTML = notes.map(n => `${n.degree} (<b>${n.name}</b>)`).join(", ");
}

keySel.addEventListener("change", populateCategories);
catSel.addEventListener("change", populateScales);
scaleSel.addEventListener("change", updateOutput);
