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
  const results = document.getElementById("card");

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
        <h3>${match.wheel_part_number}</h3>
        <div class="grid-table">
          <div><p><strong>Wheel Specs:</strong>
          <div class="sepline"></div>
          <br>${match.wheel_specs || "—"}</p></div>
          
          <div><p><strong>Fits:</strong>
          <div class="sepline"></div>
          <br>${match.fits_trucks || "—"}</p></div>
          
          <div><p><strong>Does Not Fit:</strong>
          <div class="sepline"></div>
          <br>${match.not_fit_trucks || "—"}</p></div>
          
          <div><p><strong>Wheel Nut:</strong>
          <div class="sepline"></div>
          <br>${match.wheel_nuts || "—"}</p></div>
        </div>
    `).join("");
  });
});
