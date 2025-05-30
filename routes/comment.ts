import { Router, Request, Response } from 'express';
import appDataSource from '../datasource/app.datasource';
import { CommentsEntity } from '../entities/comments.entity';
import { getPostById } from './blog';
import { validate } from 'class-validator';
import { CommentDto } from '../dtos/comment.dto';
import { BlogEntity } from '../entities/blog.entity';

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
    console.log('value of the message is', messages);
    res.status(403).json({ messagge: 'Validation Failed', error: messages });
  } else {
    try {
      const currentPost = await getPostById(blogId);
      console.log('current post is', currentPost);
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

  await validate(commentDto).then((error: any[]) => {
    if (error.length > 0) {
      const messages = error.map((err: any) => ({
        property: err.property,
        error: Object.values(err.constraints),
      }));
      res.status(403).json({ messagge: 'Validation Failed', error: messages });
    }
  });
  try {
    let currentComment = await getCommentsById(commentId);

    if (currentComment) {
      let updateComment = await appDataSource
        .getRepository(CommentsEntity)
        .update(commentId, { ...req.body });
      console.log('value of updated comment is', updateComment);
      if (updateComment) {
        res.status(200).json({
          message: 'Comment updated successfully',
          comment: { id: commentId, ...req.body },
        });
      }
    } else {
      res
        .status(404)
        .json({ message: 'Invaid comment id please enter valid comment id' });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Failed to update comment', error: error.message });
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
      res.status(200).json({ message: 'Comment updated successfully' });
    } else {
      res
        .status(404)
        .json({ message: 'Invalid comment id, please enter valid comment id' });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Failed to update comment', error: error.message });
  }
});

export default router;

// For get comment by id
//   return await appDataSource
//     .getRepository(CommentsEntity)
//     .createQueryBuilder('comment')
//     .where('comment.blogId = :blogId', { blogId: id })
//     .getMany();

// // router.get('/list/blogId=:blogId', async (req: Request, res: Response) => {
//     let blogId = req.params.blogId;
//     try {
//         let comment = await getCommentsById(blogId);
//         let currentPost = await getPostById(blogId);
//         if (comment && currentPost) {
//             res.json({ message: 'Comment fetch successfully', comment: comment });
//         } else {
//             res.json({ message: 'Please enter valid blog id' });
//         }
//     } catch (error: any) {
//         res
//             .status(500)
//             .json({ message: 'Failed to fetch blog comment', error: error.message });
//     }
// });

// for the update comments
// let updateComment = await appDataSource
//     .getRepository(CommentsEntity)
//     .createQueryBuilder()
//     .update()
//     .set({ ...req.body })
//     .where('id = :id', { id: commentId })
//     .execute();

// for delete comemnts
// let commentById = await appDataSource
//   .getRepository(CommentsEntity)
//   .createQueryBuilder()
//   .select()
//   .where('id = :id', { id: commentId })
//   .getOne();
// let comment = await appDataSource
//   .getRepository(CommentsEntity)
//   .createQueryBuilder()
//   .delete()
//   .where('id = :id', { id: commentId })
//   .execute();

// For update the comments
// try {
//     let comments = await getCommentsById(blogId)
//     let currentPost = await getPostById(blogId)

//     if (comments && currentPost) {
//         let updateComment = await appDataSource.getRepository(CommentsEntity).createQueryBuilder().update().set({ ...req.body }).execute()
//         if (updateComment) {
//             res.status(200).json({ message: 'Post update successfully' })
//         }
//     } else {
//         res.status(404).json({ message: 'Invalid blog id. Please enter valid blog id' })
//     }
// } catch (error: any) {
//     res.status(500).json({ message: 'Failed to update comment', error: error.message })
// }
