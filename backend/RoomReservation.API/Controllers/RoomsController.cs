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

    [HttpPost]
    public async Task<ActionResult<RoomDTO>> Create(CreateRoomDTO createRoomDTO)
    {
        try
        {
            var createdRoom = await rooms.CreateAsync(createRoomDTO);
            if (createdRoom is null)
            {
                return Conflict("A room with this name already exists.");
            }

            return Created("/api/rooms", createdRoom);
        }
        catch (ArgumentException error)
        {
            return BadRequest(error.Message);
        }
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var deleted = await rooms.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}