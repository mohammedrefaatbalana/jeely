import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Colors, Shadows, BorderRadius } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, onSuccess }) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setPhone('');
    setPassword('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (tab === 'register' && !name.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال الاسم بالكامل');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال رقم الهاتف');
      return;
    }
    if (!password.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال كلمة المرور');
      return;
    }

    setIsSubmitting(true);
    try {
      if (tab === 'login') {
        const res = await login(phone, password);
        if (res.success) {
          Alert.alert('نجاح', res.message);
          handleClose();
          if (onSuccess) onSuccess();
        } else {
          Alert.alert('خطأ', res.message);
        }
      } else {
        const res = await register(name, phone, password);
        if (res.success) {
          Alert.alert('تهانينا', res.message);
          handleClose();
          if (onSuccess) onSuccess();
        } else {
          Alert.alert('خطأ', res.message);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header Title */}
          <Text style={styles.title}>
            {tab === 'login' ? '🔐 تسجيل دخول العميل' : '📝 إنشاء حساب عميل جديد'}
          </Text>
          <Text style={styles.subtitle}>
            لحفظ المفضلات، حجز المواعيد، والتواصل المباشر مع الصنايعية
          </Text>

          {/* Tabs Switcher */}
          <View style={styles.tabSwitch}>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'login' && styles.tabBtnActive]}
              onPress={() => setTab('login')}
            >
              <Text style={[styles.tabBtnText, tab === 'login' && styles.tabBtnTextActive]}>
                تسجيل الدخول
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, tab === 'register' && styles.tabBtnActive]}
              onPress={() => setTab('register')}
            >
              <Text style={[styles.tabBtnText, tab === 'register' && styles.tabBtnTextActive]}>
                حساب جديد
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {tab === 'register' && (
              <TextInput
                style={styles.input}
                placeholder="الاسم ثلاثي أو رباعي *"
                placeholderTextColor="rgba(20, 32, 27, 0.45)"
                value={name}
                onChangeText={setName}
                textAlign="right"
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="📱 رقم الهاتف المحمول *"
              placeholderTextColor="rgba(20, 32, 27, 0.45)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              textAlign="right"
            />

            <TextInput
              style={styles.input}
              placeholder="🔒 كلمة المرور *"
              placeholderTextColor="rgba(20, 32, 27, 0.45)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textAlign="right"
            />

            <TouchableOpacity
              style={[styles.btnSubmit, isSubmitting && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.btnSubmitText}>
                  {tab === 'login' ? 'دخول إلى حسابي' : 'إنشاء الحساب وتأكيد'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnCancel} onPress={handleClose}>
              <Text style={styles.btnCancelText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFDF8',
    borderRadius: BorderRadius.md,
    borderWidth: 2.5,
    borderColor: Colors.gold,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    ...Shadows.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.emeraldDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  tabSwitch: {
    flexDirection: 'row-reverse',
    backgroundColor: 'rgba(15, 76, 58, 0.08)',
    borderRadius: BorderRadius.sm,
    padding: 3,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tabBtnActive: {
    backgroundColor: Colors.emerald,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  tabBtnTextActive: {
    color: Colors.white,
    fontWeight: '900',
  },
  form: {
    gap: 10,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMain,
  },
  btnSubmit: {
    backgroundColor: Colors.emerald,
    borderRadius: BorderRadius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
    ...Shadows.sm,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnSubmitText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
  btnCancel: {
    backgroundColor: '#E5E7EB',
    borderRadius: BorderRadius.sm,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnCancelText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '700',
  },
});
