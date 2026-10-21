const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const EXPORTS_ENDPOINT = '/exports';
const ROOMS_ENDPOINT = '/rooms';

// Export room usage report as a PDF
export function exportRoomInfoToPdf(roomId: number): Promise<Blob> {
  return fetch(`${BASE_URL}${EXPORTS_ENDPOINT}${ROOMS_ENDPOINT}/${roomId}/pdf`, {
    method: 'GET'
  })
  // Blob - Binary Large Object. It represents raw data AKA the PDF here
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }

      return response.blob();
  });
}