public interface IUserService
{
    Task<List<UserDTO>> GetAllAsync();
}