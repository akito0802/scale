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

function initUI() {
  // キー一覧
  keySelect.innerHTML = "";
  Object.keys(scaleData).forEach(key => {
    keySelect.insertAdjacentHTML("beforeend", `<option value="${key}">${key}</option>`);
  });
  keySelect.value = "C";

  populateCategories();
}

function populateCategories() {
  categorySelect.innerHTML = "";
  const categories = Object.keys(scaleData[keySelect.value]);
  categories.forEach(cat => {
    categorySelect.insertAdjacentHTML("beforeend", `<option value="${cat}">${cat}</option>`);
  });
  categorySelect.value = "メジャー";

  populateScales();
}

function populateScales() {
  scaleSelect.innerHTML = "";
  const key = keySelect.value;
  const category = categorySelect.value;
  const scales = Object.keys(scaleData[key][category]);
  scales.forEach(name => {
    scaleSelect.insertAdjacentHTML("beforeend", `<option value="${name}">${name}</option>`);
  });
  scaleSelect.value = "メジャー";

  updateOutput();
}

function updateOutput() {
  const key = keySelect.value;
  const category = categorySelect.value;
  const scaleName = scaleSelect.value;
  const notes = scaleData[key][category][scaleName];
  output.innerHTML = "<strong>構成音：</strong><br>" + notes.map(n => `${n.degree} (${n.name})`).join(", ");
}

// イベント
keySelect.addEventListener("change", () => {
  populateCategories();
});
categorySelect.addEventListener("change", () => {
  populateScales();
});
scaleSelect.addEventListener("change", updateOutput);
