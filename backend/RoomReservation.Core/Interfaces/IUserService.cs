namespace RoomReservation.Core.Interfaces;

public interface IUserService
{
    Task<List<UserDTO>> GetAllAsync();
}