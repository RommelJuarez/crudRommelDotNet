
using Microsoft.EntityFrameworkCore;

namespace crudRommel.src.Data
{
    using crudRommel.src.models;
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Servicio> Servicios { get; set; }
    }
}