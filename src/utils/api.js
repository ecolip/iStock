const api = {
  hostname: 'https://api.finmindtrade.com/api/v4/data?',
  startDate: '2012-05-14',
  today: '2022-06-14',
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
  getTodayPrice(token, id) {
    return fetch(`${this.hostname}token=${token}&data_id=${id}&start_date=${this.today}&end_date=${this.today}&dataset=TaiwanStockPrice`)
      .then((response) => response.json());
  },
  getHistoryPrice(token, id) {
    return fetch(`${this.hostname}token=${token}&dataset=TaiwanStockPrice&data_id=${id}&start_date=${this.startDate}&end_date=${this.today}`)
      .then((response) => response.json());
  },
};

export default api;
