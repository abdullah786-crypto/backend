import appDataSource from "../datasource/app.datasource";
import { UserEntity } from "../entities/user.entity";

export class UserRepository {
  static async getUser(username: string) {
    const repo = appDataSource.getRepository(UserEntity);
    return repo.findOneBy({ username });
  }

  static async getUserById(id: number) {
    const repo = appDataSource.getRepository(UserEntity);
    return repo.findOneBy({ id });
  }

  static async createUser(data: any) {
    const repo = appDataSource.getRepository(UserEntity);
    const newUser = repo.create(data);
    return repo.save(newUser);
  }
}
