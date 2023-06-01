import UserModel from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if(existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
   
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name: name,
      email: email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    }); 

    await user.save();
    const { password: userPassword, ...userWithoutPassword } = user._doc;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if(!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.NEXT_AWS_SECRET_KEY
    );
    res.status(200).json({ token, email });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { token, currentPassword, newPassword } = req.body;

    const decodedToken = jwt.verify(token, process.env.NEXT_AWS_SECRET_KEY);
    const userId = decodedToken.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, '-password');
    if(!users) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id, '-password');
    if(!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await UserModel.findByIdAndUpdate(id, { name, email, updatedAt: new Date() }, {
      new: true,
      runValidators: true,
    });

    if(!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user._doc;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if(!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user._doc;
    res.status(200).json({ message: 'User deleted successfully.' , user: userWithoutPassword });
  } catch (error) {
    res.status(500).send(error);
  }
};


