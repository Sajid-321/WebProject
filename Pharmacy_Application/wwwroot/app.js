let state = {
    medicines: [],
    search: "",
    editId: null
};

// -------------------------
// LOAD DATA
// -------------------------
async function loadData() {
    state.medicines = await API.getMedicines();
    render();
}

// -------------------------
// ALERT LOGIC
// -------------------------
function getRowColor(m) {

    const expiry = new Date(m.expiryDate);
    const today = new Date();

    const daysLeft = (expiry - today) / (1000 * 60 * 60 * 24);

    if (daysLeft < 30) return "danger";
    if (m.quantity < 10) return "warning";

    return "";
}

// -------------------------
// RENDER UI
// -------------------------
function render() {

    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    const filtered = state.medicines.filter(m =>
        m.fullName.toLowerCase().includes(state.search || "")
    );

    filtered.forEach(m => {

        const rowClass = getRowColor(m);

        tbody.innerHTML += `
            <tr class="${rowClass}">
                <td>${m.fullName}</td>
                <td>${new Date(m.expiryDate).toLocaleDateString()}</td>
                <td>${m.quantity}</td>
                <td>${Number(m.price).toFixed(2)}</td>
                <td>${m.brand}</td>

                <td>
                    <button onclick="editMedicine(${m.id})">Edit</button>
                    <button onclick="deleteMedicine(${m.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// -------------------------
// SEARCH
// -------------------------
document.getElementById("searchBox").addEventListener("input", (e) => {
    state.search = e.target.value.toLowerCase();
    render();
});

// -------------------------
// ADD / UPDATE
// -------------------------
document.getElementById("medicineForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const medicine = {
        fullName: document.getElementById("fullName").value,
        notes: document.getElementById("notes").value,
        expiryDate: document.getElementById("expiryDate").value,
        quantity: parseInt(document.getElementById("quantity").value),
        price: parseFloat(document.getElementById("price").value),
        brand: document.getElementById("brand").value
    };

    try {

        // UPDATE MODE
        if (state.editId !== null) {

            await fetch(`/api/medicine/${state.editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(medicine)
            });

            state.editId = null;

        }
        // ADD MODE
        else {
            await API.addMedicine(medicine);
        }

        e.target.reset();
        await loadData();

    } catch (err) {
        console.error("Error saving medicine:", err);
    }
});

// -------------------------
// DELETE
// -------------------------
async function deleteMedicine(id) {

    if (!confirm("Are you sure you want to delete this medicine?")) return;

    await fetch(`/api/medicine/${id}`, {
        method: "DELETE"
    });

    await loadData();
}

// -------------------------
// EDIT
// -------------------------
function editMedicine(id) {

    const medicine = state.medicines.find(m => m.id === id);

    if (!medicine) return;

    document.getElementById("fullName").value = medicine.fullName || "";
    document.getElementById("notes").value = medicine.notes || "";
    document.getElementById("expiryDate").value = medicine.expiryDate?.split("T")[0] || "";
    document.getElementById("quantity").value = medicine.quantity || 0;
    document.getElementById("price").value = medicine.price || 0;
    document.getElementById("brand").value = medicine.brand || "";

    state.editId = id;
}

// -------------------------
// INIT
// -------------------------
loadData();