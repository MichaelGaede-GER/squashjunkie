// Gemeinsame Logik zur Verwaltung einer Teamaufstellung mit automatischen
// Positionen (M1-M4/W1-W2 Pflicht, M5+/W3+ Ersatz). Wird sowohl von der
// Captain-Seite (team.html) als auch von der Admin-Bearbeitungsseite
// (admin/team-edit.html) verwendet. Reagiert auf Sprachwechsel (langchange).
//
// Erwartete DOM-Elemente auf der Seite:
//   #teamName, #groupMen, #groupWomen, #groupSupporters,
//   #addManBtn, #addWomanBtn, #addSupporterBtn,
//   #statMen, #statWomen, #statPrice, #error, #saveBtn,
//   <template id="playerRowTemplate"> ... </template>

function emptyPerson() {
  return { firstName: "", lastName: "", email: "", mobile: "", shirtSize: "" };
}

function createRosterEditor({ settings, editable, onSave }) {
  let men = [];
  let women = [];
  let supporters = [];

  const rowTemplate = document.getElementById("playerRowTemplate");

  function shirtOptions() {
    return (settings.shirt_sizes || "XS,S,M,L,XL,XXL").split(",").map((s) => s.trim());
  }

  function loadPlayers(serverPlayers) {
    men = [];
    women = [];
    supporters = [];
    for (const p of serverPlayers || []) {
      const person = {
        firstName: p.first_name,
        lastName: p.last_name,
        email: p.email,
        mobile: p.mobile,
        shirtSize: p.shirt_size,
      };
      if (p.type === "supporter") supporters.push(person);
      else if (p.gender === "w") women.push(person);
      else men.push(person);
    }
    while (men.length < 4) men.push(emptyPerson());
    while (women.length < 2) women.push(emptyPerson());
  }

  function buildRow(person, label, removable, onRemove) {
    const node = rowTemplate.content.firstElementChild.cloneNode(true);
    translateNode(node);
    node.querySelector(".position-badge").textContent = label;
    node.querySelector('[data-field="firstName"]').value = person.firstName || "";
    node.querySelector('[data-field="lastName"]').value = person.lastName || "";
    node.querySelector('[data-field="email"]').value = person.email || "";
    node.querySelector('[data-field="mobile"]').value = person.mobile || "";

    const shirtSelect = node.querySelector('[data-field="shirtSize"]');
    shirtSelect.innerHTML =
      '<option value="">–</option>' +
      shirtOptions().map((s) => `<option value="${s}">${s}</option>`).join("");
    shirtSelect.value = person.shirtSize || "";

    node.querySelectorAll("input, select").forEach((el) => {
      const field = el.dataset.field;
      if (!field) return;
      el.disabled = !editable;
      el.addEventListener("input", () => {
        person[field] = el.value;
      });
    });

    const removeBtn = node.querySelector(".remove-btn");
    if (editable && removable) {
      removeBtn.addEventListener("click", onRemove);
    } else {
      removeBtn.style.display = "none";
    }

    return node;
  }

  function renderGroup(containerId, list, prefix, minRequired) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    list.forEach((person, index) => {
      const label = prefix ? `${prefix}${index + 1}` : t("team.position.supporter");
      const removable = index >= minRequired;
      container.appendChild(
        buildRow(person, label, removable, () => {
          list.splice(index, 1);
          renderAll();
        })
      );
    });
  }

  function renderStats() {
    const price =
      (men.length + women.length) * Number(settings.price_player) +
      supporters.length * Number(settings.price_supporter);

    const menEl = document.getElementById("statMen");
    const womenEl = document.getElementById("statWomen");
    if (menEl) {
      menEl.textContent = t("team.minMen", { count: men.length });
      menEl.style.color = men.length >= 4 ? "" : "#fbbf24";
    }
    if (womenEl) {
      womenEl.textContent = t("team.minWomen", { count: women.length });
      womenEl.style.color = women.length >= 2 ? "" : "#fbbf24";
    }
    const priceEl = document.getElementById("statPrice");
    if (priceEl) priceEl.textContent = formatMoney(price);
  }

  function renderAll() {
    renderGroup("groupMen", men, "M", 4);
    renderGroup("groupWomen", women, "W", 2);
    renderGroup("groupSupporters", supporters, "", 0);
    renderStats();
  }

  function setEditableUI() {
    const addMan = document.getElementById("addManBtn");
    const addWoman = document.getElementById("addWomanBtn");
    const addSupporter = document.getElementById("addSupporterBtn");
    const saveBtn = document.getElementById("saveBtn");
    if (addMan) addMan.style.display = editable ? "inline-flex" : "none";
    if (addWoman) addWoman.style.display = editable ? "inline-flex" : "none";
    if (addSupporter) addSupporter.style.display = editable ? "inline-flex" : "none";
    if (saveBtn) saveBtn.style.display = editable ? "inline-flex" : "none";
    const nameInput = document.getElementById("teamName");
    if (nameInput) nameInput.disabled = !editable;
  }

  function buildPayload() {
    const toPlayer = (p, gender) => ({
      firstName: p.firstName,
      lastName: p.lastName,
      gender,
      type: "player",
      email: p.email,
      mobile: p.mobile,
      shirtSize: p.shirtSize,
    });
    const toSupporter = (p) => ({
      firstName: p.firstName,
      lastName: p.lastName,
      gender: null,
      type: "supporter",
      email: p.email,
      mobile: p.mobile,
      shirtSize: p.shirtSize,
    });
    return [
      ...men.map((p) => toPlayer(p, "m")),
      ...women.map((p) => toPlayer(p, "w")),
      ...supporters.map(toSupporter),
    ];
  }

  document.getElementById("addManBtn")?.addEventListener("click", () => {
    men.push(emptyPerson());
    renderAll();
  });
  document.getElementById("addWomanBtn")?.addEventListener("click", () => {
    women.push(emptyPerson());
    renderAll();
  });
  document.getElementById("addSupporterBtn")?.addEventListener("click", () => {
    supporters.push(emptyPerson());
    renderAll();
  });

  document.getElementById("saveBtn")?.addEventListener("click", async () => {
    const errorEl = document.getElementById("error");
    const saveBtn = document.getElementById("saveBtn");
    errorEl.style.display = "none";
    saveBtn.disabled = true;
    saveBtn.textContent = t("common.saving");

    const name = document.getElementById("teamName").value.trim();
    const { error } = await onSave(name, buildPayload());

    saveBtn.disabled = false;

    if (error) {
      errorEl.textContent = translateDbError(error);
      errorEl.style.display = "block";
      saveBtn.textContent = t("common.save");
      return;
    }

    saveBtn.textContent = t("common.saved");
    setTimeout(() => {
      saveBtn.textContent = t("common.save");
    }, 3000);
  });

  document.addEventListener("langchange", renderAll);

  return {
    loadPlayers,
    renderAll,
    setEditableUI,
  };
}
