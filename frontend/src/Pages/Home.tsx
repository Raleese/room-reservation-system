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
					Text
				</Typography>
				<Typography variant="body1">
					Text
				</Typography>
				<Typography variant="body1">
					Text
				</Typography>
				<Typography variant="body1">
					Text
				</Typography>
			</Paper>
		</Box>
	);
}

export default Home