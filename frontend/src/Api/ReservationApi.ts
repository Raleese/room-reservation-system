import type { Reservation, CreateReservation, ReservationFilter } from '../Types/reservation_types.ts';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const RESERVATIONS_ENDPOINT = '/reservations';

// Helper function to make API requests and handle JSON responses
async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(BASE_URL + path, init);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || `Request failed: ${response.status} ${response.statusText}`);
  }

  // Some endpoints return 204 so there is no content to parse as JSON
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return Promise.resolve(undefined as unknown as T);
  }

  return response.json() as Promise<T>;
}

// Get all users
export function getReservations(filters?: ReservationFilter): Promise<Reservation[]> {
  const query = new URLSearchParams();

  if (filters?.roomId != null) {
    query.set('RoomId', filters.roomId.toString());
  }

  if (filters?.organizerId != null) {
    query.set('OrganizerId', filters.organizerId.toString());
  }

  if (filters?.status != null) {
    query.set('Status', filters.status);
  }

  // ISO 8601 - date time string format
  if (filters?.startDate != null) {
    query.set('StartDate', filters.startDate.toISOString());
  }

  if (filters?.endDate != null) {
    query.set('EndDate', filters.endDate.toISOString());
  }

  const queryString = query.toString();
  return requestJson<Reservation[]>(
    `${RESERVATIONS_ENDPOINT}${queryString ? `?${queryString}` : ''}`,
  );
}

export function createReservation(reservation: CreateReservation): Promise<Reservation> {
  return requestJson<Reservation>(
    RESERVATIONS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation)      
    }
  )
}