import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

const MAX_FREE_SCRAPES = 5;
const MAX_FREE_LISTINGS = 25;

export async function getUserData(email: string) {
  const userRef = doc(db, "users", email);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, {
      email,
      isPro: false,
      scrapeCount: 0,
      listingCount: 0
    });
    return { isPro: false, scrapeCount: 0, listingCount: 0 };
  }

  return docSnap.data();
}

export async function canScrape(email: string, newListings: number) {
  const user = await getUserData(email);
  if (user.isPro) return true;

  return (
    user.scrapeCount < MAX_FREE_SCRAPES &&
    user.listingCount + newListings <= MAX_FREE_LISTINGS
  );
}

export async function incrementUsage(email: string, listings: number) {
  const userRef = doc(db, "users", email);
  await updateDoc(userRef, {
    scrapeCount: increment(1),
    listingCount: increment(listings)
  });
}