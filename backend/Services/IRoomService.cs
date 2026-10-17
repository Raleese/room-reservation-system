public interface IRoomService
{
    Task<List<RoomDTO>> GetAllAsync();
    Task<RoomDTO?> CreateAsync(CreateRoomDTO room);
}