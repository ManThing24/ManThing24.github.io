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

    const match = wheelData.find(w =>
      w.wheel_part_number && w.wheel_part_number.toLowerCase().includes(query)
    );

    if (match) {
      const fits = (match.fits_trucks || "").split(";").map(t => t.trim()).filter(Boolean);
      const notFits = (match.not_fit_trucks || "").split(";").map(t => t.trim()).filter(Boolean);

      results.innerHTML = `
        <h2>Results for ${match.wheel_part_number}</h2>
        <p><strong>Fits:</strong></p>
        <ul>${fits.map(t => `<li>${t}</li>`).join("")}</ul>
        <p><strong>Does not fit:</strong></p>
        <ul>${notFits.map(t => `<li>${t}</li>`).join("")}</ul>
        <p><strong>Wheel Nuts:</strong> ${match.wheel_nuts}</p>
      `;
    } else {
      results.innerHTML = `<p>No results found.</p>`;
    }
  });
});
