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

export {
  today, preYear, preDay, transferToDate, getDateDiff,
};
