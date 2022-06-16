const api = {
  hostname: 'https://api.finmindtrade.com/api/v4/data?',
  startDate: '2017-05-15',
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
    return fetch(`${this.hostname}token=${token}&data_id=${id}&start_date=${today}&end_date=${today}&dataset=TaiwanStockPrice`)
      .then((response) => response.json());
  },
  getHistoryPrice(token, id, today) {
    return fetch(`${this.hostname}token=${token}&dataset=TaiwanStockPrice&data_id=${id}&start_date=${this.startDate}&end_date=${today}`)
      .then((response) => response.json());
  },
};

export default api;
