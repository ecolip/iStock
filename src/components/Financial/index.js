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
const LoadContainer = styled.div`
  padding-top: 100px;
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

function Financial({ list }) {
  const [data, setData] = useState(null);
  const [stockId, setStockId] = useState('');
  const [stockName, setStockName] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);
  const CanvasJS = CanvasJSReact.CanvasJS;
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const options = {
    animationEnabled: true,
    theme: 'dark1',
    title: {
      text: `${stockId} ${stockName}`,
    },
    axisX: {
      valueFormatString: 'MMM YYYY',
    },
    axisY: {
      title: '綜合損益總額(千元)',
      prefix: '$',
    },
    data: [{
      yValueFormatString: '$#,###',
      xValueFormatString: 'MMM YYYY',
      type: 'spline',
      dataPoints: data,
    }],
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

  const transferDate = (date) => {
    const splits3 = date.split('-', 3);
    const year = Math.round(splits3[0]);
    const month = Math.round(splits3[1]);
    const day = Math.round(splits3[2]);
    const monthIndex = month - 1;
    return { year, monthIndex, day };
  };

  const handleData = () => {
    handleName(list[0].stock_id);
    const output = list.map((item) => {
      const { year, monthIndex, day } = transferDate(item.date);
      const newItem = {
        x: new Date(year, monthIndex, day),
        y: item.value / 1000,
      };
      return newItem;
    });
    setData(output);
    setIsLoaded(false);
  };

  const renderTable = () => {
    const output = list.map((item) => (
      <Item key={item.date}>
        <ItemText>{item.stock_id}</ItemText>
        <ItemText smDisplayNon>{stockName}</ItemText>
        <ItemText day>{item.date}</ItemText>
        <ItemText day>{item.value / 1000}</ItemText>
      </Item>
    ));
    return output;
  };

  useEffect(() => {
    handleData();
  }, [list]);

  return (
    <Div>
      {(!isLoaded && data)
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
                  <Title day>總額</Title>
                </Titles>
                {renderTable()}
              </Table>
            </TableContainer>
          </>
        ) : <LoadContainer><Loading /></LoadContainer>}
    </Div>
  );
}

Financial.propTypes = {
  // list: PropTypes.shape([]).isRequired,
  list: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
};

export default Financial;
