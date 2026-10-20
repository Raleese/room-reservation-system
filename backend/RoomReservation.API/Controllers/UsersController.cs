using Microsoft.AspNetCore.Mvc;

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