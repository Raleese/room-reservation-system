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

    [HttpPost]
    public async Task<ActionResult<RoomDTO>> Create(CreateRoomDTO createRoomDTO)
    {
        if (string.IsNullOrWhiteSpace(createRoomDTO.Name))
        {
            return BadRequest("Room name is required.");
        }

        if (createRoomDTO.Capacity <= 0)
        {
            return BadRequest("Capacity must be greater than zero.");
        }

        if (createRoomDTO.Floor < 0)
        {
            return BadRequest("Floor cannot be negative.");
        }

        if (createRoomDTO.Equipment is null || createRoomDTO.Equipment.Length == 0)
        {
            return BadRequest("At least one equipment item must be selected.");
        }

        var createdRoom = await rooms.CreateAsync(createRoomDTO);
        if (createdRoom is null)
        {
            return Conflict("A room with this name already exists.");
        }

        return Created("/api/rooms", createdRoom);
    }

}