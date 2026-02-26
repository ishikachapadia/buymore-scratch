import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function getUserCooldown(uid) {
  if (!uid) return 0;
  const ref = doc(db, "cooldowns", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data().lastPlay || 0;
  }
  return 0;
}

export async function setUserCooldown(uid, timestamp) {
  if (!uid) return;
  const ref = doc(db, "cooldowns", uid);
  await setDoc(ref, { lastPlay: timestamp }, { merge: true });
}
