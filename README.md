# Room Reservation System

A web application for managing meeting rooms and reservations in an office. It is built with React and TypeScript on the frontend and ASP.NET Core with Entity Framework Core on the backend. Unit tests were done with xUnit.

## Screenshots

<img width="1914" height="1056" alt="image" src="https://github.com/user-attachments/assets/d11362e7-bb68-4789-81be-422ec5f8e065" />
<img width="1914" height="1047" alt="image" src="https://github.com/user-attachments/assets/13def14d-c8d7-4ef9-8858-5df80eb12f8a" />
<img width="1916" height="1064" alt="image" src="https://github.com/user-attachments/assets/e7c48a16-3062-4291-b295-147559f917b2" />

## Features

- Browse rooms and filter them by minimum capacity, equipment, and floor.
- View users and the number of their active reservations.
- Create and filter reservations by room, organizer, status, and date range.
- Cancel a booked reservation or end a meeting after it has started. Ending a meeting marks it completed and records the current end time.
- Configure maximum reservation duration and booking horizon in `backend/RoomReservation.API/appsettings.json`.
- View the calendar of a single room.
- Export a room's schedule info as a PDF file.
- Seed sample rooms, users, and reservations when the backend starts.
- Once the meeting ends, the status automatically changes from "Booked" to "Completed".
- Unit tests for reservation, room, User services and the reservation validator.

Reservation validation runs in the backend. The default rules are:

- R1: A single reservation cannot last longer than 7 days. Exactly 7 days is allowed.
- R2: A room cannot have two active reservations. Cancelled and completed reservations do not block the room.
- R3: The same user cannot organize two meetings that overlap in date, even in different rooms.
- R4: Start must in the future.
- R5: Number of attendees must not exceed the room capacity.
- R6: A reservation cannot start more than 90 days in the future.
- R7: Inactive rooms cannot be booked.

The duration and booking horizon values are configurable in `backend/RoomReservation.API/appsettings.json` using `Booking:MaxDurationDays` and `Booking:MaxHorizonDays`.

### Reservation error codes

When reservation creation fails validation, the API returns an error code and message:

| Code | Rule |
| --- | --- |
| `MEETING_TITLE_REQUIRED` | Meeting title must not be empty or whitespace. |
| `ATTENDEE_COUNT_INVALID` | Number of attendees must be greater than zero. |
| `R4_INVALID_TIME_RANGE` | End date must be after start date. |
| `R4_START_NOT_FUTURE` | Reservation must start in the future. |
| `R1_MAX_DURATION_EXCEEDED` | Reservation duration must not exceed the configured maximum (`Booking:MaxDurationDays`). |
| `R6_BOOKING_HORIZON_EXCEEDED` | Reservation start must be within the configured booking horizon (`Booking:MaxHorizonDays`). |
| `ROOM_NOT_FOUND` | Requested room does not exist. |
| `R7_ROOM_INACTIVE` | Inactive rooms cannot be booked. |
| `R5_ROOM_CAPACITY_EXCEEDED` | Attendee count must not exceed room capacity. |
| `ORGANIZER_NOT_FOUND` | Requested organizer does not exist. |
| `R2_ROOM_BOOKING_OVERLAP` | Room already has a booked reservation overlapping this time. Cancelled and completed reservations do not block a booking. |
| `R3_ORGANIZER_BOOKING_OVERLAP` | Organizer already has a booked reservation overlapping this time, including in another room. |
| `RESOURCE_NOT_FOUND` | Room or organizer could not be found while creating the reservation. |

## Requirements

- .NET 10 SDK
- Node.js and npm

## Run locally

Open two terminals from the repository root.

Start the backend:

```bash
cd backend
dotnet run --project RoomReservation.API/RoomReservation.API.csproj
```

The API listens at `http://localhost:5055`.

Configure and start the frontend:

Rename the `frontend/.env.example` file to `.env.development` and change your API URL if needed.

Then:

```bash
cd frontend
npm install
npm run dev
```

## Run unit tests

```bash
cd backend
dotnet test
```

## Project structure

```text
backend/
  RoomReservation.API/           ASP.NET Core controllers and application setup
  RoomReservation.Core/          DTOs, interfaces, business services, validation
  RoomReservation.Domain/        Entities and enums
  RoomReservation.Infrastructure/ EF Core context and sample data seeder
  RoomReservation.Tests/
frontend/
  src/Api/                        HTTP API clients
  src/Components/                 Forms, filters, and tables
  src/Pages/                      Rooms, users, and reservations pages
```

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/rooms` | List rooms; supports capacity, equipment, and floor filters |
| `GET` | `/api/users` | List users and their active reservation counts |
| `GET` | `/api/reservations` | List reservations; supports room, organizer, status, and date filters |
| `POST` | `/api/reservations` | Create a reservation |
| `PATCH` | `/api/reservations/{id}/cancel` | Cancel a booked reservation |
| `PATCH` | `/api/reservations/{id}/complete` | Complete a booked reservation after it has started |
| `GET` | `/api/exports/rooms/{roomId}/pdf` | Download a room's reservation usage report as a PDF |

## Implementation notes

- The backend uses an EF Core in-memory database. Seed data is recreated when the backend process starts.
- DTO mapping is handled by the backend mapper.
