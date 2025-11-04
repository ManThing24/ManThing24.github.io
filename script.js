document.addEventListener("DOMContentLoaded", () => {
  let wheelData = [];
  let chassisData = [];

  // Parse both CSVs
  Papa.parse("data/wheels.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (res) => (wheelData = res.data)
  });

  Papa.parse("data/chassis.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (res) => (chassisData = res.data)
  });

  const wheelSection = document.getElementById("wheelSection");
  const chassisSection = document.getElementById("chassisSection");
  const wheelTab = document.getElementById("wheelTab");
  const chassisTab = document.getElementById("chassisTab");
  const wheelSearch = document.getElementById("wheelSearch");
  const chassisSearch = document.getElementById("chassisSearch");
  const wheelResults = document.getElementById("wheelResults");
  const chassisResults = document.getElementById("chassisResults");

  // === TAB SWITCHING ===
  function activateTab(tab, section) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".lookup-section").forEach(s => s.classList.add("hidden"));

    tab.classList.add("active");
    section.classList.remove("hidden");
  }

  wheelTab.addEventListener("click", () => activateTab(wheelTab, wheelSection));
  chassisTab.addEventListener("click", () => activateTab(chassisTab, chassisSection));

  // === SEARCH HANDLERS ===
  function handleSearch(data, query, resultsContainer) {
    resultsContainer.querySelectorAll(".card").forEach(c => c.remove());

    if (!query) return;

    const matches = data.filter(w =>
      Object.values(w).some(val => val && val.toLowerCase().includes(query))
    );

    if (matches.length === 0) {
      const noCard = document.createElement("div");
      noCard.className = "card";
      noCard.innerHTML = `<p>No results found.</p>`;
      resultsContainer.appendChild(noCard);
      return;
    }

    matches.forEach(match => {
      const card = document.createElement("div");
      card.className = "card";

      // Customize per lookup type
      if (resultsContainer.id === "wheelResults") {
        card.innerHTML = `
          <h3>${match.wheel_part_number}</h3>
          <div class="grid-table">
            <div><p><strong>Wheel Specs:</strong><div class="sepline"></div><br>${match.wheel_specs || "—"}</p></div>
            <div>
              <p><strong>Fits:</strong><div class="sepline"></div></p>
              <div class="fits-list">
                ${
                  match.fits_trucks
                    ? match.fits_trucks
                        .split(";")
                        .map(item => `<div class="fit-item">${item.trim()}</div>`)
                        .join("")
                    : "<div class='fit-item'>—</div>"
                }
              </div>
            </div>
            <div>
              <p><strong>Does Not Fit:</strong><div class="sepline red"></div></p>
              <div class="fits-list">
                ${
                  match.not_fit_trucks
                    ? match.not_fit_trucks
                        .split(";")
                        .map(item => `<div class="fit-item">${item.trim()}</div>`)
                        .join("")
                    : "<div class='fit-item'>—</div>"
                }
              </div>
            </div>
            <div><p><strong>Wheel Nut Front:</strong><div class="sepline"></div><br>${match.wheel_nuts_front || "—"}</p></div>
            <div><p><strong>Wheel Nut Rear:</strong><div class="sepline"></div><br>${match.wheel_nuts_rear || "—"}</p></div>
          </div>`;
      } else {
        card.innerHTML = `
          <h3>${match.chassis_code}</h3>
          <div class="grid-table">
            <div><p><strong>Truck Model:</strong><div class="sepline"></div><br>${match.truck_model || "—"}</p></div>
            <div><p><strong>Year Range:</strong><div class="sepline"></div><br>${match.year_range || "—"}</p></div>
            <div><p><strong>Notes:</strong><div class="sepline"></div><br>${match.notes || "—"}</p></div>
          </div>`;
      }

      resultsContainer.appendChild(card);
    });
  }

  wheelSearch.addEventListener("input", e =>
    handleSearch(wheelData, e.target.value.trim().toLowerCase(), wheelResults)
  );

  chassisSearch.addEventListener("input", e =>
    handleSearch(chassisData, e.target.value.trim().toLowerCase(), chassisResults)
  );
});
