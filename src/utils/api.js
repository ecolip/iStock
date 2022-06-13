const api = {
  hostname: 'https://api.finmindtrade.com/api/v4/data?',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyMi0wNi0xMyAyMToxMjowMCIsInVzZXJfaWQiOiJlY29saXAiLCJpcCI6IjExOC4xNjguNDEuMTg2In0.SlGERKyj3V45rngX5UqHGLvIoz-1PRGStCbHLvMvqlM',
  getDateInfo() {
    return fetch(`${this.hostname}dataset=TaiwanStockDividend`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      }),
    }).then((response) => response.json());
  },
};

export default api;
