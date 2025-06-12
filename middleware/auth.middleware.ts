import { Request, Response, NextFunction } from 'express';
import { UserEntity } from '../entities/user.entity';

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  console.log('User auth status:', req.isAuthenticated());

  let user = req.user as UserEntity

  console.log('my user is', user);
  

  if (req.isAuthenticated() && user.id) {
    return next();
  } else {
    res.status(401).json({
      message: 'Unauthorized user please logged to perform the action',
    });
  }
};
