
document.addEventListener("DOMContentLoaded", () => {
  if (!window.scaleData) {
    document.getElementById("output").textContent = "スケールデータが読み込めませんでした";
    return;
  }
  initSelectors();
});

function initSelectors() {
  const keySelect = document.getElementById("key-select");
  const categorySelect = document.getElementById("category-select");
  const scaleSelect = document.getElementById("scale-select");

  for (const key in scaleData) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = key;
    keySelect.appendChild(opt);
  }

  keySelect.addEventListener("change", updateCategories);
  categorySelect.addEventListener("change", updateScales);
  scaleSelect.addEventListener("change", displayScale);

  updateCategories();
}

function updateCategories() {
  const key = document.getElementById("key-select").value;
  const categorySelect = document.getElementById("category-select");
  const scaleSelect = document.getElementById("scale-select");
  categorySelect.innerHTML = "";
  scaleSelect.innerHTML = "";

  for (const cat in scaleData[key]) {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  }

  updateScales();
}

function updateScales() {
  const key = document.getElementById("key-select").value;
  const cat = document.getElementById("category-select").value;
  const scaleSelect = document.getElementById("scale-select");
  scaleSelect.innerHTML = "";

  for (const sc in scaleData[key][cat]) {
    const opt = document.createElement("option");
    opt.value = sc;
    opt.textContent = sc;
    scaleSelect.appendChild(opt);
  }

  displayScale();
}

function displayScale() {
  const key = document.getElementById("key-select").value;
  const cat = document.getElementById("category-select").value;
  const sc = document.getElementById("scale-select").value;
  const output = document.getElementById("output");

  if (!scaleData[key] || !scaleData[key][cat] || !scaleData[key][cat][sc]) {
    output.textContent = "データなし";
    return;
  }

  let html = '<table><tr><th>度数</th><th>音名</th><th>説明</th></tr>';
  scaleData[key][cat][sc].forEach(item => {
    html += `<tr><td>${item.degree}</td><td>${item.note}</td><td>${item.description||''}</td></tr>`;
  });
  html += '</table>';
  output.innerHTML = html;
}
