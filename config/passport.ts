
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import appDataSource from '../datasource/app.datasource';
import { UserEntity } from '../entities/user.entity';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const userRepo = appDataSource.getRepository(UserEntity);
      const user = await userRepo.findOne({ where: { username } });

      if (!user) return done(null, false, { message: 'Incorrect username.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return done(null, false, { message: 'Incorrect password.' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const userRepo = appDataSource.getRepository(UserEntity);
    const user = await userRepo.findOneBy({ id });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
