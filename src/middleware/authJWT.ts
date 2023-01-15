import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from '../config/settings';
import { User } from '../modules/user/entities/user.entity';

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let jwt = req.headers.authorization;

    if (!jwt) {
      return res.status(401).json({ message: 'Invalid token ' });
    }
    if (jwt.toLowerCase().startsWith('bearer')) {
      jwt = jwt.slice('bearer'.length).trim();
    }
    
    const decoded: any = verify(jwt, config.SECRET);
    const userFound = await User.findOne({
      where: {
        id: decoded.userId,
        email: decoded.email,
      },
    });

    if (!userFound) {
      res.status(401).json({ message: 'UNAUTHORIZED' });
    }
    req.user = decoded;

    next();
  } catch (error) {
    console.error(`[*]UNAUTHORIZED: ${error}`);
    return res.status(401).json({ message: 'UNAUTHORIZED!' });
  }
};
