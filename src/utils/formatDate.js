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

export { today, preYear };
