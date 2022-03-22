import { query, where, getDocs } from "firebase/firestore";
import { usersCollectionRef } from "../../core/database.js";

export async function checkIsUserExistQuery(email) {
  const q = query(usersCollectionRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
}

