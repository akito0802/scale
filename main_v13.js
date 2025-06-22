
document.addEventListener("DOMContentLoaded", () => {
  fetch("data/scales.json")
    .then((res) => res.json())
    .then((data) => {
      window.scaleData = data;
      initSelectors();
    })
    .catch((err) => {
      document.getElementById("output").textContent = "スケールデータの読み込みに失敗しました";
    });
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

  keySelect.addEventListener("change", () => updateCategories());
  categorySelect.addEventListener("change", () => updateScales());
  scaleSelect.addEventListener("change", () => displayScale());

  updateCategories();
}

function updateCategories() {
  const key = document.getElementById("key-select").value;
  const categorySelect = document.getElementById("category-select");
  categorySelect.innerHTML = "";

  if (!scaleData[key]) return;

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
  const category = document.getElementById("category-select").value;
  const scaleSelect = document.getElementById("scale-select");
  scaleSelect.innerHTML = "";

  if (!scaleData[key] || !scaleData[key][category]) return;

  for (const scale in scaleData[key][category]) {
    const opt = document.createElement("option");
    opt.value = scale;
    opt.textContent = scale;
    scaleSelect.appendChild(opt);
  }

  displayScale();
}

function displayScale() {
  const key = document.getElementById("key-select").value;
  const category = document.getElementById("category-select").value;
  const scale = document.getElementById("scale-select").value;
  const output = document.getElementById("output");

  if (!scaleData[key] || !scaleData[key][category] || !scaleData[key][category][scale]) {
    output.textContent = "スケール情報が見つかりません";
    return;
  }

  const data = scaleData[key][category][scale];
  let html = `<table><tr><th>度数</th><th>音名</th><th>説明</th></tr>`;
  html += data.map(note => `<tr><td>${note.degree}</td><td>${note.note}</td><td>${note.description || ""}</td></tr>`).join("");
  html += `</table>`;
  output.innerHTML = html;
}
