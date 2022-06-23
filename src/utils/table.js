const transferRedirectKey = (key) => {
  switch (key) {
    case 'Automobile':
      return '汽車工業';
    case 'BiotechnologyMedicalCare':
      return '生技醫療類';
    case 'BuildingMaterialConstruction':
      return '建材營造';
    case 'Cement':
      return '水泥工業';
    case 'Chemical':
      return '化學工業';
    case 'ChemicalBiotechnologyMedicalCare':
      return '化學生技醫療';
    case 'CommunicationsInternet':
      return '通信網路業';
    case 'ComputerPeripheralEquipment':
      return '電腦及週邊設備業';
    case 'ElectricMachinery':
      return '電機機械';
    case 'ElectricalCable':
      return '電器電纜';
    case 'Electronic':
      return '電子工業';
    case 'ElectronicPartsComponents':
      return '電子零組件業';
    case 'ElectronicProductsDistribution':
      return '電子通路業';
    case 'FinancialInsurance':
      return '金融保險';
    case 'Food':
      return '食品工業';
    case 'GlassCeramic':
      return '玻璃陶瓷';
    case 'InformationService':
      return '資訊服務業';
    case 'IronSteel':
      return '鋼鐵工業';
    case 'OilGasElectricity':
      return '油電燃氣業';
    case 'Optoelectronic':
      return '光電業';
    case 'Other':
      return '其他';
    case 'OtherElectronic':
      return '其他電子類';
    case 'PaperPulp':
      return '造紙工業';
    case 'Plastics':
      return '塑膠工業';
    case 'Rubber':
      return '橡膠工業';
    case 'Semiconductor':
      return '半導體業';
    case 'ShippingTransportation':
      return '航運業';
    case 'Textiles':
      return '紡織纖維';
    case 'Tourism':
      return '觀光事業';
    case 'TradingConsumersGoods':
      return '貿易百貨';
    default:
      return 'ETF';
  }
};

const data2 = [
  {
    Trading_Volume: 895005,
    Trading_money: 30643093,
    Trading_turnover: 730,
    close: 34.1,
    date: '2022-06-22',
    max: 34.5,
    min: 34.05,
    open: 34.3,
    spread: 0.05,
    stock_id: '2330',
    stock_name: '台積電',
  },
  {
    Trading_Volume: 895005,
    Trading_money: 30643093,
    Trading_turnover: 730,
    close: 34.1,
    date: '2022-06-22',
    max: 34.5,
    min: 34.05,
    open: 34.3,
    spread: 0.05,
    stock_id: '2521',
    stock_name: '廣達',
  },
];

export { transferRedirectKey, data2 };
