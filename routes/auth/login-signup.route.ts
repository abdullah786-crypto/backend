import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import appDataSource from '../../datasource/app.datasource';
import { UserEntity } from '../../entities/user.entity';

const router = Router();

router.post('/signup', async (req: any, res: any) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  }

  try {
    const userRepository = appDataSource.getRepository(UserEntity);
    const existingUser = await userRepository.findOne({ where: { username } });

    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepository.create({
      username,
      password: hashedPassword,
    });
    await userRepository.save(newUser);
    res
      .status(201)
      .json({ message: 'User registered successfully.', user: { ...newUser } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    console.log('Before login - Session:', req.session);
    console.log('Before login - User:', req.user);
    req.login(user, (err) => {
      if (err) return next(err);

      res.cookie('myapp.sid', req.sessionID, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      console.log('after login - Session:', req.session);
      console.log('after login - User:', req.user);

      return res.json({
        message: 'Login successful',
        user: { id: user.id, username: user.username },
      });
    });
  })(req, res, next);
});

router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      res.status(200).json({ message: 'failed to logout', error: err });
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        res.status(200).json({ message: 'failed to logout', error: err });

        return next(err);
      }
      res.status(200).json({ message: 'Logged out successfully.' });
    });
  });
});
router.get('/check-session', (req: Request, res: Response) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
    session: req.session,
  });
});
// router.get('/dashboard', (req: Request, res: Response) => {
//   if (req.isAuthenticated()) {
//     res.status(200).json({
//       message: `Welcome to the dashboard, ${
//         req.user ? (req.user as UserEntity).username : 'Guest'
//       }!`,
//     });
//   } else {
//     res.status(401).json({ message: 'Please log in to view this page.' });
//   }
// });

export default router;
