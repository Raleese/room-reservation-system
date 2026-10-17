import type { Room, CreateRoom } from '../Types/system_types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ROOMS_ENDPOINT = '/rooms';

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

// Get all rooms
export function getRooms(): Promise<Room[]> {
    return requestJson<Room[]>(ROOMS_ENDPOINT);
}

// Create a new room
export function createRoom(createRoomDTO: CreateRoom): Promise<Room> {
  return requestJson<Room>(ROOMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createRoomDTO)
  });
}