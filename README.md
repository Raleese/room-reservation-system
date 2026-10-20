# Room Reservation System

A web application for managing meeting rooms and reservations in an office. It is built with React and TypeScript on the frontend and ASP.NET Core with Entity Framework Core on the backend.

## Screenshots

## Features

- Browse rooms and filter them by minimum capacity, equipment, and floor.
- View users and the number of their active reservations.
- Create and filter reservations by room, organizer, status, and date range.
- Cancel a booked reservation or end a meeting early. Ending a meeting marks it completed and records the current end time.
- Configure maximum reservation duration and booking horizon in `backend/RoomReservation.API/appsettings.json`.
- Seed sample rooms, users, and reservations when the backend starts.

Reservation validation runs in the backend:

- A single reservation cannot last longer than 7 days. Exactly 7 days is allowed.
- A room cannot have two active reservations. Cancelled reservation does not block the room.
- The same user cannot organize two meetings that overlap in date, even in different rooms.
- Start must in the future.
- Number of attendees must not exceed the room capacity.
- A reservation cannot start more than 90 days in the future.
- Inactive rooms cannot be booked.

The duration and booking horizon values are, as mentioned earlier, configurable in `backend/RoomReservation.API/appsettings.json` using `Booking:MaxDurationDays` and `Booking:MaxHorizonDays`.

## Requirements

- .NET 10 SDK
- Node.js and npm

## Run locally

Open two terminals from the repository root.

Start the backend using its HTTP launch profile:

```bash
cd backend
dotnet run --project RoomReservation.API/RoomReservation.API.csproj --launch-profile http
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

## Project structure

```text
backend/
  RoomReservation.API/           ASP.NET Core controllers and application setup
  RoomReservation.Core/          DTOs, interfaces, business services, validation
  RoomReservation.Domain/        Entities and enums
  RoomReservation.Infrastructure/ EF Core context and sample data seeder
frontend/
  src/Api/                        HTTP API clients
  src/Components/                 Forms, filters, and tables
  src/Pages/                      Rooms, users, and reservations pages
```

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/rooms` | List rooms; supports capacity, equipment, and floor filters |
| `POST` | `/api/rooms` | Create a room |
| `DELETE` | `/api/rooms/{id}` | Delete a room |
| `GET` | `/api/users` | List users and their active reservation counts |
| `GET` | `/api/reservations` | List reservations; supports room, organizer, status, and date filters |
| `POST` | `/api/reservations` | Create a reservation |
| `PATCH` | `/api/reservations/{id}/cancel` | Cancel a booked reservation |
| `PATCH` | `/api/reservations/{id}/complete` | Complete a booked reservation |

## Implementation notes

- The backend uses an EF Core in-memory database. Seed data is recreated when the backend process starts.
- DTO mapping is currently done directly in the backend services.
