import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loading from '../Loading';
import CanvasJSReact from '../../utils/canvasjs-3.6.6/canvasjs.react';
import { canvasDay, formatPrice } from '../../utils/formatDate';
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
  width: ${(props) => (props.t1 ? '35px' : '70px')};
  @media (min-width: 768px) {
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
 @media (min-width: 768px) {
    width: 100px;
  }
`;
const ItemDate = styled.div`
  @media (min-width: 768px) {
    width: 100px;
  }
`;
const ItemNum = styled.div`
  @media (min-width: 768px) {
    width: 100px;
  }
`;

function MonthRevenue({ list }) {
  const [option, setOption] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [stockName, setStockName] = useState('');
  const { CanvasJSChart } = CanvasJSReact;
  // const CanvasJS = CanvasJSReact.CanvasJS;

  const handleOption = (id, name, data) => {
    const options = {
      animationEnabled: true,
      // animationDuration: 2000,
      exportEnabled: true,
      theme: 'dark1',
      backgroundColor: '#181A20',
      title: {
        text: `${id} ${name}`,
      },
      toolbar: {
        itemBackgroundColor: '#2D3137',
        itemBackgroundColorOnHover: '#2D3137',
        fontColor: '#EAECEF',
        fontColorOnHover: '#FCD535',
      },
      axisX: {
        valueFormatString: 'MMM YYYY',
        labelAngle: -20,
      },
      axisY: {
        title: '營收(千元)',
        prefix: '$',
      },
      data: [{
        type: 'line',
        yValueFormatString: '$#,###',
        xValueFormatString: 'MMM YYYY',
        nullDataLineDashType: 'dot',
        // lineColor: 'red',
        // markerColor: 'red',
        // toolTipContent: '{x}: $ {y}',
        dataPoints: data,
      }],
    };
    console.log('設定option', options);
    setOption(options);
    setIsLoaded(false);
  };

  const handleData = async () => {
    console.log('設定新revenue');
    const name = await compareStockId2(list[0].stock_id);
    if (!name) return;
    setIsLoaded(true);
    const output = list.map((item) => {
      const { year, month, day } = canvasDay(item.date);
      const newItem = {
        x: new Date(year, month, day),
        y: item.revenue / 1000,
      };
      return newItem;
    });
    console.log('data為', output);
    setStockName(name);
    handleOption(list[0].stock_id, name, output);
  };

  const renderTable = () => {
    const output = list.map((item) => (
      <Item key={item.date}>
        <ItemText>{item.stock_id}</ItemText>
        <ItemText>{stockName}</ItemText>
        <ItemDate>{item.date}</ItemDate>
        <ItemNum>${formatPrice(item.revenue / 1000)}</ItemNum>
      </Item>
    ));
    return output;
  };

  useEffect(() => {
    console.log('重設新data');
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
                  <Title t1>代碼</Title>
                  <Title t1>名稱</Title>
                  <Title>年度</Title>
                  <Title>月營收(千元)</Title>
                </Titles>
                {renderTable()}
              </Table>
            </TableContainer>
          </>
        ) : <LoadContainer><Loading /></LoadContainer>}
    </Div>
  );
}

MonthRevenue.propTypes = {
  // list: PropTypes.shape([]).isRequired,
  list: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
};

export default MonthRevenue;
