using Pharmacy_Application.Models;
using System.Text.Json;

namespace Pharmacy_Application.Services
{
    public class MedicineService
    {
        private readonly string filePath = "Data/medicines.json";

        public List<Medicine> GetAll()
        {
            if (!File.Exists(filePath)) return new List<Medicine>();

            var json = File.ReadAllText(filePath);
            return JsonSerializer.Deserialize<List<Medicine>>(json) ?? new List<Medicine>();
        }

        public void SaveAll(List<Medicine> medicines)
        {
            var json = JsonSerializer.Serialize(medicines, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            File.WriteAllText(filePath, json);
        }

        public void Add(Medicine medicine)
        {
            var list = GetAll();
            medicine.Id = list.Count > 0 ? list.Max(x => x.Id) + 1 : 1;
            list.Add(medicine);
            SaveAll(list);
        }
    }
}
