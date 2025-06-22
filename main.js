const keySelect = document.getElementById("key-select");
const categorySelect = document.getElementById("category-select");
const scaleSelect = document.getElementById("scale-select");
const output = document.getElementById("output");

let scaleData = {};

fetch("scales.json")
  .then(res => res.json())
  .then(data => {
    scaleData = data;
    initializeUI();
  });

function initializeUI() {
  // キー一覧をセット
  keySelect.innerHTML = "";
  const keys = Object.keys(scaleData);
  keys.forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = key;
    keySelect.appendChild(opt);
  });

  // 初期選択
  keySelect.value = "C";

  populateCategories();
}

function populateCategories() {
  categorySelect.innerHTML = "";
  const categories = Object.keys(scaleData[keySelect.value]);
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });

  categorySelect.value = "メジャー";
  populateScales();
}

function populateScales() {
  scaleSelect.innerHTML = "";
  const scales = Object.keys(scaleData[keySelect.value][categorySelect.value]);
  scales.forEach(scl => {
    const opt = document.createElement("option");
    opt.value = scl;
    opt.textContent = scl;
    scaleSelect.appendChild(opt);
  });

  scaleSelect.value = "メジャー";
  updateOutput();
}

function updateOutput() {
  const scaleInfo = scaleData[keySelect.value][categorySelect.value][scaleSelect.value];
  if (!scaleInfo) {
    output.innerHTML = "構成音が見つかりません。";
    return;
  }
  output.innerHTML = "<strong>構成音：</strong><br>" +
    scaleInfo.map(note => `${note.degree} (${note.name})`).join(", ");
}

keySelect.addEventListener("change", () => {
  populateCategories();
});

categorySelect.addEventListener("change", () => {
  populateScales();
});

scaleSelect.addEventListener("change", () => {
  updateOutput();
});
