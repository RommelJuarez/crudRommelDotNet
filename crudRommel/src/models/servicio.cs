namespace crudRommel.src.models
{
    public class Servicio
    {
        public int servicioId { get; set; }
        public required string nombreServicio { get; set; }
        public string? descripcion { get; set; }
        public int clienteId { get; set; }
    }
}