using Microsoft.AspNetCore.Mvc;

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
}