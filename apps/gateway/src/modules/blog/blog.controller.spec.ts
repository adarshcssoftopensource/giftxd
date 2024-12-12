import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CreateBlogDto } from '@app/dto/blogs';
import { BlogCategory, BlogPost, BlogPostSchema } from '@app/schemas/blog_post';
import { UpdateBlogDto } from '@app/dto/blogs';
import {
  toBlogDetailDto,
  toBlogListDto,
  toBlogListDtoArray,
} from '../../mappers/blog';
import { Schema, Types } from 'mongoose';
import { HttpException } from '@nestjs/common';

describe('BlogController', () => {
  let blogService: BlogService;
  let blogController: BlogController;

  const mockBlog = {
    _id: new Types.ObjectId('61c0ccf11d7bf83d153d7c06'),
    title: 'Blog Title',
    content: 'Blog Content',
    image_url: 'https:www.imageLink.com',
    read_time: 8,
    created_at: new Date(),
    updated_at: new Date(),
    category: BlogCategory.All,
  } as BlogPost;

  const mockBlogService = {
    getAllPosts: jest.fn().mockResolvedValueOnce([mockBlog]),
    createPost: jest.fn(),
    countPosts: jest.fn().mockResolvedValueOnce(1),
    getPostById: jest.fn().mockResolvedValueOnce(mockBlog),
    updatePost: jest.fn(),
    deletePost: jest.fn().mockResolvedValueOnce(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [BlogController],
      providers: [
        {
          provide: BlogService,
          useValue: mockBlogService,
        },
      ],
    }).compile();

    blogService = module.get<BlogService>(BlogService);
    blogController = module.get<BlogController>(BlogController);
  });

  it('should be defined', () => {
    expect(blogController).toBeDefined();
  });

  describe('fetch all blog posts', () => {
    it('should get all blogs', async () => {
      const result = await blogController.getAllPosts();

      expect(blogService.getAllPosts).toHaveBeenCalled();
      expect(result.count).toEqual(1);
      expect(result.posts).toEqual(toBlogListDtoArray([mockBlog]));
    });
  });

  describe('create a new blog post', () => {
    it('should create a new blog', async () => {
      const newBlog = {
        title: 'New Blog',
        content: 'Blog Content',
      };

      mockBlogService.createPost = jest.fn().mockResolvedValueOnce(mockBlog);

      const result = await blogController.createPost(newBlog as CreateBlogDto);

      expect(blogService.createPost).toHaveBeenCalled();
      expect(result).toEqual(toBlogListDto(mockBlog));
    });
  });

  describe('get blog post by id', () => {
    it('should get a post by id', async () => {
      mockBlogService.getPostById = jest.fn().mockResolvedValueOnce(mockBlog);

      const result = await blogController.getPostById(mockBlog._id.toString());

      expect(blogService.getPostById).toHaveBeenCalled();
      expect(result).toEqual(toBlogDetailDto(mockBlog));
    });

    it('should raise not_found exception', async () => {
      mockBlogService.getPostById = jest.fn().mockResolvedValueOnce(null);
      expect(async () => {
        await blogController.getPostById(mockBlog._id.toString());
      }).rejects.toThrow(HttpException);
      expect(blogService.getPostById).toHaveBeenCalled();
    });
  });

  describe('update blog post', () => {
    it('should update blog post by its ID', async () => {
      const updatedBlog = { ...mockBlog, title: 'Updated blog post title' };
      const blogPost = { title: 'Updated name' };

      mockBlogService.updatePost = jest.fn().mockResolvedValueOnce(1);

      const result = await blogController.updatePost(
        mockBlog._id.toString(),
        blogPost as UpdateBlogDto,
      );

      expect(blogService.updatePost).toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('should throw a not_found exception', async () => {
      const blogPost = { title: 'Updated name' };

      mockBlogService.updatePost = jest.fn().mockResolvedValueOnce(0);

      expect(async () => {
        await blogController.updatePost(
          mockBlog._id.toString(),
          blogPost as UpdateBlogDto,
        );
      }).rejects.toThrow(HttpException);
      expect(blogService.updatePost).toHaveBeenCalled();
    });
  });

  describe('delete blog post', () => {
    it('should delete blog post by its ID', async () => {
      mockBlogService.deletePost = jest.fn().mockResolvedValueOnce(1);

      await blogController.deletePost(mockBlog._id.toString());

      expect(blogService.deletePost).toHaveBeenCalled();
    });

    it('should throw a not_found exception', async () => {
      mockBlogService.updatePost = jest.fn().mockResolvedValueOnce(0);

      expect(async () => {
        await blogController.deletePost(mockBlog._id.toString());
      }).rejects.toThrow(HttpException);
      expect(blogService.deletePost).toHaveBeenCalled();
    });
  });
});
