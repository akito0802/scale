const keySelect = document.getElementById("key-select");
const categorySelect = document.getElementById("category-select");
const scaleSelect = document.getElementById("scale-select");
const output = document.getElementById("output");

let scaleData = {};

fetch("scales.json")
  .then(res => res.json())
  .then(data => {
    scaleData = data;
    initUI();
  });

const CATEGORY_LIST = ["メジャー", "マイナー", "チャーチ"]; // 常に表示

function initUI() {
  // キーをセット
  keySelect.innerHTML = "";
  Object.keys(scaleData).forEach(key => {
    keySelect.insertAdjacentHTML("beforeend", `<option value="${key}">${key}</option>`);
  });
  keySelect.value = "C";
  populateCategories();
}

function populateCategories() {
  categorySelect.innerHTML = "";
  const key = keySelect.value;

  CATEGORY_LIST.forEach(cat => {
    const exists = !!scaleData[key][cat];
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat + (exists ? "" : " (なし)");
    if (!exists) opt.disabled = true;
    categorySelect.appendChild(opt);
  });

  // 初期選択は最初に利用可能なカテゴリ
  let firstAvailable = CATEGORY_LIST.find(cat => !!scaleData[key][cat]);
  categorySelect.value = firstAvailable;
  populateScales();
}

function populateScales() {
  scaleSelect.innerHTML = "";
  const key = keySelect.value;
  const category = categorySelect.value;
  const scalesObj = scaleData[key][category];

  if (!scalesObj) {
    scaleSelect.insertAdjacentHTML("beforeend", `<option>該当なし</option>`);
    output.textContent = "このキーにはそのカテゴリーのスケールがありません。";
    return;
  }

  const scales = Object.keys(scalesObj);
  scales.forEach(scl => {
    scaleSelect.insertAdjacentHTML("beforeend", `<option value="${scl}">${scl}</option>`);
  });
  scaleSelect.value = scales[0];
  updateOutput();
}

function updateOutput() {
  const key = keySelect.value;
  const category = categorySelect.value;
  const scale = scaleSelect.value;
  const notes = scaleData[key][category][scale];
  if (!notes) {
    output.textContent = "構成音が見つかりません。";
    return;
  }
  output.innerHTML = "<strong>構成音：</strong><br>" +
    notes.map(n => `${n.degree} (${n.name})`).join(", ");
}

// イベント
keySelect.addEventListener("change", populateCategories);
categorySelect.addEventListener("change", populateScales);
scaleSelect.addEventListener("change", updateOutput);
