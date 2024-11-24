import express from 'express';
import multer from 'multer';
import cors from 'cors';
import validadeLoginUser from '../controllers/loginController.js';
import authenticateToken from '../controllers/tokenController.js';
import { listAllPosts, postNewPost, uploadImage, updateNewPost } from '../controllers/postsController.js';

const corsOptions = {
    origin: 'http://localhost:8000',
    optionsSuccessStatus: 200
};

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
});

const upload = multer({dest:'./uploads', storage});

const routes = (app) => {
    app.use(express.json());
    app.use(cors(corsOptions));
    app.get('/posts', authenticateToken, listAllPosts);
    app.post('/login', validadeLoginUser);
    app.post('/posts', authenticateToken, postNewPost);
    app.post('/posts/upload', authenticateToken, upload.single('image'), uploadImage);
    app.put('/posts/upload/:id', authenticateToken, updateNewPost);
};

export default routes;