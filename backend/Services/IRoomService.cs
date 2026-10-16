public interface IRoomService
{
    Task<List<RoomDTO>> GetAllAsync();
}