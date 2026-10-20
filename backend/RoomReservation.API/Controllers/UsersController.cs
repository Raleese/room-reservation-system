using Microsoft.AspNetCore.Mvc;

namespace RoomReservation.API.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController(IUserService users) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<UserDTO>>> Get()
    {
        return Ok(await users.GetAllAsync());
    }
}