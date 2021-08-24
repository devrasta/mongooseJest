import mongoose from 'mongoose';
import { PostModel } from './post.js';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'email required']
  },
  password: {
    type: String,
    required: [true, 'password required'],
  },
  name: {
    type: String,
    required: [true, 'name required'],
    validate: {
      validator: (name) => {
        return name.length > 4;
      },
      message: 'enter a name with more than 4 characters'
    }
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: false
  }],
  status: {
    type: String,
    default: 'unverified'
  }
});
userSchema.pre('deleteOne', {document: true}, async (next) => {
  const userPosts = await mongoose.model('Post').find({creator : this._id});
  console.log(userPosts);
  await PostModel.deleteMany(userPosts);
  next();
})

export const UserModel = mongoose.model('User', userSchema);
