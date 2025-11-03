document.addEventListener("DOMContentLoaded", () => {
  let wheelData = [];

  Papa.parse("data/wheels.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      wheelData = results.data;
      console.log("✅ CSV Loaded:", wheelData);
    },
    error: (err) => {
      console.error("❌ CSV load error:", err);
    }
  });

  const search = document.getElementById("search");
  const results = document.getElementById("results");

  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    if (!query) {
      results.innerHTML = "";
      return;
    }

    const matches = wheelData.filter(w =>
      Object.values(w).some(val =>
        val && val.toLowerCase().includes(query)
      )
    );

    if (matches.length === 0) {
      results.innerHTML = `<p>No results found.</p>`;
      return;
    }

    results.innerHTML = matches.map(match => `
      <div class="result-card">
        <h3>${match.wheel_part_number}</h3>
        <p><strong>Wheel Specs:</strong><br>${match.wheel_specs || "—"}</p>
        <p><strong>Fits:</strong><br>${match.fits_trucks || "—"}</p>
        <p><strong>Does Not Fit:</strong><br>${match.not_fit_trucks || "—"}</p>
        <p><strong>Wheel Nut:</strong><br>${match.wheel_nuts || "—"}</p>
      </div>
    `).join("");
  });
});
