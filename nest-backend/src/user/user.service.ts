import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }
    getUserByEmail(email: string) {
        return this.userModel.findOne({ email });
    }

    createUser(user: User) {
        return this.userModel.create(user);
    }

    updateUserPassword(id: string, password: string) {
        return this.userModel.findOneAndUpdate({ _id: id }, { password });
    }

    updateUser(id: string, user: User) {
        return this.userModel.findByIdAndUpdate(id, user, { new: true });
    }

    deleteUser(id: string) {
        return this.userModel.findByIdAndDelete(id);
    }

    getUser(id) {
        return this.userModel.findById(id);
    }

    getAllUsers() {
        return this.userModel.find({ role: { $ne: 'admin' } });
    }
}
