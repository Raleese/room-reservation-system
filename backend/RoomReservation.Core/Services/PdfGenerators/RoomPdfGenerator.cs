using System.Globalization;
using QuestPDF.Helpers;
using QuestPDF.Fluent;

namespace RoomReservation.Core.Services.PdfGenerators;

public static class RoomPdfGenerator
{
    public static byte[] GeneratePdf(List<Reservation> reservations)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.PageColor(Colors.White);
                page.Margin(20);

                page.Header()
                    .Text("Room " + reservations.First().Room.Name + " Usage Report")
                    .FontSize(36)
                    .Bold()
                    .AlignCenter();

                page.Content()
                    .PaddingTop(25)
                    .Table(table =>
                    {
                        // Define columns
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(50); // ID
                            columns.RelativeColumn();   // Meeting Title
                            columns.RelativeColumn();   // User Name
                            columns.RelativeColumn();   // Start Time
                            columns.RelativeColumn();   // End Time
                            columns.RelativeColumn();   // Status
                        });

                        // Header row
                        table.Header(header =>
                        {
                            header.Cell().Text("ID");
                            header.Cell().Text("Title");
                            header.Cell().Text("Organizer");
                            header.Cell().Text("Start Time");
                            header.Cell().Text("End Time");
                            header.Cell().Text("Status");
                        });

                        // Data rows
                        foreach (var reservation in reservations)
                        {
                            table.Cell().Text(reservation.Id.ToString());
                            table.Cell().Text(reservation.MeetingTitle);
                            table.Cell().Text(reservation.Organizer.FirstName + " " + reservation.Organizer.LastName);
                            table.Cell().Text(reservation.StartDate.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture));
                            table.Cell().Text(reservation.EndDate.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture));
                            table.Cell().Text(reservation.Status.ToString());
                        }
                    });
            });
        }).GeneratePdf();

    }
}
