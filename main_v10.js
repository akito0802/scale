
let data;
let keySelect = document.getElementById("key-select");
let categorySelect = document.getElementById("category-select");
let scaleSelect = document.getElementById("scale-select");
let outputDiv = document.getElementById("output");

fetch("scales.json")
  .then(response => response.json())
  .then(json => {
    data = json;
    populateKeys();
    keySelect.value = "C";
    populateCategories();
    populateScales();
    updateOutput();
  });

function populateKeys() {
  Object.keys(data).forEach(key => {
    let option = document.createElement("option");
    option.value = key;
    option.text = key;
    keySelect.appendChild(option);
  });
}

function populateCategories() {
  categorySelect.innerHTML = "";
  const currentKey = keySelect.value;
  const categories = Object.keys(data[currentKey]);
  categories.forEach(cat => {
    let option = document.createElement("option");
    option.value = cat;
    option.text = cat;
    categorySelect.appendChild(option);
  });
}

function populateScales() {
  scaleSelect.innerHTML = "";
  const currentKey = keySelect.value;
  const currentCategory = categorySelect.value;
  const scales = Object.keys(data[currentKey][currentCategory]);
  scales.forEach(scale => {
    let option = document.createElement("option");
    option.value = scale;
    option.text = scale;
    scaleSelect.appendChild(option);
  });
}

function updateOutput() {
  const currentKey = keySelect.value;
  const currentCategory = categorySelect.value;
  const currentScale = scaleSelect.value;

  const notes = data[currentKey][currentCategory][currentScale];
  outputDiv.innerHTML = notes.map(n => n.name).join(" - ");
}

keySelect.addEventListener("change", () => {
  const selectedCategory = categorySelect.value;
  const selectedScale = scaleSelect.value;

  populateCategories();
  categorySelect.value = selectedCategory || categorySelect.options[0].value;

  populateScales();
  scaleSelect.value = selectedScale || scaleSelect.options[0].value;

  updateOutput();
});

categorySelect.addEventListener("change", () => {
  populateScales();
  updateOutput();
});

scaleSelect.addEventListener("change", updateOutput);
