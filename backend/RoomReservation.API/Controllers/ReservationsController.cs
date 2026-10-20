using Microsoft.AspNetCore.Mvc;

namespace RoomReservation.API.Controllers;

[ApiController]
[Route("api/reservations")]
public class ReservationsController (IReservationService reservations) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ReservationDTO>>> Get([FromQuery] ReservationFilterDTO? filter = null)
    {
        return Ok(await reservations.GetAllAsync(filter));
    }

    [HttpPost]
    public async Task<ActionResult<ReservationDTO>> Create(CreateReservationDTO createReservationDTO)
    {
        var (reservation, error) = await reservations.CreateAsync(createReservationDTO);
        if (error != null)
        {
            return BadRequest(error);
        }
        return Created("/api/reservations", reservation);
    }

    [HttpPatch("{id}/cancel")]
    public async Task<ActionResult> Cancel([FromRoute] int id)
    {
        var canceled = await reservations.CancelAsync(id);
        return canceled ? Ok() : NotFound();
    }

    [HttpPatch("{id}/complete")]
    public async Task<ActionResult> Complete([FromRoute] int id)
    {
        var completed = await reservations.CompleteAsync(id);
        return completed ? Ok() : NotFound();
    }
}