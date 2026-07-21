import type { ApiResponse, Page } from "@/contracts";

export function ok<T>(data: T, message = "OK"): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function pageOf<T>(content: T[]): Page<T> {
  return {
    totalElements: content.length,
    totalPages: 1,
    size: content.length,
    content,
    number: 0,
    first: true,
    last: true,
    numberOfElements: content.length,
    empty: content.length === 0,
    pageable: {
      offset: 0,
      paged: true,
      pageNumber: 0,
      pageSize: content.length,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
      },
      unpaged: false,
    },
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
  };
}
