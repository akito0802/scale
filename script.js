
let scaleData = {};

fetch("data/scales.json")
  .then((res) => res.json())
  .then((data) => {
    scaleData = data;
  });

const input = document.getElementById("search-input");
const results = document.getElementById("search-results");
const output = document.getElementById("scale-output");

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
