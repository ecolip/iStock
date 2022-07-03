/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loading from '../Loading';
import CanvasJSReact from '../../utils/canvasjs-3.6.6/canvasjs.react';
import api from '../../utils/api';

const Div = styled.div`
`;
const TableTitle = styled.div`
  padding: 80px 0 20px;
  font-size: 25px;
  font-weight: bold;
  color: #EAECEF;
`;
const Titles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 20px;
`;
const Title = styled.div`
  width: ${(props) => (props.day ? '80px' : '40px')};
  display: ${(props) => (props.smDisplayNon ? 'none' : 'block')};

  font-size: 15px;
  color: #EAECEF;
  @media (min-width: 768px) {
    display: ${(props) => (props.smDisplayNon ? 'block' : 'block')};
    width: 100px;
    font-size: 22px;
  }
`;
const TableContainer = styled.div`
`;
const Table = styled.div`
  background-color: #181A20;
  border-radius: 8px;
  padding: 30px 10px;
  @media (min-width: 768px) {
    padding: 30px 50px;
  }
`;
const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  font-size: 13px;
  color: #EAECEF;
  border-radius: 3px;
  cursor: pointer;
  :hover {
    background-color: #0B0E11;
  }
  @media (min-width: 768px) {
    font-size: 18px;
  }
`;
const ItemText = styled.div`
  display: ${(props) => (props.smDisplayNon ? 'none' : 'block')};
  width: ${(props) => (props.day ? '80px' : '40px')};

 @media (min-width: 768px) {
    display: ${(props) => (props.smDisplayNon ? 'block' : 'block')};

    width: 100px;
  }
`;

function Dividend({ list }) {
  const [data, setData] = useState(null);
  const [stockId, setStockId] = useState('');
  const [stockName, setStockName] = useState('');
  const CanvasJS = CanvasJSReact.CanvasJS;
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const options = {
    // animationEnabled: true,
    // animationDuration: 1000,
    theme: 'dark1',
    title: {
      text: `${stockId} ${stockName}`,
    },
    axisY: {
      title: '股利 (元)',
      prefix: '$',
      includeZero: true,
    },
    toolbar: {
      fontColorOnHover: 'yellow',
    },
    data: [
      {
        type: 'column',
        dataPoints: data,
      },
    ],
  };

  const compareStockId = async (id) => {
    const token = window.localStorage.getItem('finToken');
    const res = await api.getStockList(token);
    const result = res.data;
    const items = result.filter((item) => item.stock_id === id);
    const item = items[0];
    if (item) {
      return item.stock_name;
    }
    return false;
  };

  const handleName = async (id) => {
    const name = await compareStockId(id);
    if (name) {
      setStockId(id);
      setStockName(name);
    }
  };

  const handleData = () => {
    handleName(list[0].stock_id);
    const output = list.map((item) => {
      const value = parseFloat(item.CashEarningsDistribution);
      const num = Math.round(value);
      const newItem = {
        label: `${item.year}`,
        y: num,
      };
      return newItem;
    });
    setData(output);
  };

  const renderTable = () => {
    const output = list.map((item) => {
      const value = parseFloat(item.CashEarningsDistribution);
      const num = Math.round(value);
      return (
        <Item key={item.date}>
          <ItemText>{item.stock_id}</ItemText>
          <ItemText smDisplayNon>{stockName}</ItemText>
          <ItemText day>{item.year}</ItemText>
          <ItemText>{num}</ItemText>
        </Item>
      );
    });
    return output;
  };

  useEffect(() => {
    handleData();
  }, [list]);

  return (
    <Div>
      {data
        ? (
          <>
            <CanvasJSChart options={options} />
            <TableContainer>
              <TableTitle>詳細數據</TableTitle>
              <Table>
                <Titles>
                  <Title>代碼</Title>
                  <Title smDisplayNon>名稱</Title>
                  <Title day>日期</Title>
                  <Title>股利</Title>
                </Titles>
                {renderTable()}
              </Table>
            </TableContainer>
          </>
        ) : <Loading />}
    </Div>
  );
}

Dividend.propTypes = {
  // list: PropTypes.shape([]).isRequired,
  list: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
};

export default Dividend;