import message from '../utils/messages.js';
import roles from './roles.js';
import analytics from '../analytics/controllers/analytics.js';
import pkg from 'lodash';
import { doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db, usersCollectionRef } from "../core/database.js";

const { get } = pkg;

export const userCan = (userRole, checkedPermission) => {
  return roles[userRole].includes(checkedPermission);
};

const userCheckPerm = (checkedPermission) => async (req, res, next) => {
  const userId = get(req, 'userData.userId', null);
  const userDocRef = doc(db, 'users', userId);
  const docSnapshot = await getDoc(userDocRef);

  if(docSnapshot.exists()) {
    const role = get(docSnapshot.data(), 'role', null);

    if (userCan(role, checkedPermission)) {
      req.userData.role = role;
      req.userData.name = get(docSnapshot.data(), 'name');
      next();
    } else {
      const reason = 'Permission denied';
     analytics('USER_CHECK_PERMISSION_FAIL', {
        reason,
        role: role,
        user: userId,
       controller: 'userCheckPerm',
      });

      res.status(400).json(message.fail(reason));
    }
  }
  else {
    const reason = 'Current user not found';
    //
    analytics('USER_CHECK_PERMISSION_FAIL', {
      reason,
      user: userId,
      permission: 'userCheckPerm',
      controller: 'userCheckPerm',
    });

    res.status(400).json(message.fail(reason,true));
  }
};
export default userCheckPerm;


export const userCanByPerm = (checkedPermission) => async (req, res, next) => {
  const email = get(req, 'body.email', '').trim().toLowerCase();
  const q = query(usersCollectionRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    querySnapshot.forEach((user) => {
      //
      if (user.data()) {
        const role = user.data().role;
        //
        if (userCan(role, checkedPermission)) {
          next();
        } else {
          const reason = 'Permission denied';
          analytics('USER_CHECK_PERMISSION_FAIL', {
            reason,
            role: role,
            user: user.id,
            controller: 'userCheckPerm',
          });

          res.status(400).json(message.fail(reason));
        }
      }
    });
  }
  else {
    const reason = 'Current user not found';
    //
    analytics('USER_CHECK_PERMISSION_ERROR', {
      reason: reason,
      checkedPermission,
      controller: 'userCheckPerm',
    });

    res.status(400).json(message.fail(reason,true));
  }
};
