export type HttpResponseError = {
  message?: string;
  errors?: {
    [key: string]: string[];
  };
};

export type HttpResponse<T> = {
  data?: T;
};

export type HttpResponseWithPagination<T> = {
  data?: T;
  links?: {
    first?: string;
    last?: string;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    current_page?: number;
    from?: number;
    last_page?: number;
    links?: {
      url?: string | null;
      label?: string;
      page?: number;
      active?: boolean;
    }[];
    path?: string;
    per_page?: number;
    to?: number;
    total?: number;
  };
};
