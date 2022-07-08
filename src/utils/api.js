const api = {
  hostname: 'https://api.finmindtrade.com/api/v4/data?',
  startDate: '2017-07-01',
  dividendDate: '2000-07-01',
  finMindLogin() {
    const formData = new FormData();
    formData.append('user_id', process.env.REACT_APP_FINMIND_USER_ID);
    formData.append('password', process.env.REACT_APP_FINMIND_PASSWORD);
    const payload = new URLSearchParams(formData);
    return fetch('https://api.finmindtrade.com/api/v4/login', {
      body: payload,
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      method: 'POST',
    }).then((response) => response.json());
  },
  getTodayPrice(token, id, today) {
    return fetch(`${this.hostname}token=${token}&data_id=${id}&start_date=${today}&dataset=TaiwanStockPrice`)
      .then((response) => response.json());
  },
  getHistoryPrice(token, id, today) {
    return fetch(`${this.hostname}token=${token}&dataset=TaiwanStockPrice&data_id=${id}&start_date=${this.startDate}&end_date=${today}`)
      .then((response) => response.json());
  },
  getStockList(token) {
    return fetch(`${this.hostname}token=${token}&dataset=TaiwanStockInfo`)
      .then((response) => response.json());
  },
  getTodayNews(token, id, today, preDay) {
    return fetch(`${this.hostname}token=${token}&dataset=TaiwanStockNews&data_id=${id}&start_date=${preDay}&end_date=${today}`)
      .then((response) => response.json());
  },
  getMonthRevenue(token, id, today, preYear) {
    return fetch(`${this.hostname}token=${token}&dataset=TaiwanStockMonthRevenue&data_id=${id}&start_date=${preYear}&end_date=${today}`)
      .then((response) => response.json());
  },
  getHistoryDividend(token, id, today) {
    return fetch(`${this.hostname}token=${token}&dataset=TaiwanStockDividend&data_id=${id}&start_date=${this.dividendDate}&end_date=${today}`)
      .then((response) => response.json());
  },
  getHistoryHolding(token, id, today, preWeek) {
    return fetch(`${this.hostname}token=${token}&dataset=TaiwanStockShareholding&data_id=${id}&start_date=${preWeek}&end_date=${today}`)
      .then((response) => response.json());
  },
  getHistoryFinancial(token, id, today) {
    return fetch(`${this.hostname}token=${token}&dataset=TaiwanStockFinancialStatements&data_id=${id}&start_date=${this.startDate}&end_date=${today}`)
      .then((response) => response.json());
  },
  getLatAndLng(address) {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&language=zh-TW`)
      .then((response) => response.json());
  },
};

export default api;
