import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loading from '../Loading';
import CanvasJSReact from '../../utils/canvasjs-3.6.6/canvasjs.react';
import { compareStockId2 } from '../../utils/firebase';

const Div = styled.div`
 margin: 0 -15px;
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
  padding: 0 15px 20px;
  font-size: 15px;
  color: #EAECEF;
`;
const Title = styled.div`
  width: ${(props) => (props.day ? '80px' : '40px')};
  display: ${(props) => (props.smDisplayNon ? 'none' : 'block')};

  font-size: 14px;
  color: #848E9C;
  @media (min-width: 768px) {
    display: ${(props) => (props.smDisplayNon ? 'block' : 'block')};
    width: 100px;
  }
`;
const TableContainer = styled.div`
`;
const Table = styled.div`
`;
const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  font-size: 13px;
  color: #EAECEF;
  border-radius: 3px;
  :hover {
    background-color: #2B3139;
  }
  @media (min-width: 768px) {
    font-size: 16px;
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
  const [option, setOption] = useState(null);
  const [stockName, setStockName] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);
  const { CanvasJSChart } = CanvasJSReact;

  const handleOption = (id, name, data) => {
    const options = {
      animationEnabled: true,
      theme: 'dark1',
      backgroundColor: '#181A20',
      title: {
        text: `${id} ${name}`,
      },
      axisY: {
        title: '股利(元)',
        prefix: '$',
        suffix: '元',
        includeZero: true,
      },
      toolbar: {
        fontColorOnHover: 'yellow',
      },
      data: [
        {
          type: 'column',
          bevelEnabled: true,
          yValueFormatString: '$#,###',
          xValueFormatString: 'MMM YYYY',
          color: '#4F81BC',
          dataPoints: data,
        },
      ],
    };
    setOption(options);
    setTimeout(() => {
      setIsLoaded(false);
    }, 1000);
  };

  const handleData = async () => {
    const name = await compareStockId2(list[0].stock_id);
    if (!name) return;
    const output = list.map((item) => {
      const value = item.CashEarningsDistribution;
      const num = Math.round(value * 100) / 100;
      const newItem = {
        label: `${item.year}`,
        y: num,
      };
      return newItem;
    });
    setStockName(name);
    handleOption(list[0].stock_id, name, output);
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
          <ItemText>$ {num}</ItemText>
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
      {!isLoaded
        ? (
          <>
            <CanvasJSChart options={option} />
            <TableContainer>
              <TableTitle>詳細數據</TableTitle>
              <Table>
                <Titles>
                  <Title>代碼</Title>
                  <Title smDisplayNon>名稱</Title>
                  <Title day>日期</Title>
                  <Title>股利(元)</Title>
                </Titles>
                {renderTable()}
              </Table>
            </TableContainer>
          </>
        ) : <LoadContainer><Loading /></LoadContainer>}
    </Div>
  );
}

Dividend.propTypes = {
  list: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
};

export default Dividend;
