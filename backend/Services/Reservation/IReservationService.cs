public interface IReservationService
{
    Task<List<ReservationDTO>> GetAllAsync(ReservationFilterDTO? filter = null); 
}