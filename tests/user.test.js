import { beforeAll, it } from '@jest/globals';
import mongoose from "mongoose";
import {UserModel} from '../models/user';
import { userTest } from "./test_utils/mocks";

describe('Add user record', () => {

  beforeAll(async () => {
    await mongoose.connect(`mongodb://root:pass@localhost:27017`, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection
    .once('open', () => { done(); })
    .on('error', (error)=> {
      console.warn(error);
    });
  });
  afterAll(done => {
    mongoose.connection.close();
    done();
  })
  it('should insert user to collection', async () => {
    mongoose.connection.collections.users.drop();
    const mockUser = new UserModel(userTest);
    await mockUser.save();
    expect(mockUser.isNew);
  });
  it('should retrieve added user by email', async () => {
    const savedUser = await UserModel.findOne({
      email: userTest.email
    });
    expect(savedUser.name).toBe(userTest.name);
  })
  it('should remove test user', async () => {
    const userTestCondition = { name: userTest.name}
    const deletedUser = await UserModel.findOneAndDelete(userTestCondition);
    const user = await UserModel.findById(deletedUser._id);
    expect(user).toEqual(null);
  })
})