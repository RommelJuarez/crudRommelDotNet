using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using crudRommel.src.models;
using crudRommel.src.Data;

namespace crudRommel.src.controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicioController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServicioController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Servicio
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Servicio>>> GetServicios()
        {
            var servicios = await _context.Servicios.ToListAsync();
            return Ok(servicios);
        }

        // GET: api/Servicio/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Servicio>> GetServicio(int id)
        {
            var servicio = await _context.Servicios.FindAsync(id);
            
            if (servicio == null)
            {
                return NotFound();
            }

            return Ok(servicio);
        }

        // GET: api/Servicio/cliente/5
        [HttpGet("cliente/{clienteId}")]
        public async Task<ActionResult<IEnumerable<Servicio>>> GetServiciosByCliente(int clienteId)
        {
            var servicios = await _context.Servicios
                .Where(s => s.clienteId == clienteId)
                .ToListAsync();
            return Ok(servicios);
        }

        // POST: api/Servicio
        [HttpPost]
        public async Task<ActionResult<Servicio>> PostServicio(Servicio servicio)
        {
            // Validar que el cliente exista
            var clienteExists = await _context.Clientes.AnyAsync(c => c.clienteId == servicio.clienteId);
            if (!clienteExists)
            {
                return BadRequest("El cliente especificado no existe");
            }

            _context.Servicios.Add(servicio);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetServicio), new { id = servicio.servicioId }, servicio);
        }

        // PUT: api/Servicio/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutServicio(int id, Servicio servicio)
        {
            if (id != servicio.servicioId)
            {
                return BadRequest();
            }

            // Validar que el cliente exista si se está cambiando
            var clienteExists = await _context.Clientes.AnyAsync(c => c.clienteId == servicio.clienteId);
            if (!clienteExists)
            {
                return BadRequest("El cliente especificado no existe");
            }

            _context.Entry(servicio).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServicioExists(id))
                {
                    return NotFound();
                }
                throw;
            }
            
            return NoContent();
        }

        // DELETE: api/Servicio/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServicio(int id)
        {
            var servicio = await _context.Servicios.FindAsync(id);
            
            if (servicio == null)
            {
                return NotFound();
            }

            _context.Servicios.Remove(servicio);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }

        private bool ServicioExists(int id)
        {
            return _context.Servicios.Any(e => e.servicioId == id);
        }
    }
}