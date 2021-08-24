import mongoose from "mongoose";
import {PostModel} from '../models/post';
import {UserModel} from '../models/user';
import { userTest, postTest } from "./test_utils/mocks";


describe('Add Post record', () => {
    beforeAll(async () => {
        await mongoose.connect(`mongodb://root:pass@localhost:27017`, { useNewUrlParser: true, useUnifiedTopology: true });
        await mongoose.connection
        .once('open', () => { done(); })
        .on('error', (error)=> {
          console.warn(error);
        });
      });
      afterAll( (done) => {
        UserModel.deleteOne({
          email: userTest.email
        });
        mongoose.connection.close();
        done();

      })
    it('test user can create a post', async () => {
      mongoose.connection.collections.users.drop();
          const mockUser = new UserModel(userTest);
          await mockUser.save();
        const newPost = new PostModel({
            title: postTest.title,
            content: postTest.content,
            creator: mockUser,
        });
        const savedPost = await newPost.save();
        await UserModel.findOne({
          email: userTest.email
        });
        expect(savedPost.creator.email).toBe(userTest.email);
    });
    it('removed user should not have posts', async () => {
      const mockUser = new UserModel(userTest);
          await mockUser.save();
      await UserModel.deleteOne({
        _id: mockUser._id
      });
      const posts = await PostModel.find({
        creator: mockUser._id
      });
      expect(posts).toHaveLength(0);
    })

})