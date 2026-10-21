namespace RoomReservation.Core.Interfaces;

public interface IRoomService
{
    Task<List<RoomDTO>> GetAllAsync(RoomFilterDTO? filter = null);
}