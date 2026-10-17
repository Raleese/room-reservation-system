import type { Room, CreateRoom } from '../Types/system_types';

const BASE_URL = 'http://localhost:5055/api';

// Helper function to make API requests and handle JSON responses
async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(BASE_URL + path, init);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  // Some endpoints return 204 so there is no content to parse as JSON
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return Promise.resolve(undefined as unknown as T);
  }

  return response.json() as Promise<T>;
}

// Get all rooms
export function getRooms(): Promise<Room[]> {
    return requestJson<Room[]>('/rooms');
}

// Create a new room
export function createRoom(createRoomDTO: CreateRoom): Promise<Room> {
  return requestJson<Room>('/rooms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createRoomDTO)
  });
}