import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// Define the type for the form state
interface SignInForm {
  username: string;
  password: string;
}

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState<SignInForm>({
    username: 'testuser2',
    password: 'testpassword',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSignIn = useCallback(async () => {
    const { username, password } = formValues;
    try {
      // Make API call to login
      const response = await axios.post('http://localhost:3000/api/users/login', {
        username,
        password,
      });
      const { token } = response.data;
      const decoded: any = jwtDecode(token);
      Cookies.set('token', token, { expires: 7 });
      Cookies.set('username', decoded.username, { expires: 7 });
      router.push('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  }, [formValues, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="username"
        label="username address"
        value={formValues.username}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Password"
        value={formValues.password}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Display error message if validation fails */}
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography>
      </Box>

      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box>
    </>
  );
}
