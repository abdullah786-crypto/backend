import { ILike } from 'typeorm';
import appDataSource from '../datasource/app.datasource';
import { BlogEntity } from '../entities/blog.entity';

let blogRepository = appDataSource.getRepository(BlogEntity);

export const BlogRepository = {
  async getPostById(id: any) {
    return await blogRepository.findOne({ where: { id: id } });
  },

  async getTotalBlogs() {
    return await blogRepository.count();
  },

  getAllPosts() {
    return blogRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.comments', 'comment')
      .leftJoinAndSelect('posts.user', 'user');
  },

  searchPost(title: any, subtitle: any) {
    return this.getAllPosts()
      .andWhere({ title: ILike(`%${title}%`) })
      .orWhere({ subtitle: ILike(`%${subtitle}%`) });
  },

  async getPostsByIdWithComments(id: any) {
    return await blogRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('post.user', 'user')
      .where({ id: id })
      .getOne();
  },

  async addPost(data: any) {
    return await blogRepository.save(data);
  },

  async updatePostById(currentPostId: any, data: any) {
    return await blogRepository.update(currentPostId, data);
  },

  async deletPostById(currentPostId: any) {
    return await blogRepository.delete(currentPostId);
  },
};
