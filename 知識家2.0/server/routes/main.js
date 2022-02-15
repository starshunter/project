import express from 'express'

import { handleConfirm, handleLogin, handleResendConfirmation, handleResetPassword, handleSignup } from './handlers/authentication.js';
import { handleAddComment, handleGetCommentByUser } from './handlers/comment.js';
import { handleGetUserProfile } from './handlers/profile.js';
import { handelGetQuestionByKeyword, handleCreateQuestion, handleGetQuestionByPage, handleGetQuestionByUser, handleSetBestComment } from './handlers/question.js';
import { handleChangeIntro, handleChangePassowrd } from './handlers/setting.js';

const router = express.Router()

// const transporter = makeTransporter('Gmail', 'mail', 'password');

// authentication related
router.post('/login', handleLogin);

router.post('/signup', handleSignup);

router.get('/confirm', handleConfirm);

router.post('/resendConfirmation', handleResendConfirmation);

router.post('/resetPassword', handleResetPassword);

// question relaated
router.post('/createQuestion', handleCreateQuestion);

router.get('/getQuestionByPage', handleGetQuestionByPage);

router.get('/getQuestionByUser', handleGetQuestionByUser);

router.get('/getQuestionByKeyword', handelGetQuestionByKeyword);

router.post('/setBestComment', handleSetBestComment);

// setting related
router.post('/changePassword', handleChangePassowrd);

router.post('/changeIntro', handleChangeIntro);

// comment related
router.post('/addComment', handleAddComment);

router.get('/getCommentByUser', handleGetCommentByUser);

// profile related
router.get('/getUserProfile', handleGetUserProfile);

export default router
