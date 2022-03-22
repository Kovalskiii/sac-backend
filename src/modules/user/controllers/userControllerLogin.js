import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from 'lodash';
import message from '../../utils/messages.js';
import roles from '../../permission/roles.js';
import analytics from '../../analytics/controllers/analytics.js';
import userUpdateByIdQuery from '../queries/updateByIdQuery.js';
import { getDocs, query, where } from "firebase/firestore";
import { usersCollectionRef } from "../../core/database.js";

const { get, uniq, hasIn } = pkg;
const permissions = (userRole) => uniq(roles[userRole].map((el) => el));

const userLogin = async (req, res) => {
  const email = get(req, 'body.email', '').trim().toLowerCase();

  const q = query(usersCollectionRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    querySnapshot.forEach((user) => {
      //
      if (user.data()) {
        bcrypt.compare(req.body.password, user.data().password, async (err, result) => {
          if (err) {
            //
            analytics('USER_LOGIN_FAIL', {
              email: user.data().email,
              reason: err,
              isBodyPasswordExist: hasIn(req, 'body.password'),
              isUserPasswordExist: hasIn(user, 'password'),
            });

            return res.status(401).json(message.fail('Auth failed'));
          } else if (result) {
            const token = jwt.sign(
              {
                email: user.data().email,
                userId: user.id,
              },
              process.env.JWT_KEY,
              {
                expiresIn: process.env.JWT_EXPIRES_IN,
              },
            );

            user.data().password = null;

            // Setting login date
            const loginDate = new Date();
            await userUpdateByIdQuery({
              userId: user.id,
              values: { lastLogin: { date: loginDate } },
            });

            analytics('USER_LOGIN_SUCCESS', {
              user: user.id,
            });

            return res.status(200).json({
              message: 'Auth success',
              token,
              user: user.data(),
              permissions: permissions(user.data().role),
              userId: user.id,
            });
          } else {
            //
            analytics('USER_LOGIN_FAIL', {
              email,
              reason: 'Wrong password',
            });

            res.status(401).json(message.fail('Auth failed'));
          }
        });
      } else {
        //
        analytics('USER_LOGIN_FAIL', {
          email,
          reason: 'User not found',
        });

        res.status(401).json(message.fail('Auth failed'));
      }
    });
  } else {
    //
    analytics('USER_LOGIN_ERROR', {
      email,
      controller: 'userControllerLogin',
      reason: 'Auth failed. No such user',
    });

    res.status(400).json(message.fail('Auth failed. Error'));
  }
}

export default userLogin;

