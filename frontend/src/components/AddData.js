import React, { useState } from 'react';

function AddData() {
  const [data, setData] = useState({ nome: '', categoria: '' });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica para salvar os dados no banco (ex: MongoDB)
    console.log('Dados enviados:', data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome:</label>
        <input
          type="text"
          name="nome"
          value={data.nome}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Categoria:</label>
        <input
          type="text"
          name="categoria"
          value={data.categoria}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Adicionar</button>
    </form>
  );
}

export default AddData;
