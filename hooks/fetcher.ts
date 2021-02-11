const fetcher = (input: RequestInfo, init?: RequestInit): Promise<any> =>
  fetch(input, init).then((res) => res.json());
export default fetcher;
