import { Router, Request, Response } from 'express';
import { getPostById } from './blog';
import { validate } from 'class-validator';
import { CommentDto } from '../dtos/comment.dto';
import { CommentRepository } from '../repositories/comment.repository';
import { transformValidationErrors } from '../utils/validation-error.utils';

const router: Router = Router();

const getCommentsById = async (id: any) => {
  return await CommentRepository.getCommentsById(id);
};

router.post('/blogId=:blogId', async (req: Request, res: Response) => {
  const blogId = Number(req.params.blogId);
  
  const commentDto = new CommentDto();
  const { username, email, comment } = req.body;
  commentDto.comment = comment;
  commentDto.email = email;
  commentDto.username = username;

  const error = await validate(commentDto);
  if (error.length > 0) {
    const messages = transformValidationErrors(error);
    res.status(403).json({ messagge: 'Validation Failed', error: messages });
  } else {
    try {
      const currentPost = await getPostById(blogId);
      if (currentPost) {
        let com = await CommentRepository.postCommet(
          { ...req.body },
          blogId,
        ).then((val) => {
          res.status(200).json({
            message: 'Comment added successfully',
            comment: { ...val },
            blogId: blogId
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
  const commentDto = new CommentDto();
  commentDto.comment = comment;
  commentDto.email = email;
  commentDto.username = username;

  let error = await validate(commentDto);
  if (error.length > 0) {
    const messages = transformValidationErrors(error);
    res.status(403).json({ messagge: 'Validation Failed', error: messages });
  } else {
    try {
      let currentComment = await getCommentsById(commentId);
      if (currentComment) {
        let updateComment = await CommentRepository.updateCommentById(
          commentId,
          { ...req.body },
        );
        if (updateComment) {
          res.status(200).json({
            message: 'Comment updated successfully',
            comment: { id: commentId, ...req.body },
          });
        }
      } else {
        res.status(404).json({
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
    let comment = await CommentRepository.deleteCommentById(commentById);
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

// kebab case for files
// pascal case for folder
//
