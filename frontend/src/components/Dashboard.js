import React, { useEffect, useState, useCallback } from 'react';
import { Box, TextField, Typography, List, ListItem, ListItemText, IconButton, CircularProgress, InputAdornment, Paper, Button } from '@mui/material';
import { Search, Delete, Add, ExitToApp } from '@mui/icons-material';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '', category: '' });
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/monster_hunter_data', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        setData(result);
        setFilteredData(result);
        setLoading(false);
      } else {
        setError('Erro ao buscar dados');
      }
    } catch (err) {
      setError('Erro ao buscar dados');
    }
  };

  const debouncedSearch = useCallback(debounce((term) => {
    const lowercasedTerm = term.toLowerCase();
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(lowercasedTerm) ||
      item.category.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredData(filtered);
  }, 300), [data]);

  useEffect(() => {
    fetchData();
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleAddItem = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/monster_hunter_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });
      const result = await response.json();
      if (response.ok) {
        setData([...data, result]);
        setFilteredData([...filteredData, result]);
        setNewItem({ name: '', category: '' });
      } else {
        setError(result.message || 'Erro ao adicionar item');
      }
    } catch (err) {
      setError('Erro ao adicionar item');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/monster_hunter_data/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setData(data.filter(item => item._id !== id));
        setFilteredData(filteredData.filter(item => item._id !== id));
      } else {
        setError('Erro ao deletar item');
      }
    } catch (err) {
      setError('Erro ao deletar item');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundImage: '../src/assets/oTDlMNBH.jpg', // Substitua com o URL da sua imagem
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#FFFFFF', // Overlay com cor marrom
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          padding: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            backgroundColor: '#602727', // Marrom com transparência
            padding: 2,
            borderRadius: 2,
            border: '1px solid #8c3a3a', // Cor de borda do marrom claro
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: '#FFFFFF' }}>
            {`Bem-vindo(a), ${username || 'Usuário'}`}
          </Typography>
          <IconButton onClick={handleLogout} color="default">
            <ExitToApp sx={{ color: '#FFFFFF' }} />
          </IconButton>
        </Box>

        <Paper
          elevation={3}
          sx={{
            padding: 3,
            marginBottom: 3,
            backgroundColor: '#F5F5F5', // Branco
            borderRadius: 2,
            border: '1px solid #8c3a3a', // Cor de borda
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: '#602727', mb: 2 }}>
            Adicionar Novo Item
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            label="Nome"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            sx={{ marginBottom: 1 }}
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Categoria"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddItem}
            sx={{ mt: 2, backgroundColor: '#602727', '&:hover': { backgroundColor: '#8c3a3a' } }}
          >
            <Add sx={{ mr: 1 }} />
            Adicionar
          </Button>
        </Paper>

        <TextField
          variant="outlined"
          fullWidth
          label="Buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search sx={{ color: '#602727' }} />
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 3 }}
        />

        {loading ? (
          <CircularProgress sx={{ alignSelf: 'center', color: '#602727' }} />
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : (
          <List>
            {filteredData.map(item => (
              <ListItem
                key={item._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 2,
                  backgroundColor: '#F5F5F5',
                  mb: 1,
                  boxShadow: 1,
                  border: '1px solid #8c3a3a', // Cor de borda
                  '&:hover': {
                    boxShadow: 3,
                    backgroundColor: '#e3d7d7', // Cor de fundo no hover
                  },
                }}
              >
                <ListItemText primary={`${item.name} - ${item.category}`} sx={{ color: '#602727' }} />
                <IconButton
                  color="error"
                  onClick={() => handleDeleteItem(item._id)}
                >
                  <Delete sx={{ color: '#602727' }} />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard;
