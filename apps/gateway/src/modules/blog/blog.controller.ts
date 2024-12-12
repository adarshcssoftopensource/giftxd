import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateBlogDto, UpdateBlogDto } from '@app/dto/blogs/blog.dto';
import { BlogService } from './blog.service';
import {
  toBlogDetailDto,
  toBlogListDto,
  toBlogListDtoArray,
} from '../../mappers/blog';
import { ResponseInterceptor, ResponseMessage } from '@app/common';
import { BlogCategory } from '@app/schemas/blog_post';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('blogs')
@ApiTags('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ResponseMessage('Blog posting successful')
  @UseInterceptors(ResponseInterceptor)
  async createPost(@Body() createBlogDto: CreateBlogDto) {
    return toBlogListDto(await this.blogService.createPost(createBlogDto));
  }

  @Get(':postId')
  @ResponseMessage('Blog post fetching successful')
  @UseInterceptors(ResponseInterceptor)
  async getPostById(@Param('postId') postId: string) {
    const blog = await this.blogService.getPostById(postId);
    if (!blog)
      throw new HttpException('Blog post not found!', HttpStatus.NOT_FOUND);
    return toBlogDetailDto(blog);
  }

  @Get()
  @ResponseMessage('Blog post list retrieval successful')
  @ApiQuery({
    name: 'category',
    enum: [
      BlogCategory.All,
      BlogCategory.Fundamentals,
      BlogCategory.RecentTrends,
      BlogCategory.UseCases,
    ],
  })
  @UseInterceptors(ResponseInterceptor)
  async getAllPosts(
    @Query('category') category: BlogCategory,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return {
      count: await this.blogService.countPosts(category),
      page: page,
      limit: limit,
      posts: toBlogListDtoArray(
        await this.blogService.getAllPosts(category, page, limit),
      ),
    };
  }

  @Patch(':postId')
  @ResponseMessage('Blog post update successful')
  @UseInterceptors(ResponseInterceptor)
  async updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdateBlogDto,
  ) {
    const modifiedCount = await this.blogService.updatePost(
      postId,
      updatePostDto,
    );
    if (!modifiedCount)
      throw new HttpException('Blog post not found!', HttpStatus.NOT_FOUND);
    return {};
  }

  @Delete(':postId')
  @ResponseMessage('Blog post deletion successful')
  @UseInterceptors(ResponseInterceptor)
  async deletePost(@Param('postId') postId: string) {
    const deletedCount = await this.blogService.deletePost(postId);
    if (!deletedCount)
      throw new HttpException('Blog post not found!', HttpStatus.NOT_FOUND);
    return {};
  }
}
