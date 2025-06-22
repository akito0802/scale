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
  const selectedKey = keySelect.value;
  const categories = Object.keys(scaleData[selectedKey]);

  const predefinedOrder = ["メジャー", "マイナー", "チャーチ"];
  predefinedOrder.forEach(cat => {
    if (categories.includes(cat)) {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    }
  });

  // 強制的に「チャーチ」を初期表示する
  if (categories.includes("チャーチ")) {
    categorySelect.value = "チャーチ";
  } else if (categories.includes("メジャー")) {
    categorySelect.value = "メジャー";
  } else if (categories.includes("マイナー")) {
    categorySelect.value = "マイナー";
  } else {
    categorySelect.value = categories[0];
  }

  populateScales();
}

function populateScales() {
  scaleSelect.innerHTML = "";
  const key = keySelect.value;
  const category = categorySelect.value;
  const scales = Object.keys(scaleData[key][category]);

  scales.forEach(scl => {
    const opt = document.createElement("option");
    opt.value = scl;
    opt.textContent = scl;
    scaleSelect.appendChild(opt);
  });

  scaleSelect.value = scales.includes("アイオニアン") ? "アイオニアン" : scales[0];
  updateOutput();
}

function updateOutput() {
  const key = keySelect.value;
  const category = categorySelect.value;
  const scale = scaleSelect.value;
  const notes = scaleData[key][category][scale];
  if (!notes) {
    output.innerHTML = "構成音が見つかりません。";
    return;
  }
  output.innerHTML = "<strong>構成音：</strong><br>" +
    notes.map(n => `${n.degree} (${n.name})`).join(", ");
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
