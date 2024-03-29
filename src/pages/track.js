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
  min-height: 100vh;
  background-color: #0B0E11;
`;
const Div = styled.div`
  padding: 110px 0 10px;
`;
const LoadContainer = styled.div`
  padding-top: 200px;
`;
const SearchGroup = styled.div`
  border: ${(props) => (props.focus ? '1px solid #F0B90B' : '1px solid #848E9C')};
  display: flex;
  align-items: center;
  width: 190px;
  padding: 0 0 0 15px;
  margin: 0 auto;
  border-radius: 5px;
  @media (min-width: 576px) {
    width: 250px;
    height: 40px;
  }
`;
const Input = styled.input`
  border: ${(props) => (props.border ? '1px solid #848E9C' : 'none')};
  width:80%;
  height: 40px;
  font-size: 16px;
  border-radius: 5px;
  outline: none;
  color: white;
  background: transparent;
  ::placeholder {
    color: #848E9C;
  }
  ::-webkit-input-placeholder {
    color: #848E9C;
  }
  :-ms-input-placeholder {
    color: #848E9C;
  }
  ::-moz-placeholder {
    color: #848E9C;
    opacity: 1;
  }
`;
const SearchIcon = styled(SearchOutline)`
  width: 28px;
  height: 28px;
  padding: 2px;
  color: #F5C829;
  cursor: pointer;
  :hover {
    width: 30px;
    height: 30px;
  }
`;

function Track() {
  const [stockId, setStockId] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);
  const [option, setOption] = useState(null);
  const [containerProp, setContainerProp] = useState(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const initStockId = useRef('TAIEX');
  const { CanvasJSStockChart } = CanvasJSReact;

  const getClientWidth = () => {
    const element = document.getElementById('track-id');
    const { clientWidth } = element;
    if (clientWidth < 576) {
      return false;
    }
    return true;
  };

  const definedOptions = (dps1, dps2, dps3, id) => {
    const isWebWidth = getClientWidth();
    const options = {
      exportEnabled: true,
      exportFileName: 'StockChart',
      theme: 'dark2', // "light1", "dark1", "dark2"
      animationEnabled: true,
      animationDuration: 100,
      backgroundColor: '#181A20',
      title: {
        text: `${id} 走勢圖`,
        fontSize: 22,
        fontColor: '#EAECEF',
        margin: 10,
      },
      subtitles: [{
        text: '價/指數-成交量-成交總金額(千萬)',
        fontSize: 15,
        fontColor: '#EAECEF',
      }],
      toolbar: {
        itemBackgroundColor: '#2D3137',
        itemBackgroundColorOnHover: '#2D3137',
        fontColor: '#EAECEF',
        fontColorOnHover: '#FCD535',
      },
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
          valueFormatString: '$##.###.##.00',
          tickLength: 0,
        },
        toolTip: {
          shared: true,
        },
        data: [{
          name: '價格(in TWD)/指數',
          yValueFormatString: '#,###.##',
          // connectNullData: true,
          // yValueFormatString: '$#,###.##',
          axisYType: 'secondary',
          type: 'candlestick',
          // risingColor: '#F6465D',
          // fallingColor: '#49AC8E',
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
          scaleBreaks: {
            customBreaks: [{
              type: '',
            }],
          },
        },
        axisY: {
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
          backgroundColor: '#181A20',
          backgroundColorOnHover: '#666666',
          backgroundColorOnSelect: '#2B3139',
          borderColor: '#2B3139',
          borderThickness: 1,
          labelFontColor: '#EAECEF',
          labelFontSize: 16,
          labelFontFamily: 'Noto Sans TC',
        },
        inputFields: {
          valueFormatString: 'YYYY-MM-DD',
          enabled: isWebWidth,
          style: {
            backgroundColor: '#181A20',
            borderColor: '#2B3139',
            fontFamily: 'Noto Sans TC',
            fontSize: 16,
            fontColor: '#EAECEF',
          },
        },
      },
      navigator: {
        animationEnabled: true,
        data: [{
          fontSize: 10,
          dataPoints: dps3,
        }],
        slider: {
          maskColor: '#DEE2E6',
          handleBorderColor: '#0B0E11',
          handleColor: '#F5C829',
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
    setIsLoaded(true);
    if (type === 'init') {
      api.getHistoryPrice(initStockId.current, today()).then((res) => {
        if (res.data.length > 0) {
          constructView(res.data, '加權指數');
        }
      });
    } else {
      const stockIdTrim = stockId.trim();
      api.getHistoryPrice(stockIdTrim, today()).then((res) => {
        if (res.data.length > 0) {
          constructView(res.data, stockIdTrim);
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
    <Container id="track-id" ref={containerRef}>
      <Header />
      <Div>
        <SearchGroup focus={isFocus}>
          <Input
            type="text"
            value={stockId}
            placeholder="請輸入股票代號"
            onChange={(e) => { setStockId(e.target.value); }}
            onFocus={() => { setIsFocus(true); }}
            onBlur={() => { setIsFocus(false); }}
          />
          <SearchIcon onClick={() => { updateView(); }} />
        </SearchGroup>
      </Div>
      {isLoaded
        ? <LoadContainer><Loading /></LoadContainer>
        : <CanvasJSStockChart containerProps={containerProp} options={option} ref={canvasRef} />}
      <Footer />
    </Container>
  );
}

export default Track;
