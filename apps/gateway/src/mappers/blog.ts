import { BlogPost } from '@app/schemas/blog_post';
import { BlogDetailDto, BlogListDto } from '@app/dto/blogs/blog.dto';
import { format } from 'date-fns';

export const toBlogListDto = (blogPost: BlogPost): BlogListDto => {
  const blogListDto: BlogListDto = {
    id: blogPost._id.toString(),
    title: blogPost.title,
    content: blogPost.content.substring(0, 128),
    image_url: blogPost.image_url,
    category: blogPost.category,
    read_time: blogPost.read_time,
    date_created: format(blogPost.created_at, 'yyyy-MM-dd HH:mm:ss'), // Adjust the format as needed
  };

  return blogListDto;
};

export const toBlogListDtoArray = (blogPosts: BlogPost[]): BlogListDto[] => {
  return blogPosts.map((blogPost) => toBlogListDto(blogPost));
};

export const toBlogDetailDto = (blogPost: BlogPost): BlogDetailDto => {
  const blogDetailDto: BlogDetailDto = {
    title: blogPost.title,
    content: blogPost.content.substring(0, 128),
    image_url: blogPost.image_url,
    category: blogPost.category,
  };
  return blogDetailDto;
};
