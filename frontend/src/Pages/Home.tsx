import { Box, Paper, Typography } from '@mui/material';

 function Home() {
	return (
		<Box
			component="main"
			sx={{
				minHeight: '70vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				px: 2,
			}}
		>
			<Paper
				elevation={3}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					textAlign: 'center',
					p: { xs: 3, sm: 4 },
					borderRadius: 3,
				}}
			>
				<Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 700}}>
					Room Reservation System
				</Typography>
				<Typography variant="body1">
					Browse rooms and filter them by minimum capacity, equipment, and floor
				</Typography>
				<Typography variant="body1">
					View users and the number of their active reservations
				</Typography>
				<Typography variant="body1">
					Create and filter reservations by room, organizer, status, and date range
				</Typography>
				<Typography variant="body1">
					Cancel a booked reservation or end a meeting after it has started. Ending a meeting marks it completed and records the current end time
				</Typography>
				<Typography variant="body1">
					Export a room's schedule info as a PDF file and view the room's calendar
				</Typography>
			</Paper>
		</Box>
	);
}

export default Home