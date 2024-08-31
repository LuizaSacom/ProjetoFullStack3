import React, { useState } from 'react';

function DataList() {
  const [dataList, setDataList] = useState([]);

  // Aqui você carregaria os dados do banco de dados e os definiria em `dataList`
  // useEffect(() => {
  //   // Lógica para carregar os dados do banco
  // }, []);

  return (
    <div>
      <h3>Dados Cadastrados</h3>
      <ul>
        {dataList.map((data, index) => (
          <li key={index}>
            {data.nome} - {data.categoria}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataList;
