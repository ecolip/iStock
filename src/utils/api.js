const api = {
  hostname: 'https://openapi.twse.com.tw/v1',
  getDateInfo() {
    return fetch(`${this.hostname}/exchangeReport/STOCK_DAY_ALL`, {
      mode:'cors',
      headers: new Headers({
        host: 'https://openapi.twse.com.tw',
        // 'Content-Type': 'application/json',
      }),
      method: 'GET',
    }).then((response) => response.json());
  },
};

export default api;
