const keySelect = document.getElementById("key-select");
const categorySelect = document.getElementById("category-select");
const scaleSelect = document.getElementById("scale-select");
const output = document.getElementById("output");

let scaleData = {};
const CATEGORY_LIST = ["メジャー", "マイナー", "チャーチ", "ジャズ"];

fetch("scales.json")
  .then(res => res.json())
  .then(data => {
    scaleData = data;
    initUI();
  });

function initUI() {
  keySelect.innerHTML = "";
  Object.keys(scaleData).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = key;
    keySelect.appendChild(opt);
  });
  keySelect.value = "C";
  populateCategories();
}

function populateCategories() {
  categorySelect.innerHTML = "";
  const key = keySelect.value;
  const availableCats = Object.keys(scaleData[key]);

  CATEGORY_LIST.forEach(cat => {
    const exists = availableCats.includes(cat);
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = exists ? cat : cat + "（なし）";
    if (!exists) opt.disabled = true;
    categorySelect.appendChild(opt);
  });

  const firstAvailable = CATEGORY_LIST.find(cat => availableCats.includes(cat));
  categorySelect.value = firstAvailable || CATEGORY_LIST[0];
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
    const opt = document.createElement("option");
    opt.value = scl;
    opt.textContent = scl;
    scaleSelect.appendChild(opt);
  });

  scaleSelect.value = scales[0];
  updateOutput();
}

function updateOutput() {
  const key = keySelect.value;
  const category = categorySelect.value;
  const scale = scaleSelect.value;
  const notes = scaleData[key][category]?.[scale];
  if (!notes) {
    output.innerHTML = "構成音が見つかりません。";
    return;
  }
  output.innerHTML = "<strong>構成音：</strong><br>" +
    notes.map(n => `${n.degree} (${n.name})`).join(", ");
}

keySelect.addEventListener("change", populateCategories);
categorySelect.addEventListener("change", populateScales);
scaleSelect.addEventListener("change", updateOutput);
