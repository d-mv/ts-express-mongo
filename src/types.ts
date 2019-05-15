export interface apiResponseTYPE {
  status: boolean;
  message: string;
  payload?: any;
}

export interface IncUserCreateTYPE {
  query: { name: string; email: string; pass: string } | {};
  token: string | undefined;
}

export interface UserTYPE {
  name: string;
  email: string;
  pass: string;
}
export interface IncLoginTYPE {
  email: string;
  pass: string;
}

export interface NewUserTYPE {
  name: string;
  email: string;
  pass: string;
  token: string;
  dateAuth: Date;
}

export interface IncUserIdTYPE {
  id: string;
  token: string;
}
