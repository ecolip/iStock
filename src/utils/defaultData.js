const transferRedirectKey = (key) => {
  switch (key) {
    case 'Automobile':
      return '';
    case 'BiotechnologyMedicalCare':
      return '';
    case 'BuildingMaterialConstruction':
      return '';
    case 'Cement':
      return '';
    default:
      break;
  }
};
export const dataDay = [
  {
    stock_id: '6770',
    stock_name: '力積電',
    close: 101.96,
    spread: 1.04,
  },
  {
    stock_id: '6771',
    stock_name: '力積電',
    close: 101.96,
    spread: -1.04,
  },
];

export { transferRedirectKey };
