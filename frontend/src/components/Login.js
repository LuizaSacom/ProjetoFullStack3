import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import backgroundImage from '../assets/oTDlMNBH.jpg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.name); // Armazenar o nome do usuário
        navigate('/dashboard'); // Redireciona para o dashboard
      } else {
        setError(result.message || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao fazer login');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (response.ok) {
        setIsRegistering(false); // Voltar ao formulário de login
      } else {
        setError(result.message || 'Erro ao registrar usuário');
      }
    } catch (err) {
      setError('Erro ao registrar usuário');
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(5px)',
          padding: 4,
          borderRadius: 2,
          boxShadow: 2,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography component="h1" variant="h5" align="center" color="#3e2723">
          {isRegistering ? 'Registrar' : 'Login'}
        </Typography>
        <Box component="form" onSubmit={isRegistering ? handleRegister : handleLogin} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuário"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputLabelProps={{ style: { color: '#3e2723' } }}
            InputProps={{
              style: { color: '#3e2723', backgroundColor: '#FFFFFF' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#3e2723',
                },
                '&:hover fieldset': {
                  borderColor: '#3e2723',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3e2723',
                },
              },
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: '#3e2723' } }}
            InputProps={{
              style: { color: '#3e2723', backgroundColor: '#FFFFFF' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#3e2723',
                },
                '&:hover fieldset': {
                  borderColor: '#3e2723',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3e2723',
                },
              },
            }}
          />
          {error && <Typography color="error" align="center">{error}</Typography>}
          {!isRegistering && (
            <>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#602727',
                  '&:hover': {
                    backgroundColor: '#2c1b17',
                  },
                }}
              >
                Entrar
              </Button>
              <Link
                href="#"
                variant="body2"
                color="#602727"
                onClick={() => setIsRegistering(true)}
                sx={{ display: 'block', textAlign: 'center', mt: 1 }}
              >
                Não tem uma conta? Registre-se
              </Link>
            </>
          )}
          {isRegistering && (
            <>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#602727',
                  '&:hover': {
                    backgroundColor: '#2c1b17',
                  },
                }}
              >
                Registrar
              </Button>
              <Link
                href="#"
                variant="body2"
                color="#3e2723"
                onClick={() => setIsRegistering(false)}
                sx={{ display: 'block', textAlign: 'center', mt: 1 }}
              >
                Já tem uma conta? Faça login
              </Link>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
