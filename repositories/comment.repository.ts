import appDataSource from '../datasource/app.datasource';
import { CommentsEntity } from '../entities/comments.entity';

let commentRepository = appDataSource.getRepository(CommentsEntity);

export const CommentRepository = {
  
  async getCommentsById(id: any) {
    return commentRepository.findOne({ where: { id: id } });
  },
  
  async postCommet(data: any, blogId: any) {
    const commentData = {
    ...data,
    blogId: blogId,
  };
    return await commentRepository.save(commentData);
  },

  async updateCommentById(id: any, data: any) {
    return await commentRepository.update(id, data);
  },

  async deleteCommentById(id: any) {
    return await commentRepository.delete(id);
  },

};
