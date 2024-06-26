import { Expose } from 'class-transformer';

export default class UserResponse {
    @Expose()
    public id!: string;

    @Expose()
    public email!: string;

    @Expose()
    public avatarPath!: string;

    @Expose()
    public firstName!: string;

    @Expose()
    public lastName!: string;

    @Expose()
    public isPro!: boolean;
}
