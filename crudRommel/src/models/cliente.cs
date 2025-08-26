namespace crudRommel.src.models
{
    public class Cliente
    {
        public int clienteId { get; set; }
        public required string nombreCliente { get; set; }
        public required string correo { get; set; }
    }
}
