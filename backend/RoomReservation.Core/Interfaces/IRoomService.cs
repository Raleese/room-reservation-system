namespace RoomReservation.Core.Interfaces;

public interface IRoomService
{
    Task<List<RoomDTO>> GetAllAsync(RoomFilterDTO? filter = null);
    Task<RoomDTO?> CreateAsync(CreateRoomDTO room);
    Task<bool> DeleteAsync(int id);
}