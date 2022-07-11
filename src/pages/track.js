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
// const SearchGroup = styled.div`
//   margin: ${(props) => (props.load ? '40px auto 35vh' : '110px auto 10px')};

//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   width: 300px;
//   padding: 0 13px;
//   border: 2px solid #424242;
//   border-radius: 5px;

//   @media (min-width: 996px) {
//     margin: ${(props) => (props.load ? '120px auto 30vh' : '120px auto 10px')};
//   }
// `;
// const Input = styled.input`
//   width: 70%;
//   height: 35px;
//   border: none;
//   border-radius: 5px;
//   outline: none;
//   font-size: 20px;
//   color: #424242;
//   ::placeholder {
//     color: #ccc;
//   }
//   ::-webkit-input-placeholder {
//     color: #ccc;
//   }
//   :-ms-input-placeholder {
//     color: #ccc;
//   }
//   ::-moz-placeholder {
//     color: #ccc;
//     opacity: 1;
//   }
// `;
// const SearchIcon = styled(SearchOutline)`
//   width: 28px;
//   height: 28px;
//   padding: 2px;
//   color: #4A4A4A;
//   cursor: pointer;
//   :hover {
//     width: 30px;
//     height: 30px;
//   }
// `;

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

  const definedOptions = (dps1, dps2, dps3, id) => {
    const options = {
      exportEnabled: true,
      exportFileName: 'StockChart',
      theme: 'dark2', // "light1", "dark1", "dark2"
      animationEnabled: true,
      animationDuration: 100,
      backgroundColor: '#181A20',
      // backgroundColor: '#F5F5F5',
      title: {
        text: `${id} 走勢圖`,
        fontSize: 22,
        fontColor: '#EAECEF',
        margin: 10,
        // padding: 4,
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
          backgroundColor: '#181A20',
          backgroundColorOnHover: '#666666',
          backgroundColorOnSelect: '#2B3139',
          borderColor: '#2B3139',
          borderThickness: 1,
          labelFontColor: '#EAECEF',
          labelFontSize: 16,
          labelFontFamily: 'Noto Sans TC',
          // labelFontWeight: 'bolder',
        },
        inputFields: {
          valueFormatString: 'YYYY-MM-DD',
          style: {
            backgroundColor: '#181A20',
            borderColor: '#2B3139',
            fontFamily: 'Noto Sans TC',
            fontSize: 16,
            fontColor: '#EAECEF',
            // fontWeight: 'bold',
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
      {/* <SearchGroup load={isLoaded}>
        <Input
          type="text"
          value={stockId}
          placeholder="請輸入股票代號"
          onChange={(e) => { setStockId(e.target.value); }}
        />
        <SearchIcon onClick={() => { updateView(); }} />
      </SearchGroup> */}
      {isLoaded
        ? <LoadContainer><Loading /></LoadContainer>
        : <CanvasJSStockChart containerProps={containerProp} options={option} ref={canvasRef} />}
      <Footer />
    </Container>
  );
}

export default Track;
