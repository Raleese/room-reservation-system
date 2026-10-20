namespace RoomReservation.Core.Interfaces;

public interface IReservationService
{
    Task<List<ReservationDTO>> GetAllAsync(ReservationFilterDTO? filter = null);
    Task<(ReservationDTO? Reservation, ApiErrorDTO? Error)> CreateAsync(CreateReservationDTO dto);
    Task<bool> CancelAsync(int reservationId);
    Task<bool> CompleteAsync(int reservationId);
}
