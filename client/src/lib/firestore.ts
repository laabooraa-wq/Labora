import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile, Shift, InsertUserProfile, InsertShift } from '@shared/schema';

// User Profile Operations
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

export async function createUserProfile(uid: string, email: string, profile: InsertUserProfile): Promise<UserProfile> {
  const now = new Date().toISOString();
  const userProfile: UserProfile = {
    ...profile,
    uid,
    email,
    createdAtISO: now,
    updatedAtISO: now,
  };
  
  await setDoc(doc(db, 'users', uid), userProfile);
  return userProfile;
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    ...updates,
    updatedAtISO: new Date().toISOString(),
  });
}

// Shift Operations
export async function getShift(uid: string, shiftId: string): Promise<Shift | null> {
  const docRef = doc(db, 'users', uid, 'shifts', shiftId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as Shift;
  }
  return null;
}

export async function createShift(uid: string, shiftData: InsertShift): Promise<Shift> {
  const shiftId = crypto.randomUUID();
  const now = new Date().toISOString();
  
  const shift: Shift = {
    ...shiftData,
    id: shiftId,
    uid,
    createdAtISO: now,
    updatedAtISO: now,
  };
  
  await setDoc(doc(db, 'users', uid, 'shifts', shiftId), shift);
  return shift;
}

export async function updateShift(uid: string, shiftId: string, updates: Partial<Shift>): Promise<void> {
  const docRef = doc(db, 'users', uid, 'shifts', shiftId);
  await updateDoc(docRef, {
    ...updates,
    updatedAtISO: new Date().toISOString(),
  });
}

export async function deleteShift(uid: string, shiftId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'shifts', shiftId));
}

export async function getShiftsByDateRange(
  uid: string, 
  startDate: string, 
  endDate: string
): Promise<Shift[]> {
  const shiftsRef = collection(db, 'users', uid, 'shifts');
  const q = query(
    shiftsRef,
    where('dateISO', '>=', startDate),
    where('dateISO', '<=', endDate),
    orderBy('dateISO', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Shift);
}

export async function getAllShifts(uid: string): Promise<Shift[]> {
  const shiftsRef = collection(db, 'users', uid, 'shifts');
  const q = query(shiftsRef, orderBy('dateISO', 'asc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Shift);
}

export async function getShiftsByDate(uid: string, dateISO: string): Promise<Shift[]> {
  const shiftsRef = collection(db, 'users', uid, 'shifts');
  const q = query(
    shiftsRef,
    where('dateISO', '==', dateISO),
    orderBy('createdAtISO', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Shift);
}

// Batch create shifts (for import)
export async function createShiftsBatch(uid: string, shifts: InsertShift[]): Promise<Shift[]> {
  const batch = writeBatch(db);
  const now = new Date().toISOString();
  const createdShifts: Shift[] = [];
  
  shifts.forEach(shiftData => {
    const shiftId = crypto.randomUUID();
    const shift: Shift = {
      ...shiftData,
      id: shiftId,
      uid,
      createdAtISO: now,
      updatedAtISO: now,
    };
    
    const docRef = doc(db, 'users', uid, 'shifts', shiftId);
    batch.set(docRef, shift);
    createdShifts.push(shift);
  });
  
  await batch.commit();
  return createdShifts;
}

// Invalidate calc cache when tariffs or night window change
export async function recalculateAllShifts(uid: string): Promise<void> {
  const shifts = await getAllShifts(uid);
  const batch = writeBatch(db);
  
  shifts.forEach(shift => {
    const docRef = doc(db, 'users', uid, 'shifts', shift.id);
    batch.update(docRef, { 
      calcCache: null,
      updatedAtISO: new Date().toISOString() 
    });
  });
  
  await batch.commit();
}
