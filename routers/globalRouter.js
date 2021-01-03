import express from 'express';
import passport from 'passport';
import {
   facebookLogin,
   getJoin,
   getLogin,
   getMe,
   githubLogin,
   logout,
   postFacebookLogIn,
   postGithubLogIn,
   postJoin,
   postLogin,
} from '../controllers/userController';
import { home, search } from '../controllers/videoController';
import { onlyPrivate, onlyPublic } from '../middlewares';
import routes from '../routes';

const globalRouter = express.Router();

// PASSPORT LOCAL STRATEGY

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, onlyPrivate, logout);

// GITHUB PASSPORT STRATEGY
globalRouter.get(routes.gitHub, githubLogin);

globalRouter.get(
   routes.githubCallback,
   passport.authenticate('github', { failureRedirect: '/login' }),
   postGithubLogIn
);

// FACEBOOK PASSPORT STRATEGY
globalRouter.get(routes.facebook, facebookLogin);

globalRouter.get(
   routes.facebookCallback,
   passport.authenticate('facebook', { failureRedirect: '/login' }),
   postFacebookLogIn
);

globalRouter.get(routes.me, getMe);

export default globalRouter;
