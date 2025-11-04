document.addEventListener("DOMContentLoaded", () => {
  let wheelData = [];

  // Load CSV
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
  const results = document.getElementById("results"); // your <main id="results">

  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();

    // Remove any previous cards, keep the <h2> heading
    results.querySelectorAll(".card").forEach(c => c.remove());

    if (!query) return; // nothing typed → no cards

    const matches = wheelData.filter(wheel =>
      Object.values(wheel).some(val =>
        val && val.toLowerCase().includes(query)
      )
    );

    if (matches.length === 0) {
      // Show "No results" as a card
      const noCard = document.createElement("div");
      noCard.className = "card";
      noCard.innerHTML = `<p>No results found.</p>`;
      results.appendChild(noCard);
      return;
    }

    // Create cards dynamically for all matches
    matches.forEach(match => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${match.wheel_part_number}</h3>
        <div class="grid-table">
          <div><p><strong>Wheel Specs:</strong><div class="sepline"></div><br>${match.wheel_specs || "—"}</p></div>
          <div><p><strong>Fits:</strong><div class="sepline"></div><br>${match.fits_trucks || "—"}</p></div>
          <div><p><strong>Does Not Fit:</strong><div class="sepline"></div><br>${match.not_fit_trucks || "—"}</p></div>
          <div><p><strong>Wheel Nut:</strong><div class="sepline"></div><br>${match.wheel_nuts || "—"}</p></div>
        </div>
      `;
      results.appendChild(card);
    });
  });
});
