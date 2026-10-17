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