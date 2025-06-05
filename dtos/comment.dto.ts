import { IsEmail, IsNotEmpty } from "class-validator";

export class CommentDto {

    @IsNotEmpty({message: 'Username is required'})
    username: string

    @IsEmail({}, {message: 'Please enter valid email address'})
    email: string

    @IsNotEmpty({message: 'Comment is required'})
    comment: any

    

}