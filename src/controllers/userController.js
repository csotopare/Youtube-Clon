import routes from '../routes';
import User from '../models/User';
import passport from 'passport';

// FORM AUTHENTICATED
export const getJoin = (req, res) => {
   res.render('join', { pageTitle: 'Join' });
};
export const postJoin = async (req, res, next) => {
   const {
      body: { name, email, password, password2 },
   } = req;
   if (password !== password2) {
      res.status(400);
      res.render('join', { pageTitle: 'Join' });
   } else {
      try {
         const user = await User({
            name,
            email,
         });
         await User.register(user, password);
         next();
      } catch (error) {
         console.log(error);
         res.redirect(routes.home);
      }
   }
};

export const getLogin = (req, res) =>
   res.render('login', { pageTitle: 'Log In' });

export const postLogin = passport.authenticate('local', {
   failureRedirect: routes.login,
   successRedirect: routes.home,
});

// GITHUB AUTHENTICATED
export const githubLogin = passport.authenticate('github');

export const githubLoginCallback = async (_, __, profile, cb) => {
   const {
      _json: { id, avatar_url: avatarUrl, name, login, email },
   } = profile;
   try {
      const user = await User.findOne({ email });
      if (user) {
         user.githubId = id;
         user.save();
         return cb(null, user);
      } else {
         const newUser = await User.create({
            email,
            login,
            name,
            githubId: id,
            avatarUrl,
         });
         return cb(null, newUser);
      }
   } catch (error) {
      return cb(error);
   }
};

export const postGithubLogIn = (req, res) => {
   res.redirect(routes.home);
};

// FACEBOOK AUTHENTICATED
export const facebookLogin = passport.authenticate('facebook');

export const facebookLoginCallback = async (_, __, profile, cb) => {
   const {
      _json: { id, name, email },
   } = profile;
   try {
      const user = await User.findOne({ email });
      if (user) {
         user.facebookId = id;
         user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
         user.save();
         return cb(null, user);
      } else {
         const newUser = await User.create({
            email,
            name,
            facebookId: id,
            avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`,
         });
         return cb(null, newUser);
      }
   } catch (error) {
      return cb(error);
   }
};

export const postFacebookLogIn = (req, res) => {
   res.redirect(routes.home);
};

// CHANGE THE USER FOR ME
export const getMe = (req, res) => {
   res.render('userDetail', { pageTitle: 'User Detail', user: req.user });
};

// USER DETAIL
export const userDetail = async (req, res) => {
   const {
      params: { id },
   } = req;
   try {
      const user = await User.findById(id).populate('videos');
      res.render('userDetail', { pageTitle: 'User Detail', user });
   } catch (error) {
      res.redirect(routes.home);
   }
};

// EDIT PROFILE
export const getEditProfile = (req, res) =>
   res.render('editProfile', { pageTitle: 'Edit Profile' });

export const postEditProfile = async (req, res) => {
   const {
      body: { name, email },
      file,
   } = req;
   try {
      await User.findByIdAndUpdate(req.user.id, {
         name,
         email,
         avatarUrl: file ? file.location : req.user.avatarUrl,
      });
      res.redirect(routes.me);
   } catch (error) {
      res.redirect(routes.editProfile);
   }
};

// CHANGE PASSWORD
export const getChangePassword = (req, res) =>
   res.render('changePassword', { pageTitle: 'Change Password' });

export const postChangePassword = async (req, res) => {
   const {
      body: { oldPassword, newPassword, newPassword1 },
   } = req;
   try {
      if (newPassword !== newPassword1) {
         res.status(400);
         res.redirect(`/users${routes.changePassword}`);
         return;
      }
      await req.user.changePassword(oldPassword, newPassword);
      res.redirect(routes.me);
   } catch (error) {
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
   }
};

// LOGOUT
export const logout = (req, res) => {
   req.logout();
   res.redirect(routes.home);
};
