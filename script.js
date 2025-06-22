
document.addEventListener("DOMContentLoaded", () => {
  fetch("data/scales.json")
    .then((res) => res.json())
    .then((data) => {
      window.scaleData = data;
      initializeSelectors();
    })
    .catch((err) => {
      document.getElementById("scale-output").textContent = "スケールデータの読み込みに失敗しました";
    });
});

function initializeSelectors() {
  const keySelect = document.getElementById("key-select");
  const categorySelect = document.getElementById("category-select");
  const scaleSelect = document.getElementById("scale-select");

  keySelect.innerHTML = "";
  for (const key in scaleData) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    keySelect.appendChild(option);
  }

  keySelect.addEventListener("change", () => {
    updateCategorySelector(keySelect.value);
  });

  categorySelect.addEventListener("change", () => {
    updateScaleSelector(keySelect.value, categorySelect.value);
  });

  scaleSelect.addEventListener("change", () => {
    showScaleInfo(keySelect.value, categorySelect.value, scaleSelect.value);
  });

  if (keySelect.options.length > 0) {
    keySelect.selectedIndex = 0;
    updateCategorySelector(keySelect.value);
  }
}

function updateCategorySelector(selectedKey) {
  const categorySelect = document.getElementById("category-select");
  const scaleSelect = document.getElementById("scale-select");
  categorySelect.innerHTML = "";
  scaleSelect.innerHTML = "";

  const categories = Object.keys(scaleData[selectedKey]);
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  }

  if (categories.length > 0) {
    categorySelect.selectedIndex = 0;
    updateScaleSelector(selectedKey, categorySelect.value);
  }
}

function updateScaleSelector(selectedKey, selectedCategory) {
  const scaleSelect = document.getElementById("scale-select");
  scaleSelect.innerHTML = "";

  const scales = Object.keys(scaleData[selectedKey][selectedCategory]);
  for (const scale of scales) {
    const option = document.createElement("option");
    option.value = scale;
    option.textContent = scale;
    scaleSelect.appendChild(option);
  }

  if (scales.length > 0) {
    scaleSelect.selectedIndex = 0;
    showScaleInfo(selectedKey, selectedCategory, scaleSelect.value);
  }
}

function showScaleInfo(key, category, scaleName) {
  const scale = scaleData[key][category][scaleName];
  const output = document.getElementById("scale-output");
  output.innerHTML = `<h2>${scaleName}（キー: ${key}）</h2>`;

  let table = `<table><tr><th>度数</th><th>音名</th><th>説明</th></tr>`;
  table += scale.map(item => {
    return `<tr><td>${item.degree}</td><td>${item.note}</td><td>${item.description || "説明なし"}</td></tr>`;
  }).join("");
  table += `</table>`;

  output.innerHTML += table;
}
