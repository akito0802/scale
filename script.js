
let scaleData = {};
const keySelect = document.getElementById("key-select");
const categorySelect = document.getElementById("category-select");
const scaleSelect = document.getElementById("scale-select");
const input = document.getElementById("search-input");
const results = document.getElementById("search-results");
const output = document.getElementById("scale-output");

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/scales.json")
    .then((res) => res.json())
    .then((data) => {
      scaleData = data;
      initSelectors();
    });
});

function initSelectors() {
  keySelect.innerHTML = "";
  const keys = Object.keys(scaleData);
  keys.forEach((key) => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    keySelect.appendChild(option);
  });

  keySelect.addEventListener("change", updateCategories);
  categorySelect.addEventListener("change", updateScales);
  scaleSelect.addEventListener("change", displayScale);

  updateCategories();
}

function updateCategories() {
  const selectedKey = keySelect.value;
  categorySelect.innerHTML = "";
  scaleSelect.innerHTML = "";
  if (!scaleData[selectedKey]) return;

  const categories = Object.keys(scaleData[selectedKey]);
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  updateScales();
}

function updateScales() {
  const selectedKey = keySelect.value;
  const selectedCategory = categorySelect.value;
  scaleSelect.innerHTML = "";
  if (!scaleData[selectedKey] || !scaleData[selectedKey][selectedCategory]) return;

  const scales = Object.keys(scaleData[selectedKey][selectedCategory]);
  scales.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    scaleSelect.appendChild(option);
  });

  displayScale();
}

function displayScale() {
  const selectedKey = keySelect.value;
  const selectedCategory = categorySelect.value;
  const selectedScale = scaleSelect.value;

  if (!scaleData[selectedKey] || !scaleData[selectedKey][selectedCategory] || !scaleData[selectedKey][selectedCategory][selectedScale]) {
    output.textContent = "スケール情報が見つかりません。";
    return;
  }

  const info = scaleData[selectedKey][selectedCategory][selectedScale];
  output.innerHTML = `<h2>${selectedScale}（キー: ${selectedKey}）</h2>`;
  output.innerHTML += "<ul>" + info.map(note =>
    `<li>${note.degree}度: ${note.note} (${note.description || "説明なし"})</li>`).join("") + "</ul>";
  results.classList.add("hidden");
  input.value = "";
}

// 検索機能（前と同じ）
input.addEventListener("input", () => {
  const query = input.value.trim().toLowerCase();
  results.innerHTML = "";

  if (query === "") {
    results.classList.add("hidden");
    return;
  }

  let matches = [];

  for (const key in scaleData) {
    const categories = scaleData[key];
    for (const category in categories) {
      const scales = categories[category];
      for (const name in scales) {
        if (name.toLowerCase().includes(query)) {
          matches.push({ name, category, key });
        }
      }
    }
  }

  if (matches.length === 0) {
    results.classList.add("hidden");
    return;
  }

  results.classList.remove("hidden");

  matches.forEach((match) => {
    const li = document.createElement("li");
    li.textContent = `[${match.key}] ${match.name}`;
    li.addEventListener("click", () => {
      const info = scaleData[match.key][match.category][match.name];
      output.innerHTML = `<h2>${match.name}（キー: ${match.key}）</h2>`;
      output.innerHTML += "<ul>" + info.map(note =>
        `<li>${note.degree}度: ${note.note} (${note.description || "説明なし"})</li>`).join("") + "</ul>";
      results.classList.add("hidden");
      input.value = "";
    });
    results.appendChild(li);
  });
});
