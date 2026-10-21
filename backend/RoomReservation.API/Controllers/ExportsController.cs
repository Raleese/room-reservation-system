using Microsoft.AspNetCore.Mvc;

namespace RoomReservation.API.Controllers;

[ApiController]
[Route("api/exports")]
public class ExportsController(IExportService export) : ControllerBase
{
    [HttpGet("rooms/{roomId}/pdf")]
    public async Task<ActionResult> ExportRoomUsageToPdf([FromRoute] int roomId)
    {
        byte[]? pdfContent = await export.ExportRoomUsageToPdfAsync(roomId);
        if (pdfContent == null)
        {
            return NotFound();
        }

        return File(pdfContent, "application/pdf");
    }
}