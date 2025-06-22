const keySelect = document.getElementById("key-select");
const categorySelect = document.getElementById("category-select");
const scaleSelect = document.getElementById("scale-select");
const output = document.getElementById("output");

let scaleData = {};

fetch("scales.json")
  .then(res => res.json())
  .then(data => {
    scaleData = data;
    populateKeys();
  });

function populateKeys() {
  const keys = Object.keys(scaleData);
  keys.forEach(key => {
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
  const categories = Object.keys(scaleData[keySelect.value]);
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
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
  updateOutput();
}

function updateOutput() {
  const scaleInfo = scaleData[keySelect.value][categorySelect.value][scaleSelect.value];
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
