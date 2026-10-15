import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment } from '../types';
import { useAuth } from './AuthContext';
import { firestoreService } from '../services/firestoreService';

interface AppointmentsContextType {
  appointments: Appointment[];
  isLoading: boolean;
  bookAppointment: (
    appt: Omit<Appointment, 'id' | 'code' | 'status' | 'createdAt'>
  ) => Promise<{ success: boolean; appointment?: Appointment; message: string }>;
  cancelAppointment: (id: string | number) => Promise<boolean>;
}

const AppointmentsContext = createContext<AppointmentsContextType>({
  appointments: [],
  isLoading: false,
  bookAppointment: async () => ({ success: false, message: '' }),
  cancelAppointment: async () => false,
});

export const AppointmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    if (user?.phone) {
      setIsLoading(true);
      unsub = firestoreService.subscribeUserAppointments(user.phone, (list) => {
        setAppointments(list);
        setIsLoading(false);
      });
    } else {
      AsyncStorage.getItem('jeely_appointments_guest').then((str) => {
        if (str) setAppointments(JSON.parse(str));
        else setAppointments([]);
      });
    }

    return () => {
      if (unsub) unsub();
    };
  }, [user]);

  const bookAppointment = async (
    apptData: Omit<Appointment, 'id' | 'code' | 'status' | 'createdAt'>
  ) => {
    const code = '#NB-' + Math.floor(1000 + Math.random() * 9000);
    const id = Date.now().toString();

    const fullAppt: Appointment = {
      ...apptData,
      id,
      code,
      status: 'pending',
      createdAt: Date.now(),
    };

    if (user?.phone) {
      await firestoreService.saveUserAppointment(user.phone, fullAppt);
    } else {
      const stored = await AsyncStorage.getItem('jeely_appointments_guest');
      const list: Appointment[] = stored ? JSON.parse(stored) : [];
      list.unshift(fullAppt);
      await AsyncStorage.setItem('jeely_appointments_guest', JSON.stringify(list));
      setAppointments(list);
    }

    return {
      success: true,
      appointment: fullAppt,
      message: `⟁ تم تأكيد الحجز برقم كود (${code})! يرجى الانتظار لحين تأكيد الصنايعي.`,
    };
  };

  const cancelAppointment = async (id: string | number) => {
    if (user?.phone) {
      await firestoreService.cancelAppointment(user.phone, id);
    } else {
      const updated = appointments.map((a) =>
        String(a.id) === String(id) ? { ...a, status: 'cancelled' as const } : a
      );
      setAppointments(updated);
      await AsyncStorage.setItem('jeely_appointments_guest', JSON.stringify(updated));
    }
    return true;
  };

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        isLoading,
        bookAppointment,
        cancelAppointment,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointments = () => useContext(AppointmentsContext);
