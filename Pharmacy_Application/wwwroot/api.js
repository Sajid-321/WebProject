const API = {
    getMedicines: async () => {
        const res = await fetch("/api/medicine");
        return await res.json();
    },

    addMedicine: async (medicine) => {
        return await fetch("/api/medicine", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(medicine)
        });
    }
};