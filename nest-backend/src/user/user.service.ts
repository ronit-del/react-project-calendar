import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';

@Injectable()
export class UserService {
    constructor(private readonly userModel: Model<User>) {}
    getUserByEmail(email: string) {
        return this.userModel.findOne({ email });
    }

    createUser(user: User) {
        return this.userModel.create(user);
    }

    updateUser(id: string, user: User) {
        return this.userModel.findByIdAndUpdate(id, user);
    }

    deleteUser(id: string) {
        return this.userModel.findByIdAndDelete(id);
    }
}
