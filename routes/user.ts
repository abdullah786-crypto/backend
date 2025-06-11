import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import appDataSource from '../datasource/app.datasource';
import { UserEntity } from '../entities/user.entity';

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

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) {
      return res.status(400).json({ message: 'Login failed', error: err });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(400).json({ message: 'Login error', error: err });
      }
      return res.status(200).json({
        message: 'Logged in successfully!',
        user: { id: user.id, username: user.username },
      });
    });
  })(req, res, next);
});


export default router;
