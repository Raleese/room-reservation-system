export type Room = {
    id: number,
    name: string,
    capacity: number,
    floor: number,
    equipment: Equipment[],
    isActive: boolean
}

export type CreateRoom = {
    name: string,
    capacity: number,
    floor: number,
    equipment: Equipment[],
    isActive: boolean
}

export type RoomFilter = {
    minimumCapacity: number | null,
    equipment: Equipment[],
    floor: number | null
}

export type Equipment =
    | "Projector"
    | "TvScreen"
    | "VideoConferencing"
    | "Whiteboard"

export type RoomFiltersProps = {
    onFiltersChange: (filters: RoomFilter) => void;
};

export type RoomsTableProps = {
    rooms: Room[];
    onRoomCalendarClicked: (roomId: number) => void;
    onRoomExportClicked: (roomId: number) => void;
};

export type RoomCalendarProps = {
    roomId: number;
};