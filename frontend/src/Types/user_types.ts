export type User = {
    id: number,
    firstName: string,
    lastName: string,
    activeReservations: number
}

export type UsersTableProps = {
    users: User[];
}