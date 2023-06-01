import express from 'express';
import {
  createUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changeUserPassword
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/change-password', changeUserPassword);
router.get('/getusers', getUsers);
router.get('/getuser/:id', getUser);
router.put('/updateuser/:id', updateUser);
router.delete('/deleteuser/:id', deleteUser);

export default router;
