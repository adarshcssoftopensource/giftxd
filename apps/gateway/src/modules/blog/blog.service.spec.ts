import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BlogService } from './blog.service';
import { BlogPost } from '@app/schemas/blog_post';
import { UpdateBlogDto } from '@app/dto/blogs/blog.dto';

import { Types as MockTypes } from 'mongoose';

// Mock the Mongoose Model
const mockModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  countDocuments: jest.fn(),
};

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: getModelToken(BlogPost.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all posts', async () => {
    const mockPosts = [{ title: 'Post 1' }, { title: 'Post 2' }];

    mockModel.find.mockReturnValueOnce({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockPosts),
    } as any);

    const result = await service.getAllPosts(null);

    expect(result).toEqual(mockPosts);
    expect(mockModel.find).toHaveBeenCalled();
  });

  it('should return a blog post when a valid ID is provided', async () => {
    const postId = 'abccbacbaabc';
    const mockPost = {
      _id: new MockTypes.ObjectId(postId),
      title: 'Test Post',
    };

    mockModel.findOne.mockReturnValue(mockPost);

    const result = await service.getPostById(postId);

    expect(mockModel.findOne).toHaveBeenCalledWith({
      _id: new MockTypes.ObjectId(postId),
    });
    expect(result).toEqual(mockPost);
  });

  it('should return null when an invalid ID is provided', async () => {
    const invalidPostId = 'abcabcabcabc';

    mockModel.findOne.mockReturnValue(null);

    const result = await service.getPostById(invalidPostId);

    expect(mockModel.findOne).toHaveBeenCalledWith({
      _id: new MockTypes.ObjectId(invalidPostId),
    });
    expect(result).toBeNull();
  });

  it('should create a post', async () => {
    const createBlogDto = {
      title: 'New Post',
      content: 'Some content',
      category: 'Use Cases',
    };
    const mockCreatedPost = { ...createBlogDto, _id: 'abc234', read_time: 3 };

    mockModel.create.mockResolvedValueOnce(mockCreatedPost);

    const result = await service.createPost(createBlogDto);

    expect(result).toEqual(mockCreatedPost);
    expect(mockModel.create).toHaveBeenCalledWith({
      ...createBlogDto,
      read_time: expect.any(Number),
    });
  });

  it('should update a blog post and return the modified count', async () => {
    const postId = 'abcabcabcabc';
    const updateBlogDto: UpdateBlogDto = {
      title: 'Updated Title',
      content: 'Updated Content',
      image_url: 'Updated Image',
    };
    const mockPost = {
      _id: new MockTypes.ObjectId(postId),
      title: 'Original Title',
      content: 'Original Content',
      image_url: 'Original Image',
    };

    mockModel.findOne.mockResolvedValue(mockPost);
    mockModel.updateOne.mockReturnValue({ modifiedCount: 1 });

    const result = await service.updatePost(postId, updateBlogDto);

    expect(mockModel.updateOne).toHaveBeenCalledWith(
      { _id: new MockTypes.ObjectId(postId) },
      mockPost,
    );
    expect(mockPost.title).toEqual(updateBlogDto.title);
    expect(mockPost.content).toEqual(updateBlogDto.content);
    expect(mockPost.image_url).toEqual(updateBlogDto.image_url);
    expect(result).toBe(1);
  });

  it('should return 0 if the blog post with the given ID is not found', async () => {
    const postId = 'abcabcabcabc';
    const updateBlogDto: UpdateBlogDto = {
      title: 'Updated Title',
      content: 'Updated Content',
      image_url: 'Updated Image',
    };
    const mockPost = {
      _id: new MockTypes.ObjectId(postId),
      title: 'Original Title',
      content: 'Original Content',
      image_url: 'Original Image',
    };

    mockModel.findOne.mockResolvedValue(null);
    mockModel.updateOne.mockReturnValue({ modifiedCount: 1 });

    const result = await service.updatePost(postId, updateBlogDto);

    expect(mockModel.findOne).toHaveBeenCalledWith({
      _id: new MockTypes.ObjectId(postId),
    });
    expect(mockPost.title).not.toBe(updateBlogDto.title);
    expect(mockPost.content).not.toBe(updateBlogDto.content);
    expect(mockPost.image_url).not.toBe(updateBlogDto.image_url);
    expect(result).toBe(0);
  });

  it('should delete a post', async () => {
    const postId = 'abcabcabcabc';
    mockModel.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });

    const result = await service.deletePost(postId);

    expect(result).toEqual(1);
    expect(mockModel.deleteOne).toHaveBeenCalledWith({
      _id: expect.any(Object),
    });
  });

  it('should handle deleting a non-existing post', async () => {
    const postId = 'abcabcabcabc';
    mockModel.deleteOne.mockResolvedValueOnce({ deletedCount: 0 });

    const result = await service.deletePost(postId);

    expect(result).toEqual(0);
    expect(mockModel.deleteOne).toHaveBeenCalledWith({
      _id: expect.any(Object),
    });
  });

  it('should count posts', async () => {
    const mockCount = 42;
    mockModel.countDocuments.mockResolvedValueOnce(mockCount);

    const result = await service.countPosts();

    expect(result).toEqual(mockCount);
    expect(mockModel.countDocuments).toHaveBeenCalledWith();
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
  });
});
