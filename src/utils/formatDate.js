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
  const year = date.getFullYear() - 7;
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

export { today, preYear, preDay };
