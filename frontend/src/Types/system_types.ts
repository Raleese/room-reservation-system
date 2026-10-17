export type Room = {
    id: number,
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