import { Router, Request, Response } from 'express';
import appDataSource from '../datasource/app.datasource';
import { CommentsEntity } from '../entities/comments.entity';
import { getPostById } from './blog';
import { validate } from 'class-validator';
import { CommentDto } from '../dtos/comment.dto';

const router: Router = Router();
const commentDto = new CommentDto();

const getCommentsById = async (id: any) => {
  return await appDataSource
    .getRepository(CommentsEntity)
    .findOne({ where: { id: id } });
};

router.post('/blogId=:blogId', async (req: Request, res: Response) => {
  const blogId = req.params.blogId;

  const { username, email, comment } = req.body;
  commentDto.comment = comment;
  commentDto.email = email;
  commentDto.username = username;

  const error = await validate(commentDto);
  if (error.length > 0) {
    const messages = error.map((err: any) => ({
      property: err.property,
      error: Object.values(err.constraints),
    }));
    res.status(403).json({ messagge: 'Validation Failed', error: messages });
  } else {
    try {
      const currentPost = await getPostById(blogId);
      if (currentPost) {
        let com = await appDataSource
          .getRepository(CommentsEntity)
          .save({ ...req.body, blogId: blogId })
          .then((val) => {
            res.status(200).json({
              message: 'Comment added successfully',
              comment: { ...val },
            });
          });
      } else {
        res
          .status(404)
          .json({ message: 'Invalid blog id. Please enter valid blog id' });
      }
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Failed to add comment', error: error.message });
    }
  }
});

router.put('/commentId=:id', async (req: Request, res: Response) => {
  let commentId = req.params.id;
  const { username, email, comment } = req.body;
  commentDto.comment = comment;
  commentDto.email = email;
  commentDto.username = username;

 let error = await validate(commentDto)
    if (error.length > 0) {
      const messages = error.map((err: any) => ({
        property: err.property,
        error: Object.values(err.constraints),
      }));
      res.status(403).json({ messagge: 'Validation Failed', error: messages });
    } else {
      try {
        let currentComment = await getCommentsById(commentId);
        if (currentComment) {
          let updateComment = await appDataSource
            .getRepository(CommentsEntity)
            .update(commentId, { ...req.body });
          if (updateComment) {
            res.status(200).json({
              message: 'Comment updated successfully',
              comment: { id: commentId, ...req.body },
            });
          }
        } else {
          res
            .status(404)
            .json({
              message: 'Invaid comment id please enter valid comment id',
            });
        }
      } catch (error: any) {
        res
          .status(500)
          .json({ message: 'Failed to update comment', error: error.message });
      }
    }
  });

router.delete('/commentId=:id', async (req: Request, res: Response) => {
  let commentId = req.params.id;
  try {
    let commentById = await getCommentsById(commentId);
    let comment = await appDataSource
      .getRepository(CommentsEntity)
      .delete(commentId);
    if (comment && commentById) {
      res.status(200).json({ message: 'Comment deleted successfully' });
    } else {
      res
        .status(404)
        .json({ message: 'Invalid comment id, please enter valid comment id' });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Failed to delete comment', error: error.message });
  }
});

export default router;