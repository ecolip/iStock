import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { SearchOutline } from '@styled-icons/evaicons-outline';
import useEventListener from '@use-it/event-listener';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Header from '../components/header';
import CanvasJSReact from '../utils/canvasjs/canvasjs.stock.react';
import api from '../utils/api';
import { today, preYear } from '../utils/formatDate';

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;
const SearchGroup = styled.div`
  margin: ${(props) => (props.load ? '40px auto 35vh' : '40px auto 20px')};

  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 300px;
  padding: 0 13px;
  border: 1px solid #424242;
  border-radius: 5px;
  @media (min-width: 768px) {
    width: 300px;
  }
`;
const Input = styled.input`
  width: 70%;
  height: 35px;
  border: none;
  border-radius: 5px;
  outline: none;
  font-size: 20px;
  color: #424242;
  ::placeholder {
    color: #ccc;
  }
  ::-webkit-input-placeholder {
    color: #ccc;
  }
  :-ms-input-placeholder {
    color: #ccc;
  }
  ::-moz-placeholder {
    color: #ccc;
    opacity: 1;
  }
`;
const SearchIcon = styled(SearchOutline)`
  width: 28px;
  height: 28px;
  padding: 2px;
  color: #4A4A4A;
  cursor: pointer;
  :hover {
    width: 30px;
    height: 30px;
  }
`;
const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// const data = [
//   {
//     Trading_Volume: 6085859,
//     Trading_money: 750214036,
//     Trading_turnover: 11536,
//     close: 123,
//     date: '2022-05-16',
//     max: 124,
//     min: 122.5,
//     open: 123.45,
//     spread: 0.65,
//     stock_id: '0050',
//   },
// ];

function Track() {
  const [stockId, setStockId] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);
  const [option, setOption] = useState(null);
  const [containerProp, setContainerProp] = useState(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const initStockId = useRef('TAIEX');
  const { CanvasJSStockChart } = CanvasJSReact;

  const getApiToken = () => {
    api.finMindLogin().then((res) => {
      window.localStorage.setItem('finToken', res.token);
    });
  };

  const definedOptions = (dps1, dps2, dps3, id) => {
    const options = {
      exportEnabled: true,
      exportFileName: 'StockChart',
      theme: 'light2',
      title: {
        text: `${id} 走勢圖`,
        fontSize: 33,
        fontColor: '#4A4A4A',
      },
      subtitles: [{
        text: '價/指數-成交量-成交總金額(千萬)',
        fontSize: 18,
        fontColor: '#4A4A4A',
      }],
      charts: [{
        axisX: {
          lineThickness: 5,
          tickLength: 0,
          labelFormatter() {
            return '';
          },
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
            labelFormatter() {
              return '';
            },
          },
        },
        axisY: {
          // title: 'price',
          // prefix: '$',
          tickLength: 0,
        },
        toolTip: {
          shared: true,
        },
        data: [{
          name: '價格(in TWD)/指數',
          yValueFormatString: '#,###.##',
          // yValueFormatString: '$#,###.##',
          axisYType: 'secondary',
          type: 'candlestick',
          // risingColor: 'red',
          // fallingColor: '#00B050',
          // color: 'black',
          dataPoints: dps1,
        }],
      }, {
        height: 100,
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
          },
        },
        axisY: {
          title: '成交量',
          // prefix: '$',
          tickLength: 0,
        },
        legend: {
          verticalAlign: 'top',
          horizontalAlign: 'left',
        },
        toolTip: {
          shared: true,
        },
        data: [{
          name: 'volume',
          yValueFormatString: '#,###.##',
          axisYType: 'secondary',
          type: 'column',
          dataPoints: dps2,
        }],
      }],
      navigator: {
        data: [{
          fontSize: 10,
          dataPoints: dps3,
        }],
        slider: {
          minimum: new Date(preYear()),
          maximum: new Date(today()),
        },
      },
    };
    const containerProps = {
      width: '90%',
      height: '70vh',
      margin: 'auto',
    };
    setOption(options);
    setContainerProp(containerProps);
    setIsLoaded(false);
    setStockId('');
  };

  const constructView = (data, id) => {
    const dps1 = [];
    const dps2 = [];
    const dps3 = [];
    for (let i = 0; i < data.length; i += 1) {
      dps1.push({
        x: new Date(data[i].date),
        y: [
          Number(data[i].open),
          Number(data[i].max),
          Number(data[i].min),
          Number(data[i].close),
        ],
      });
      dps2.push({ x: new Date(data[i].date), y: Number(data[i].Trading_Volume) });
      dps3.push({ x: new Date(data[i].date), y: Number(data[i].Trading_money) });
    }
    definedOptions(dps1, dps2, dps3, id);
  };

  const drawView = (type) => {
    const finToken = window.localStorage.getItem('finToken');
    setIsLoaded(true);
    // console.log('畫圖');
    if (type === 'init') {
      api.getHistoryPrice(finToken, initStockId.current, today()).then((res) => {
        if (res.data.length > 0) {
          // console.log('初始資料', res.data);
          constructView(res.data, '加權指數');
        }
      });
    } else {
      const stockIdTrim = stockId.trim();
      api.getHistoryPrice(finToken, stockIdTrim, today()).then((res) => {
        if (res.data.length > 0) {
          constructView(res.data, stockIdTrim);
          // console.log('新商品', res.data);
        } else {
          setIsLoaded(false);
          alert('查無資料，請重新輸入股票代碼！');
        }
      });
    }
  };

  const updateView = () => {
    drawView();
  };

  const initView = () => {
    drawView('init');
  };

  useEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      updateView();
    }
  });

  useEffect(() => {
    initView();
    getApiToken();
  }, []);

  return (
    <Container ref={containerRef}>
      <Header />
      <SearchGroup load={isLoaded}>
        <Input
          type="text"
          value={stockId}
          placeholder="請輸入股票代號"
          onChange={(e) => { setStockId(e.target.value); }}
        />
        <SearchIcon onClick={() => { updateView(); }} />
      </SearchGroup>
      {isLoaded
        ? (
          <ProgressContainer>
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          </ProgressContainer>
        )
        : <CanvasJSStockChart containerProps={containerProp} options={option} ref={canvasRef} />}
    </Container>
  );
}

export default Track;
