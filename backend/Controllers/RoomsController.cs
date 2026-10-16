using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/rooms")]
public class RoomsController (IRoomService rooms) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<RoomDTO>>> Get()
    {
        return Ok(await rooms.GetAllAsync());
    }

}