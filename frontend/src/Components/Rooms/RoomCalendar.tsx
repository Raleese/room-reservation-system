import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/react/daygrid';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import classicThemePlugin from '@fullcalendar/react/themes/classic';
import '@fullcalendar/react/skeleton.css';
import '@fullcalendar/react/themes/classic/theme.css';
import './RoomCalendar.css';
import { getReservations } from '../../Api/ReservationApi.ts';
import type { RoomCalendarProps } from '../../Types/room_types.ts';

function RoomCalendar({ roomId }: RoomCalendarProps) {
    return (
        <FullCalendar
            className="room-calendar"
            plugins={[timeGridPlugin, dayGridPlugin, classicThemePlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridDay,timeGridWeek',
            }}
            height="auto"
            allDaySlot={false}
            events={(info, success, failure) => {
                getReservations({
                    roomId,
                    organizerId: null,
                    status: null,
                    startDate: new Date(info.startStr),
                    endDate: new Date(info.endStr),
                })
                    .then((data) =>
                        success(
                            data
                                .filter((r) => r.status !== 'Cancelled')
                                .map((r) => ({
                                    id: String(r.id),
                                    title: `${r.meetingTitle}`,
                                    start: r.startDate,
                                    end: r.endDate,
                                    color: r.status === 'Completed' ? '#9e9e9e' : '#8f4f3e',
                                })),
                        ),
                    )
                    .catch((e) => failure(e));
            }}
        />
    );
}

export default RoomCalendar;
