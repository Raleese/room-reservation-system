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

export type  User = {
    id: number,
    firstName: string,
    lastName: string,
    activeReservations: number;
}

export type Equipment =
    | "Projector"
    | "TvScreen"
    | "VideoConferencing"
    | "Whiteboard"

export type FormAlertProps = {
    message: string;
};

export type RoomFormProps = {
    onRoomCreated: (room: Room) => void;
};

export type RoomFiltersProps = {
    onFiltersChange: (filters: RoomFilter) => void;
};

export type RoomsTableProps = {
    rooms: Room[];
    onRoomDeleted: (roomId: number) => void;
};

export type UsersTableProps = {
    users: User[];
}
