using Microsoft.AspNetCore.Mvc;
using Pharmacy_Application.Models;
using Pharmacy_Application.Services;

namespace Pharmacy_Application.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicineController : ControllerBase
    {
        private readonly MedicineService _service;

        public MedicineController()
        {
            _service = new MedicineService();
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_service.GetAll());
        }

        [HttpPost]
        public IActionResult Add(Medicine medicine)
        {
            _service.Add(medicine);
            return Ok(new { message = "Medicine added successfully" });
        }
        [HttpPut("{id}")]
        public IActionResult Update(int id, Medicine updatedMedicine)
        {
            var list = _service.GetAll();

            var existing = list.FirstOrDefault(x => x.Id == id);
            if (existing == null)
                return NotFound();

            existing.FullName = updatedMedicine.FullName;
            existing.Notes = updatedMedicine.Notes;
            existing.ExpiryDate = updatedMedicine.ExpiryDate;
            existing.Quantity = updatedMedicine.Quantity;
            existing.Price = updatedMedicine.Price;
            existing.Brand = updatedMedicine.Brand;

            _service.SaveAll(list);

            return Ok(new { message = "Updated successfully" });
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var list = _service.GetAll();

            var medicine = list.FirstOrDefault(x => x.Id == id);
            if (medicine == null)
                return NotFound();

            list.Remove(medicine);

            _service.SaveAll(list);

            return Ok(new { message = "Deleted successfully" });
        }
    }
}
