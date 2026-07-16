export type ApiError = {
  message: string;
  field?: string;
  status: number;
};

export type Paged<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type Option<T extends string = string> = {
  value: T;
  label: string;
};