import { Router, Request, Response } from 'express';
import { BlogDto } from '../dtos/blog.dto';
import { validate } from 'class-validator';
import { BlogRepository } from '../repositories/blog.repository';
import { transformValidationErrors } from '../utils/validation-error.utils';
// import { UserRepository } from '../repositories/user.repository';
import { ILike } from 'typeorm';
import { isLoggedIn } from '../middleware/auth.middleware';
import { UserEntity } from '../entities/user.entity';

const router: Router = Router();

export const getPostById = async (id: any) => {
  return await BlogRepository.getPostById(id);
};

router.get('/', async (req: Request, res: Response) => {
  let blogDto = new BlogDto();

  try {
    const { title, subtitle, page, limit } = req.query;
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const totalRecords = await BlogRepository.getTotalBlogs();
    let blogsRepo = BlogRepository.getAllPosts();
    if (subtitle || title) {
      blogsRepo = BlogRepository.searchPost(title, subtitle);
      blogsRepo
        .andWhere({ title: ILike(`%${title}%`) })
        .orWhere({ subtitle: ILike(`%${subtitle}%`) });
    }
    if (title || subtitle || page || limit) {
      blogsRepo = blogsRepo.skip(skip).take(pageSize);
    }
    let blogs = await blogsRepo.getMany();
    if (blogs) {
      res.status(200).json({
        message: 'Data fetched successfully',
        blogs: blogs,
        totalRecords: totalRecords,
      });
    } else {
      res.status(404).json({ message: 'No any blogs items' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch blogs', error: error });
  }
});

router.get('/id=:id', async (req: Request, res: Response) => {
  const postId = Number(req.params.id);
  try {
    let blog = await BlogRepository.getPostsByIdWithComments(postId);

    if (blog) {
      res.status(200).json({ message: 'Data fetch successfully', blogs: blog });
    } else {
      res.status(404).json({ message: 'Please enter valid post id' });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Failed to fetch the posts', error: error.message });
  }
});

router.post('/', isLoggedIn, async (req: Request, res: Response) => {
  console.log('Logged in user:', req.user);

  const { title, subtitle, image, blogData, userId } = req.body;
  let blogDto = new BlogDto();

  blogDto.title = title;
  blogDto.image = image;
  blogDto.blogData = blogData;
  blogDto.subtitle = subtitle;

  const error = await validate(blogDto);
  if (error.length > 0) {
    let messages = transformValidationErrors(error);
    res.status(403).json({ message: 'Validation failed', errors: messages });
  } else {
    try {
      // let user = await UserRepository.getUserById(userId);
      let user = req.user as UserEntity;

      const blog = await BlogRepository.addPost({ ...req.body, user: user });
      if (blog) {
        res
          .status(200)
          .json({ message: 'Post added successfully', post: { ...blog } });
      } else {
        res.status(400).json({ message: 'Post failed to upload' });
      }
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Failed to add your post', error: error });
    }
  }
});

router.put('/id=:id', isLoggedIn, async (req: Request, res: Response) => {
  const currentPostId = req.params.id;
  let currentPost = await BlogRepository.getPostsByIdWithComments(
    currentPostId,
  );
  console.log('current post is', currentPost);

  let user = req.user as UserEntity;
  console.log('blblblblblb', user);
  if (currentPost?.user.id === user.id) {
    // console.log('user is authenticated now u can post here.....', req.isAuthenticated())
    let blogDto = new BlogDto();

    const { title, subtitle, blogData, image, userId } = req.body;

    blogDto.blogData = blogData;
    (blogDto.title = title),
      (blogDto.image = image),
      (blogDto.subtitle = subtitle);

    const error = await validate(blogDto);
    if (error.length > 0) {
      const messages = transformValidationErrors(error);
      res.status(403).json({ message: 'Validation Failed', errors: messages });
    } else {
      try {
        let currentPost = await getPostById(currentPostId);
        if (currentPost) {
          // let user = await UserRepository.getUserById(userId);
          const blog = await BlogRepository.updatePostById(currentPostId, {
            ...req.body,
          });
          res.status(200).json({
            message: 'Blog updated successfully',
            blog: { id: currentPostId, ...req.body },
          });
        } else {
          res.status(404).json({ message: 'Please enter valid post id' });
        }
      } catch (error: any) {
        res
          .status(500)
          .json({ message: 'Failed to update the post', error: error.message });
      }
    }
  } else {
    res
      .status(401)
      .json({
        message: 'You cannot edit this post an authorized user can edit this post only',
      });
  }
});

router.delete('/id=:id', async (req: Request, res: Response) => {
  let currentPostId = req.params.id;
  try {
    let currentPost = await getPostById(currentPostId);
    if (currentPost) {
      await BlogRepository.deletPostById(currentPostId);
      res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ messsge: 'Please enter valid post id' });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Filed to delete post', error: error.message });
  }
});

export default router;
