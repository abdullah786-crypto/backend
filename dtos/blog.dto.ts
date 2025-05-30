import { MaxLength, MinLength, IsNotEmpty } from "class-validator";

export class BlogDto {

    @MinLength(3, { message: 'Title should be minimum 3 characters long' })
    @MaxLength(100, { message: 'Title should not long more then 100 characters' })
    @IsNotEmpty({ message: 'Title is required' })
    title: string

    @MinLength(3, { message: 'Title should be minimum 3 characters long' })
    @MaxLength(150, { message: 'Title should not long more then 150 characters' })
    @IsNotEmpty({ message: 'Subtitle is required' })
    subtitle: string

    @IsNotEmpty({ message: 'Blog data is required' })
    blogData: string

    @IsNotEmpty({ message: 'Image is required' })
    image: string

}