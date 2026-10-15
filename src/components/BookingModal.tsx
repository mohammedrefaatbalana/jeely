import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Colors, Shadows, BorderRadius } from '../constants/theme';
import { Provider } from '../types';
import { useAppointments } from '../context/AppointmentsContext';
import { useAuth } from '../context/AuthContext';

interface BookingModalProps {
  visible: boolean;
  provider: Provider | null;
  onClose: () => void;
  onSuccess?: (code: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  provider,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { bookAppointment } = useAppointments();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddr, setCustAddr] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    if (visible) {
      // Default to today and next hour
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);

      const nextH = (today.getHours() + 1) % 24;
      setTime(`${String(nextH).padStart(2, '0')}:00`);

      if (user) {
        setCustName(user.name);
        setCustPhone(user.phone);
      }
      setDateError('');
    }
  }, [visible, user]);

  const validateFutureTime = (dateStr: string, timeStr: string): boolean => {
    if (!dateStr || !timeStr) return false;
    const [y, m, d] = dateStr.split('-').map(Number);
    const [h, min] = timeStr.split(':').map(Number);
    const chosen = new Date(y, m - 1, d, h || 0, min || 0);
    const now = new Date();
    if (chosen <= now) {
      setDateError('⚠️ يجب اختيار موعد وتوقيت مستقبلي لم يمر بعد!');
      return false;
    }
    setDateError('');
    return true;
  };

  const handleDateChange = (val: string) => {
    setDate(val);
    validateFutureTime(val, time);
  };

  const handleTimeChange = (val: string) => {
    setTime(val);
    validateFutureTime(date, val);
  };

  const handleConfirm = async () => {
    if (!provider) return;

    if (!validateFutureTime(date, time)) {
      Alert.alert('تنبيه', 'الرجاء اختيار موعد وتوقيت مستقبلي صالح!');
      return;
    }

    if (!custName.trim() || !custPhone.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال اسم العميل ورقم الهاتف للتواصل');
      return;
    }

    setIsSubmitting(true);
    try {
      const [y, m, d] = date.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const formattedDay = dateObj.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const [h, min] = time.split(':').map(Number);
      const ampm = (h || 0) >= 12 ? 'م' : 'ص';
      const h12 = (h || 0) % 12 || 12;
      const formattedTime = `${h12}:${String(min || 0).padStart(2, '0')} ${ampm}`;

      const res = await bookAppointment({
        craftId: provider.id,
        craftNick: provider.nick,
        day: formattedDay,
        time: formattedTime,
        rawDate: date,
        rawTime: time,
        custName: custName.trim(),
        custPhone: custPhone.trim(),
        custAddr: custAddr.trim() || 'عنوان العميل بالاتفاق',
        notes: notes.trim(),
      });

      if (res.success && res.appointment) {
        Alert.alert('تم تأكيد الحجز! ⟁', res.message);
        onClose();
        if (onSuccess) onSuccess(res.appointment.code);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!provider) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <Text style={styles.modalTitle}>📅 حجز موعد مع {provider.nick}</Text>
            <Text style={styles.modalSubtitle}>
              {provider.prof} • قرية ({provider.village})
            </Text>

            {/* Time Slot Inputs */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>تاريخ الموعد (YYYY-MM-DD):</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={handleDateChange}
                placeholder="2026-10-16"
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                textAlign="center"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>توقيت الحجز (HH:MM بتوقيت 24س):</Text>
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={handleTimeChange}
                placeholder="14:00"
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                textAlign="center"
              />
            </View>

            {/* Common Time Slot Quick Chips */}
            <View style={styles.slotChipsRow}>
              {['10:00', '12:00', '16:00', '18:00', '20:00'].map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slotChip, time === slot && styles.slotChipActive]}
                  onPress={() => handleTimeChange(slot)}
                >
                  <Text style={[styles.slotChipText, time === slot && styles.slotChipTextActive]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

            {/* Client Info */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>اسم العميل الكريم *:</Text>
              <TextInput
                style={styles.input}
                value={custName}
                onChangeText={setCustName}
                placeholder="الاسم بالكامل"
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                textAlign="right"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>رقم الهاتف للتواصل *:</Text>
              <TextInput
                style={styles.input}
                value={custPhone}
                onChangeText={setCustPhone}
                placeholder="010XXXXXXXX"
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                keyboardType="phone-pad"
                textAlign="right"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>العنوان أو مكان الزيارة بالتفصيل:</Text>
              <TextInput
                style={styles.input}
                value={custAddr}
                onChangeText={setCustAddr}
                placeholder="مثال: أسوان - حي العقاد - عمارة 4"
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                textAlign="right"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>ملاحظات أو تفاصيل المشكلة (اختياري):</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="اكتب أي تفاصيل تفيد المهني قبل الحضور..."
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                multiline
                numberOfLines={3}
                textAlign="right"
              />
            </View>

            {/* Actions */}
            <TouchableOpacity
              style={[styles.btnConfirm, isSubmitting && styles.btnDisabled]}
              onPress={handleConfirm}
              disabled={isSubmitting}
            >
              <Text style={styles.btnConfirmText}>
                {isSubmitting ? 'جاري التأكيد...' : 'تأكيد الحجز الآن ⟁'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>إلغاء</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFDF8',
    borderRadius: BorderRadius.md,
    borderWidth: 2.5,
    borderColor: Colors.gold,
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
    ...Shadows.md,
  },
  scrollContent: {
    padding: 18,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.emeraldDark,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 11.5,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  fieldGroup: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.emeraldDark,
    textAlign: 'right',
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.textMain,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  slotChipsRow: {
    flexDirection: 'row-reverse',
    gap: 6,
    marginBottom: 10,
    justifyContent: 'center',
  },
  slotChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.gold,
    backgroundColor: Colors.white,
  },
  slotChipActive: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  slotChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.emerald,
  },
  slotChipTextActive: {
    color: Colors.white,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  btnConfirm: {
    backgroundColor: Colors.emerald,
    borderRadius: BorderRadius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    ...Shadows.sm,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnConfirmText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
  btnCancel: {
    backgroundColor: '#E5E7EB',
    borderRadius: BorderRadius.sm,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  btnCancelText: {
    color: '#374151',
    fontSize: 11.5,
    fontWeight: '700',
  },
});
