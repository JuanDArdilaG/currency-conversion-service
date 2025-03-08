export class FailedToFetchExchangeRateException extends Error {
  constructor(response: any) {
    super(`Failed to fetch exchange rate: ${JSON.stringify(response)}`);
    this.name = "FailedToFetchExchangeRateException";
  }
}
