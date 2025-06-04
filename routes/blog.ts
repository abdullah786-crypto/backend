import { Router, Request, Response } from 'express';
import appDataSource from '../datasource/app.datasource';
import { BlogEntity } from '../entities/blog.entity';
import { BlogDto } from '../dtos/blog.dto';
import { validate, Validate } from 'class-validator';
import { ILike } from 'typeorm';
import { log } from 'console';

const router: Router = Router();
let blogDto = new BlogDto();

export const getPostById = async (id: any) => {
  return await appDataSource
    .getRepository(BlogEntity)
    .findOne({ where: { id: id } });
};

router.get('/', async (req: Request, res: Response) => {
  try {
    const { title, subtitle, page, limit } = req.query;
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const totalRecords = await appDataSource.getRepository(BlogEntity).count();
    let blogsRepo = appDataSource
      .getRepository(BlogEntity)
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.comments', 'comment');
    if (subtitle || title) {
      blogsRepo = blogsRepo
        .andWhere({ title: ILike(`%${title}%`) })
        .orWhere({ subtitle: ILike(`%${subtitle}%`) });
    }
    if (title || subtitle || page || limit) {
      blogsRepo = blogsRepo.skip(skip).take(pageSize);
    }
    let blog = await blogsRepo.getMany();
    if (blog) {
      res.status(200).json({
        message: 'Data fetched successfully',
        blogs: blog,
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
    let blog = await appDataSource
      .getRepository(BlogEntity)
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comments')
      .where({ id: postId })
      .getOne();

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

router.post('/', async (req: Request, res: Response) => {
  const { title, subtitle, image, blogData } = req.body;

  blogDto.title = title;
  blogDto.image = image;
  blogDto.blogData = blogData;
  blogDto.subtitle = subtitle;

  const error = await validate(blogDto);
  if (error.length > 0) {
    const message = error.map((element: any) => ({
      property: element.property,
      errors: Object.values(element.constraints),
    }));
    res.status(403).json({ message: 'Validation failed', errors: message });
  } else {
    try {
      const blog = await appDataSource
        .getRepository(BlogEntity)
        .save({ ...req.body });
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

router.put('/id=:id', async (req: Request, res: Response) => {
  const currentPostId = req.params.id;

  const { title, subtitle, blogData, image } = req.body;

  blogDto.blogData = blogData;
  (blogDto.title = title),
    (blogDto.image = image),
    (blogDto.subtitle = subtitle);

  const error = await validate(blogDto);
  if (error.length > 0) {
    const messages = error.map((val: any) => ({
      property: val.property,
      error: Object.values(val.constraints),
    }));
    res.status(403).json({ message: 'Validation Failed', errors: messages });
  } else {
    try {
      let currentPost = await getPostById(currentPostId);
      if (currentPost) {
        const blog = await appDataSource
          .getRepository(BlogEntity)
          .update(currentPostId, { ...req.body });
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
});

router.delete('/id=:id', async (req: Request, res: Response) => {
  let currentPostId = req.params.id;
  try {
    let currentPost = await getPostById(currentPostId);
    if (currentPost) {
      await appDataSource.getRepository(BlogEntity).delete(currentPostId);
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