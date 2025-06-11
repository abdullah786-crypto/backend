import appDataSource from '../datasource/app.datasource';
import { UserEntity } from '../entities/user.entity';

let userRepository = appDataSource.getRepository(UserEntity);

export const UserRepository = {
  async getUser(username: string) {
    return userRepository.findOneBy({ username });
  },

  async getUserById(id: number) {
    return userRepository.findOneBy({ id });
  },

  async createUser(data: any) {
    const newUser = userRepository.create(data);
    return userRepository.save(newUser);
  },
};
