public interface IRoomService
{
    Task<List<RoomDTO>> GetAllAsync(RoomFilterDTO? filter = null);
    Task<RoomDTO?> CreateAsync(CreateRoomDTO room);
}