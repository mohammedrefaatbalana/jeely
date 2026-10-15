import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { firestoreService } from '../services/firestoreService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, pass: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, phone: string, pass: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false, message: '' }),
  register: async () => ({ success: false, message: '' }),
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem('jeely_current_user');
      if (stored) {
        const u: User = JSON.parse(stored);
        setUser(u);
      }
    } catch {
      // Ignored
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, pass: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      return { success: false, message: 'يرجى إدخال رقم الهاتف بشكل صحيح' };
    }

    const isBlocked = await firestoreService.isPhoneBlocked(cleanPhone);
    if (isBlocked) {
      return { success: false, message: '🚫 هذا الرقم محظور من استخدام التطبيق بقرار من الإدارة' };
    }

    const existingUser = await firestoreService.getUser(cleanPhone);
    if (!existingUser) {
      return { success: false, message: '❌ لم يتم العثور على حساب بهذا الرقم. يرجى إنشاء حساب جديد.' };
    }

    if (existingUser.password && existingUser.password !== pass) {
      return { success: false, message: '❌ كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.' };
    }

    setUser(existingUser);
    await AsyncStorage.setItem('jeely_current_user', JSON.stringify(existingUser));
    return { success: true, message: `أهلاً بك مجدداً يا ${existingUser.name} 🌴` };
  };

  const register = async (name: string, phone: string, pass: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (!name.trim() || !cleanPhone || !pass.trim()) {
      return { success: false, message: 'يرجى إكمال جميع الحقول المطلوبة' };
    }

    const isBlocked = await firestoreService.isPhoneBlocked(cleanPhone);
    if (isBlocked) {
      return { success: false, message: '🚫 هذا الرقم محظور من التسجيل بقرار من الإدارة' };
    }

    const existingUser = await firestoreService.getUser(cleanPhone);
    if (existingUser) {
      return { success: false, message: '⚠️ هذا الرقم مسجل بالفعل، يرجى تسجيل الدخول مباشرة.' };
    }

    const newUser: User = {
      name: name.trim(),
      phone: cleanPhone,
      password: pass.trim(),
      createdAt: Date.now(),
    };

    await firestoreService.saveUser(newUser);
    setUser(newUser);
    await AsyncStorage.setItem('jeely_current_user', JSON.stringify(newUser));
    return { success: true, message: `🎉 مرحباً بك يا ${name}! تم إنشاء حسابك بنجاح` };
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('jeely_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
