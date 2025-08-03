export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: string | Date;
}

export interface ApiResponse {
  results: UserData[];
  nextPage: number | null;
  info: {
    page: number;
  };
}
