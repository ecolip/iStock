/* eslint-disable consistent-return */
/* eslint-disable radix */
const today = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month < 10) {
    return `${year}-0${month}-${day}`;
  }
  return `${year}-${month}-${day}`;
};

const getPreMonth = (now) => {
  const date = new Date(now);
  const ds = new Date(date.setMonth(date.getMonth() - 1));
  const year = ds.getFullYear();
  const mon = ds.getMonth() + 1;
  const day = ds.getDate();
  const preMonthDate = `${year}-${mon < 10 ? (`0${mon}`) : mon}-${day < 10 ? (`0${day}`) : day}`;
  return preMonthDate;
};

const preYear = () => {
  const date = new Date();
  const year = date.getFullYear() - 1;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month < 10) {
    return `${year}-0${month}-${day}`;
  }
  return `${year}-${month}-${day}`;
};

const specifyDay = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  if (month < 10) {
    return `${year}-0${month}-${day}`;
  }
  return `${year}-${month}-${day}`;
};

const canvasDay = (date) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  return { year, month, day };
};

const preDay = (date) => {
  const dateObj = new Date(date);
  const time = dateObj.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const preTime = time - oneDay;
  dateObj.setTime(preTime);
  return specifyDay(dateObj);
};

const transferToDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const second = date.getMinutes();
  return `${year}-${month}-${day} ${hour}:${second}`;
};

function getDateDiff(dateTimeStamp) {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  // const halfamonth = day * 15;
  const month = day * 30;
  const now = new Date().getTime();
  const diffValue = now - dateTimeStamp;
  let result;
  if (diffValue < 0) { return; }
  const monthC = diffValue / month;
  const weekC = diffValue / (7 * day);
  const dayC = diffValue / day;
  const hourC = diffValue / hour;
  const minC = diffValue / minute;
  if (monthC >= 1) {
    result = `${parseInt(monthC)}月前`;
  } else if (weekC >= 1) {
    result = `${parseInt(weekC)}周前`;
  } else if (dayC >= 1) {
    result = `${parseInt(dayC)}天前`;
  } else if (hourC >= 1) {
    result = `${parseInt(hourC)}小時前`;
  } else if (minC >= 1) {
    result = `${parseInt(minC)}分鐘前`;
  } else { result = '剛剛'; }
  return result;
}

const handelColor = (props) => {
  if (props.green) {
    return '#49AC8E';
  }
  if (props.red) {
    return '#F6465D';
  }
  return '#EAECEF';
};

const formatPrice = (price) => String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export {
  today,
  getPreMonth,
  preYear,
  preDay,
  transferToDate,
  getDateDiff,
  canvasDay,
  handelColor,
  formatPrice,
};
