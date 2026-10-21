using Microsoft.AspNetCore.Mvc;

namespace RoomReservation.API.Controllers;

[ApiController]
[Route("api/rooms")]
public class RoomsController (IRoomService rooms) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<RoomDTO>>> Get([FromQuery] RoomFilterDTO? filter = null)
    {
        return Ok(await rooms.GetAllAsync(filter));
    }
}