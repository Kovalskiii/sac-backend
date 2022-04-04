import { usersCollectionRef } from "../../core/database.js";
import message from '../../utils/messages.js';
import { addDoc, serverTimestamp } from "firebase/firestore";
import hashPassword from "../helpers/hashPassword.js";

const userCreateQuery = async (user) => {

  const newUser = {
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    firstName: user.firstName,
    lastName: user.lastName,
    password: hashPassword(user.password),
    role: user.role,
    timestamp: serverTimestamp(),
  };

  return await addDoc(usersCollectionRef, newUser)
    .then((user) => {
      return message.success('User created successfully', user.id);
    })
    .catch((error) => {
      return message.fail('Error', error);
    });
};

export default userCreateQuery;
