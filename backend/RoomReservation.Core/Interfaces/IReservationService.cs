public interface IReservationService
{
    Task<List<ReservationDTO>> GetAllAsync(ReservationFilterDTO? filter = null);
    Task<(ReservationDTO? Reservation, string? Error)> CreateAsync(CreateReservationDTO dto);
    Task<bool> CancelAsync(int reservationId);
    Task<bool> CompleteAsync(int reservationId);
}