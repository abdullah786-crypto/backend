import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserEntity } from '../entities/user.entity';
import appDataSource from '../datasource/app.datasource';
import bcrypt from 'bcryptjs';

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const repo = appDataSource.getRepository(UserEntity);
      const user = await repo.findOne({ where: { username } });
      if (!user) return done(null, false, { message: 'User nahi mila' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: 'Password galat hai' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const repo = appDataSource.getRepository(UserEntity);
    const user = await repo.findOne({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
