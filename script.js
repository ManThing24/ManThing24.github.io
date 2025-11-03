document.addEventListener("DOMContentLoaded", () => {
  let wheelData = [];

  Papa.parse("data/wheels.csv", {
    download: true,
    header: true,
    complete: (results) => {
      wheelData = results.data;
    },
  });

  const searchInput = document.getElementById("search");
  const resultsDiv = document.getElementById("results");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    const match = wheelData.find(w => w.wheel_part_number.toLowerCase() === query);

    if (match) {
      resultsDiv.innerHTML = `
        <h2>Results for ${match.wheel_part_number}</h2>
        <p><strong>Fits:</strong> ${match.fits_trucks}</p>
        <p><strong>Does not fit:</strong> ${match.not_fit_trucks}</p>
        <p><strong>Wheel Nuts:</strong> ${match.wheel_nuts}</p>
      `;
    } else {
      resultsDiv.innerHTML = query ? "<p>No results found.</p>" : "";
    }
  });
});
