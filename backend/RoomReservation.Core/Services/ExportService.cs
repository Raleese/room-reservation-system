using Microsoft.EntityFrameworkCore;

namespace RoomReservation.Core.Services;

public class ExportService(IAppDbContext db) : IExportService
{
    public async Task<(byte[]?, string)> ExportRoomUsageToPdfAsync(int roomId)
    {
        // Fetch room usage data from the database
        List<Reservation> roomUsage = await db.Reservations
            .Include(r => r.Room)
            .Where(r => r.Room.Id == roomId)
            .Include(r => r.Organizer)
            .ToListAsync();

        if (roomUsage == null || roomUsage.Count == 0)
        {
            return (null, string.Empty);
        }

        // Generate PDF content
        byte[] pdfContent = RoomPdfGenerator.GeneratePdf(roomUsage);
        string fileName = $"RoomUsage_{roomId}.pdf";


        return (pdfContent, fileName);
    }
}