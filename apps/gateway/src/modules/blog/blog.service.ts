import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBlogDto, UpdateBlogDto } from '@app/dto/blogs/blog.dto';
import { BlogCategory, BlogPost } from '@app/schemas/blog_post';
import { basename } from 'path';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogPost.name) private readonly postModel: Model<BlogPost>,
  ) {}

  async getAllPosts(
    category: BlogCategory = BlogCategory.All,
    page = 1,
    limit = 10,
  ): Promise<BlogPost[]> {
    const skip = (page - 1) * limit;
    if (category != BlogCategory.All) {
      return await this.postModel.find({ category }).skip(skip).limit(limit);
    }
    return await this.postModel.find().skip(skip).limit(limit);
  }

  async getPostById(postId: string): Promise<BlogPost | null> {
    return await this.postModel.findOne({ _id: new Types.ObjectId(postId) });
  }

  async createPost(CreateBlogDto: CreateBlogDto): Promise<BlogPost> {
    const read_time = this.calculateReadTime(CreateBlogDto.content);

    const createdPost = await this.postModel.create({
      ...CreateBlogDto,
      read_time,
    });
    return createdPost;
  }

  async updatePost(
    postId: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<number> {
    const blog = await this.postModel.findOne({
      _id: new Types.ObjectId(postId),
    });
    if (!blog) return 0;

    Object.keys(updateBlogDto).forEach((key) => {
      blog[key] = updateBlogDto[key];
    });

    const result = await this.postModel.updateOne(
      { _id: new Types.ObjectId(postId) },
      blog,
    );
    return result.modifiedCount;
  }

  async deletePost(postId: string): Promise<number> {
    const result = await this.postModel.deleteOne({
      _id: new Types.ObjectId(postId),
    });
    return result.deletedCount;
  }

  async countPosts(category: BlogCategory = BlogCategory.All): Promise<number> {
    if (category != BlogCategory.All)
      return await this.postModel.countDocuments({ category: category });
    return await this.postModel.countDocuments();
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
