import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Provider,
  User,
  Appointment,
  ChatMessage,
  ChatMeta,
  Complaint,
  Review,
  Sector,
} from '../types';
import { INITIAL_PROVIDERS } from '../constants/seedData';

// Storage keys for offline-first caching
const STORAGE_KEYS = {
  PROVIDERS: 'jeely_professionals_v1',
  USER: 'jeely_current_user',
  FAVORITES: 'jeely_favorites_v1',
  APPOINTMENTS: 'jeely_appointments_v1',
  BLOCKED_PHONES: 'jeely_blocked_phones',
};

class FirestoreService {
  // ─── INITIALIZATION & SEEDING ───
  async initializeLocalData(): Promise<Provider[]> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.PROVIDERS);
      if (cached) {
        return JSON.parse(cached);
      }
      // Save initial verified dataset
      await AsyncStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(INITIAL_PROVIDERS));
      return INITIAL_PROVIDERS;
    } catch {
      return INITIAL_PROVIDERS;
    }
  }

  // ─── PROVIDERS (الصنائع والمحترفون) ───
  subscribeProviders(onUpdate: (providers: Provider[]) => void): () => void {
    // 1. Immediately feed from local cache for instant UI rendering
    this.initializeLocalData().then(onUpdate);

    try {
      const colRef = collection(db, 'professionals');
      const unsub = onSnapshot(
        colRef,
        async (snapshot) => {
          if (!snapshot.empty) {
            const list: Provider[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ ...(docSnap.data() as Provider), id: docSnap.id });
            });
            await AsyncStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(list));
            onUpdate(list);
          }
        },
        (error) => {
          console.warn('[Firestore] Providers sync offline fallback:', error.message);
        }
      );
      return unsub;
    } catch {
      return () => {};
    }
  }

  async getProviders(sector?: Sector | 'all'): Promise<Provider[]> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.PROVIDERS);
      let list: Provider[] = cached ? JSON.parse(cached) : INITIAL_PROVIDERS;
      if (sector && sector !== 'all') {
        list = list.filter((p) => p.sector === sector);
      }
      return list;
    } catch {
      return INITIAL_PROVIDERS;
    }
  }

  async deleteProvider(id: string): Promise<void> {
    try {
      // Local cache update
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.PROVIDERS);
      if (cached) {
        const list: Provider[] = JSON.parse(cached);
        const filtered = list.filter((p) => p.id !== id);
        await AsyncStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(filtered));
      }
      // Cloud update
      await deleteDoc(doc(db, 'professionals', id));
    } catch (e) {
      console.warn('[Firestore] deleteProvider fallback error:', e);
    }
  }

  async savePendingProvider(provider: Partial<Provider>): Promise<void> {
    const id = 'prov_' + Date.now();
    const newProvider: Provider = {
      id,
      name: provider.name || '',
      nick: provider.nick || '',
      prof: provider.prof || '',
      sector: provider.sector || 'crafts',
      category: provider.category || provider.prof || '',
      village: provider.village || '',
      street: provider.street || '',
      phone: provider.phone || '',
      phoneWa: provider.phoneWa || provider.phone || '',
      rating: 5.0,
      reviews: 0,
      isAvailable: true,
      verified: false,
      price: provider.price || 'حسب الاتفاق',
      exp: provider.exp || 'خبرة معتمدة',
      specialty: provider.specialty || '',
      tools: provider.tools || ['🔧', '⚡', '🔨'],
      lat: provider.lat,
      lng: provider.lng,
      mapUrl: provider.mapUrl,
      photo: provider.photo,
      photos: provider.photos || [],
      createdAt: Date.now(),
    };

    // Save locally
    const cached = await AsyncStorage.getItem(STORAGE_KEYS.PROVIDERS);
    const list: Provider[] = cached ? JSON.parse(cached) : INITIAL_PROVIDERS;
    list.unshift(newProvider);
    await AsyncStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(list));

    // Try cloud write
    try {
      await setDoc(doc(db, 'pending_professionals', id), {
        ...newProvider,
        cloudSubmittedAt: serverTimestamp(),
      });
      await setDoc(doc(db, 'professionals', id), newProvider);
    } catch (e) {
      console.warn('[Firestore] savePendingProvider cloud error:', e);
    }
  }

  // ─── AUTHENTICATION & USERS ───
  async isPhoneBlocked(phone: string): Promise<boolean> {
    const cleanPhone = phone.replace(/\D/g, '');
    try {
      const docSnap = await getDoc(doc(db, 'blocked_phones', cleanPhone));
      return docSnap.exists();
    } catch {
      return false;
    }
  }

  async getUser(phone: string): Promise<User | null> {
    const cleanPhone = phone.replace(/\D/g, '');
    try {
      // Check local storage
      const usersStr = await AsyncStorage.getItem('jeely_users');
      if (usersStr) {
        const users: User[] = JSON.parse(usersStr);
        const local = users.find((u) => u.phone.replace(/\D/g, '') === cleanPhone);
        if (local) return local;
      }

      // Check cloud
      const snap = await getDoc(doc(db, 'users', cleanPhone));
      if (snap.exists()) {
        return snap.data() as User;
      }
    } catch (e) {
      console.warn('[Firestore] getUser error:', e);
    }
    return null;
  }

  async saveUser(user: User): Promise<void> {
    const cleanPhone = user.phone.replace(/\D/g, '');
    const cleanUser = { ...user, phone: cleanPhone };

    // Save locally
    const usersStr = await AsyncStorage.getItem('jeely_users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    const index = users.findIndex((u) => u.phone === cleanPhone);
    if (index >= 0) {
      users[index] = cleanUser;
    } else {
      users.push(cleanUser);
    }
    await AsyncStorage.setItem('jeely_users', JSON.stringify(users));
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(cleanUser));

    // Save to Firestore
    try {
      await setDoc(doc(db, 'users', cleanPhone), {
        name: cleanUser.name,
        phone: cleanUser.phone,
        createdAt: cleanUser.createdAt,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('[Firestore] saveUser cloud error:', e);
    }
  }

  // ─── FAVORITES (المفضلة) ───
  async getUserFavorites(phone: string): Promise<string[]> {
    const cleanPhone = phone.replace(/\D/g, '');
    try {
      const cached = await AsyncStorage.getItem(`${STORAGE_KEYS.FAVORITES}_${cleanPhone}`);
      if (cached) return JSON.parse(cached);

      const snap = await getDoc(doc(db, 'users', cleanPhone, 'data', 'favorites'));
      if (snap.exists()) {
        const favs = snap.data().list || [];
        await AsyncStorage.setItem(`${STORAGE_KEYS.FAVORITES}_${cleanPhone}`, JSON.stringify(favs));
        return favs;
      }
    } catch (e) {
      console.warn('[Firestore] getUserFavorites error:', e);
    }
    return [];
  }

  async saveUserFavorites(phone: string, favorites: string[]): Promise<void> {
    const cleanPhone = phone.replace(/\D/g, '');
    await AsyncStorage.setItem(`${STORAGE_KEYS.FAVORITES}_${cleanPhone}`, JSON.stringify(favorites));

    try {
      await setDoc(doc(db, 'users', cleanPhone, 'data', 'favorites'), {
        list: favorites,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('[Firestore] saveUserFavorites cloud error:', e);
    }
  }

  subscribeUserFavorites(phone: string, onUpdate: (favs: string[]) => void): () => void {
    const cleanPhone = phone.replace(/\D/g, '');
    this.getUserFavorites(cleanPhone).then(onUpdate);

    try {
      const docRef = doc(db, 'users', cleanPhone, 'data', 'favorites');
      return onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          const list = snap.data().list || [];
          onUpdate(list);
          AsyncStorage.setItem(`${STORAGE_KEYS.FAVORITES}_${cleanPhone}`, JSON.stringify(list));
        }
      });
    } catch {
      return () => {};
    }
  }

  // ─── APPOINTMENTS (المواعيد والحجوزات) ───
  async getUserAppointments(phone: string): Promise<Appointment[]> {
    const cleanPhone = phone.replace(/\D/g, '');
    try {
      const cached = await AsyncStorage.getItem(`${STORAGE_KEYS.APPOINTMENTS}_${cleanPhone}`);
      if (cached) return JSON.parse(cached);

      const q = query(
        collection(db, 'users', cleanPhone, 'appointments'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const list: Appointment[] = [];
      snap.forEach((d) => list.push({ ...(d.data() as Appointment), id: d.id }));
      if (list.length > 0) {
        await AsyncStorage.setItem(`${STORAGE_KEYS.APPOINTMENTS}_${cleanPhone}`, JSON.stringify(list));
      }
      return list;
    } catch (e) {
      console.warn('[Firestore] getUserAppointments error:', e);
    }
    return [];
  }

  async saveUserAppointment(phone: string, appt: Appointment): Promise<void> {
    const cleanPhone = phone.replace(/\D/g, '');
    const id = String(appt.id || Date.now());
    const completeAppt: Appointment = {
      ...appt,
      id,
      createdAt: appt.createdAt || Date.now(),
      status: appt.status || 'pending',
    };

    // Save in local storage
    const list = await this.getUserAppointments(cleanPhone);
    list.unshift(completeAppt);
    await AsyncStorage.setItem(`${STORAGE_KEYS.APPOINTMENTS}_${cleanPhone}`, JSON.stringify(list));

    // Save in user subcollection and global collection for provider
    try {
      await setDoc(doc(db, 'users', cleanPhone, 'appointments', id), completeAppt);
      await setDoc(doc(db, 'appointments', id), {
        ...completeAppt,
        clientPhone: cleanPhone,
        serverCreatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('[Firestore] saveUserAppointment cloud error:', e);
    }
  }

  async cancelAppointment(phone: string, apptId: string | number): Promise<void> {
    const cleanPhone = phone.replace(/\D/g, '');
    const idStr = String(apptId);

    // Update local cache
    const list = await this.getUserAppointments(cleanPhone);
    const updated = list.map((a) => (String(a.id) === idStr ? { ...a, status: 'cancelled' as const } : a));
    await AsyncStorage.setItem(`${STORAGE_KEYS.APPOINTMENTS}_${cleanPhone}`, JSON.stringify(updated));

    // Cloud updates
    try {
      await updateDoc(doc(db, 'users', cleanPhone, 'appointments', idStr), {
        status: 'cancelled',
      });
      await updateDoc(doc(db, 'appointments', idStr), {
        status: 'cancelled',
      });
    } catch (e) {
      console.warn('[Firestore] cancelAppointment cloud error:', e);
    }
  }

  subscribeUserAppointments(phone: string, onUpdate: (appts: Appointment[]) => void): () => void {
    const cleanPhone = phone.replace(/\D/g, '');
    this.getUserAppointments(cleanPhone).then(onUpdate);

    try {
      const colRef = collection(db, 'users', cleanPhone, 'appointments');
      return onSnapshot(colRef, (snap) => {
        const list: Appointment[] = [];
        snap.forEach((d) => list.push({ ...(d.data() as Appointment), id: d.id }));
        if (list.length > 0) {
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          onUpdate(list);
          AsyncStorage.setItem(`${STORAGE_KEYS.APPOINTMENTS}_${cleanPhone}`, JSON.stringify(list));
        }
      });
    } catch {
      return () => {};
    }
  }

  // ─── RATINGS (نظام التقييم) ───
  async submitRating(
    providerId: string,
    rating: number,
    comment: string,
    userPhone: string,
    userName: string
  ): Promise<Provider | null> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.PROVIDERS);
      if (!cached) return null;
      const list: Provider[] = JSON.parse(cached);
      const index = list.findIndex((p) => p.id === providerId);
      if (index === -1) return null;

      const provider = list[index];
      const prevRating = Number(provider.rating) || 5.0;
      const prevReviews = Number(provider.reviews) || 0;
      const newReviews = prevReviews + 1;
      const newRating = Number(((prevRating * prevReviews + rating) / newReviews).toFixed(1));

      provider.rating = newRating;
      provider.reviews = newReviews;
      list[index] = provider;
      await AsyncStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(list));

      // Save to Firestore
      try {
        await updateDoc(doc(db, 'professionals', providerId), {
          rating: newRating,
          reviews: newReviews,
        });
        const reviewDoc: Review = {
          id: 'rev_' + Date.now(),
          craftId: providerId,
          userPhone: userPhone.replace(/\D/g, ''),
          userName,
          rating,
          comment,
          createdAt: Date.now(),
        };
        await setDoc(doc(db, 'professionals', providerId, 'reviews', reviewDoc.id), reviewDoc);
      } catch (err) {
        console.warn('[Firestore] submitRating cloud update error:', err);
      }

      return provider;
    } catch (e) {
      console.warn('[Firestore] submitRating error:', e);
      return null;
    }
  }

  // ─── IN-APP CHAT (الدردشة الحية) ───
  subscribeChatMessages(chatId: string, onUpdate: (messages: ChatMessage[]) => void): () => void {
    // 1. Load locally
    AsyncStorage.getItem(`jeely_chat_${chatId}`).then((c) => {
      if (c) onUpdate(JSON.parse(c));
    });

    try {
      const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp', 'asc'));
      return onSnapshot(q, (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((d) => msgs.push({ ...(d.data() as ChatMessage), id: d.id }));
        if (msgs.length > 0) {
          AsyncStorage.setItem(`jeely_chat_${chatId}`, JSON.stringify(msgs));
          onUpdate(msgs);
        }
      });
    } catch {
      return () => {};
    }
  }

  async sendChatMessage(chatId: string, message: ChatMessage, meta: Partial<ChatMeta>): Promise<void> {
    // 1. Save locally
    const cStr = await AsyncStorage.getItem(`jeely_chat_${chatId}`);
    const msgs: ChatMessage[] = cStr ? JSON.parse(cStr) : [];
    msgs.push(message);
    await AsyncStorage.setItem(`jeely_chat_${chatId}`, JSON.stringify(msgs));

    // 2. Cloud update
    try {
      await setDoc(doc(db, 'chats', chatId, 'messages', message.id), message);
      await setDoc(
        doc(db, 'chats', chatId),
        {
          ...meta,
          lastMessage: message.text,
          updatedAt: message.timestamp,
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('[Firestore] sendChatMessage cloud error:', e);
    }
  }

  // ─── COMPLAINTS (الشكاوى وبلاغات الجودة) ───
  async submitComplaint(complaint: Complaint): Promise<void> {
    const id = String(complaint.id || Date.now());
    // Store locally
    const stored = await AsyncStorage.getItem('jeely_complaints');
    const list: Complaint[] = stored ? JSON.parse(stored) : [];
    list.unshift({ ...complaint, id });
    await AsyncStorage.setItem('jeely_complaints', JSON.stringify(list));

    // Cloud store
    try {
      await setDoc(doc(db, 'complaints', id), {
        ...complaint,
        id,
        cloudCreatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('[Firestore] submitComplaint cloud error:', e);
    }
  }
}

export const firestoreService = new FirestoreService();
