import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loading from '../Loading';
import CanvasJSReact from '../../utils/canvasjs-3.6.6/canvasjs.react';
import { formatPrice } from '../../utils/formatDate';
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
  font-size: 14px;
  color: #848E9C;
`;
const Title = styled.div`
  width: ${(props) => (props.day ? '80px' : '40px')};
  display: ${(props) => (props.smDisplayNon ? 'none' : 'block')};
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

function Financial({ list }) {
  const [option, setOption] = useState(null);
  const [stockName, setStockName] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);
  const { CanvasJSChart } = CanvasJSReact;

  const handleOption = (id, name, data) => {
    const options = {
      animationEnabled: true,
      theme: 'dark1',
      backgroundColor: '#181A20',
      fillOpacity: 0.3,
      title: {
        text: `${id} ${name}`,
      },
      axisX: {
        valueFormatString: 'MMM YYYY',
        labelAngle: -20,
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
    setOption(options);
    setTimeout(() => {
      setIsLoaded(false);
    }, 1000);
  };

  const transferDate = (date) => {
    const splits3 = date.split('-', 3);
    const year = Math.round(splits3[0]);
    const month = Math.round(splits3[1]);
    const day = Math.round(splits3[2]);
    const monthIndex = month - 1;
    return { year, monthIndex, day };
  };

  const handleData = async () => {
    const name = await compareStockId2(list[0].stock_id);
    if (!name) return;
    const output = list.map((item) => {
      const { year, monthIndex, day } = transferDate(item.date);
      const newItem = {
        x: new Date(year, monthIndex, day),
        y: item.value / 1000,
      };
      return newItem;
    });
    setStockName(name);
    handleOption(list[0].stock_id, name, output);
  };

  const renderTable = () => {
    const output = list.map((item) => (
      <Item key={item.date}>
        <ItemText>{item.stock_id}</ItemText>
        <ItemText smDisplayNon>{stockName}</ItemText>
        <ItemText day>{item.date}</ItemText>
        <ItemText day>${formatPrice(item.value / 1000)}</ItemText>
      </Item>
    ));
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
                  <Title day>總額(千元)</Title>
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
  list: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
};

export default Financial;
