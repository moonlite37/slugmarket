'use client';
import { Box, Button, Paper, Stack, Typography, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from './actions';

const Login = () => {
	const [credentials, setCredentials] = useState({ email: '', password: '' });
	const [error, setError] = useState(false);
	const router = useRouter();

	const setEmail = (email: string) => {
		setCredentials({ email, password: credentials.password });
	};

	const setPassword = (password: string) => {
		setCredentials({ email: credentials.email, password });
	};

	const handleClick = () => {
		const doLogin = async (): Promise<void> => {
			const authenticated = await login(credentials);
			if (authenticated) {
				window.sessionStorage.setItem('name', authenticated.name);
				router.push('/');
			} else {
				setError(true);
			}
		};
		void doLogin();
	};

	return (
		<Box
			sx={{
				alignItems: 'center',
				background: '#f4f6f8',
				display: 'flex',
				justifyContent: 'center',
				minHeight: '100vh',
				p: 3,
			}}
		>
			<Paper
				elevation={0}
				sx={{
					backgroundColor: '#ffffff',
					border: '1px solid #d9e2e1',
					borderRadius: 2,
					boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)',
					maxWidth: 420,
					p: { xs: 3, sm: 4 },
					width: '100%',
				}}
			>
				<Stack spacing={3}>
					<Box>
						<Typography
							variant="h4"
							sx={{
								color: '#17202a',
								fontSize: { xs: '1.75rem', sm: '2rem' },
								fontWeight: 700,
								lineHeight: 1.15,
								mb: 0.75,
							}}
						>
							Slug Market Admin
						</Typography>
						<Typography sx={{ color: '#64748b' }}>
							Sign in to access the Slug Market dashboard.
						</Typography>
					</Box>

					<Stack spacing={2}>
						<TextField
							fullWidth
							name="email"
							placeholder="Email Address"
							value={credentials.email}
							onChange={(e) => { setEmail(e.target.value); }}
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											<MailOutlineRoundedIcon sx={{ color: '#64748b' }} />
										</InputAdornment>
									),
								},
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									backgroundColor: '#ffffff',
									borderRadius: 1.25,
								},
							}}
						/>
						<TextField
							fullWidth
							name="password"
							placeholder="Password"
							type="password"
							value={credentials.password}
							onChange={(e) => { setPassword(e.target.value); }}
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position="start">
											<LockOutlinedIcon sx={{ color: '#64748b' }} />
										</InputAdornment>
									),
								},
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									backgroundColor: '#ffffff',
									borderRadius: 1.25,
								},
							}}
						/>
					</Stack>

					{error && (
						<Typography color="error">Error logging in, please try again</Typography>
					)}

					<Button
						fullWidth
						type="submit"
						variant="contained"
						onClick={handleClick}
						endIcon={<ArrowForwardRoundedIcon />}
						sx={{
							backgroundColor: '#0f766e',
							borderRadius: 1.25,
							fontWeight: 700,
							py: 1.2,
							textTransform: 'none',
							'&:hover': {
								backgroundColor: '#115e59',
							},
						}}
					>
						Login
					</Button>
				</Stack>
			</Paper>
		</Box>
	);
};

export default Login;
