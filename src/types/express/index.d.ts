import express from 'express';

interface IDecode {
  userId?: number;
  email: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: Record<IDecode>;
    }
  }
}
