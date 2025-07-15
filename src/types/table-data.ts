interface ApiResponse {
  results: any[];
  info: {
    seed: string;
    results: number;
    page: number;
    version: string;
  };
}
