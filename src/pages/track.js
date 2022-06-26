import { useState, useEffect, useRef } from 'react';
import { SearchOutline } from '@styled-icons/evaicons-outline';
import useEventListener from '@use-it/event-listener';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import CanvasJSReact from '../utils/canvasjs/canvasjs.stock.react';
import api from '../utils/api';
import { today, preYear } from '../utils/formatDate';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
`;
const SearchGroup = styled.div`
  margin: ${(props) => (props.load ? '40px auto 35vh' : '110px auto 10px')};

  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 300px;
  padding: 0 13px;
  border: 2px solid #424242;
  border-radius: 5px;
  
  @media (min-width: 996px) {
    margin: ${(props) => (props.load ? '100px auto 30vh' : '30px auto 10px')};
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

function Track() {
  const [stockId, setStockId] = useState('');
  const [isLoaded, setIsLoaded] = useState(true);
  const [option, setOption] = useState(null);
  const [containerProp, setContainerProp] = useState(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const initStockId = useRef('TAIEX');
  const { CanvasJSStockChart } = CanvasJSReact;

  const definedOptions = (dps1, dps2, dps3, id) => {
    const options = {
      exportEnabled: true,
      exportFileName: 'StockChart',
      theme: 'light2', // "light1", "dark1", "dark2"
      // backgroundColor: '#F5F5F5',
      title: {
        text: `${id} 走勢圖`,
        fontSize: 30,
        fontColor: '#4A4A4A',
      },
      subtitles: [{
        text: '價/指數-成交量-成交總金額(千萬)',
        fontSize: 18,
        fontColor: '#4A4A4A',
      }],
      // legend: {
      //   horizontalAlign: 'right', // "center" , "right"
      //   verticalAlign: 'center', // "top" , "bottom"
      //   fontSize: 15,
      // },
      charts: [{
        axisX: {
          lineThickness: 5,
          tickLength: 0,
          scaleBreaks: {
            type: '',
            fillOpacity: 1,
            customBreaks: [{
              startValue: 0,
              endValue: today(),
            }],
          },
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
          // color: 'transparent',
          // legendText: 'Volume',
          // showInLegend: true,
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
          // title: 'Volume',
          // prefix: '$',
          tickLength: 0,
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
      rangeSelector: {
        height: 50,
        buttonStyle: {
          // backgroundColor: '#eccaa0',
          // backgroundColorOnHover: '#2B3139',
          // backgroundColorOnSelect: '#2B3139',
          // borderColor: '#2B3139',
          borderThickness: 1,
          labelFontColor: '#4F4F4F',
          // labelFontSize: 16,
          // labelFontFamily: 'Noto Sans TC',
          // labelFontWeight: 'bolder',
        },
        inputFields: {
          valueFormatString: 'YYYY-MM-DD',
          // borderColor: '#2B3139',
          // fontFamily: 'Noto Sans TC',
          // fontSize: 16,
          // fontColor: '#4F4F4F',
          // fontWeight: 'bold',
        },
      },
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
        ? <Loading />
        : <CanvasJSStockChart containerProps={containerProp} options={option} ref={canvasRef} />}
      <Footer />
    </Container>
  );
}

export default Track;
