import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, Shadows, BorderRadius } from '../constants/theme';
import { Provider } from '../types';
import { useAuth } from '../context/AuthContext';
import { firestoreService } from '../services/firestoreService';

interface RatingModalProps {
  visible: boolean;
  provider: Provider | null;
  onClose: () => void;
  onRatingSubmitted: (updatedProvider: Provider) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  provider,
  onClose,
  onRatingSubmitted,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!provider) return null;

  const handleSubmit = async () => {
    if (!confirmed) {
      Alert.alert('تنبيه', 'يرجى التأكيد على أنه تم التعامل والتواصل الفعلي مع مقدم الخدمة أولاً.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await firestoreService.submitRating(
        provider.id,
        rating,
        comment.trim(),
        user?.phone || '01000000000',
        user?.name || 'عميل جِيلِي'
      );

      if (updated) {
        Alert.alert(
          'شكراً لتقييمك! ⭐',
          `تم تسجيل تقييمك (${rating} نجوم) بنجاح! أصبح متوسط تقييم ${provider.nick}: ${updated.rating} ★`
        );
        onRatingSubmitted(updated);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>⭐ تقييم الأسطى {provider.nick}</Text>
          <Text style={styles.subtitle}>
            رأيك يهم مجتمعنا النوبي ويساعد في رفع جودة الخدمات
          </Text>

          {/* Star selector */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setRating(s)}
                activeOpacity={0.7}
                style={styles.starTouch}
              >
                <Text style={[styles.starIcon, s <= rating && styles.starIconActive]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>
            {rating === 5
              ? 'ممتاز جداً 🌟🌟🌟🌟🌟'
              : rating === 4
              ? 'جيد جداً 👍'
              : rating === 3
              ? 'متوسط'
              : 'يحتاج تحسين'}
          </Text>

          {/* Comment */}
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="اكتب تعليقك وتجربتك مع الصنايعي..."
            placeholderTextColor="rgba(20, 32, 27, 0.4)"
            multiline
            numberOfLines={3}
            textAlign="right"
          />

          {/* Confirmation Checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setConfirmed(!confirmed)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, confirmed && styles.checkboxActive]}>
              {confirmed && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              أؤكد أنه تم التواصل والتعامل الفعلي مع مقدم الخدمة
            </Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.btnSubmit, isSubmitting && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.btnSubmitText}>
              {isSubmitting ? 'جاري إرسال التقييم...' : 'إرسال التقييم ⭐'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
            <Text style={styles.btnCancelText}>إلغاء</Text>
          </TouchableOpacity>
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
    maxWidth: 400,
    ...Shadows.md,
  },
  title: {
    fontSize: 16.5,
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
  starsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 8,
  },
  starTouch: {
    padding: 4,
  },
  starIcon: {
    fontSize: 34,
    color: '#D1D5DB',
  },
  starIconActive: {
    color: Colors.gold,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.emeraldDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    padding: 10,
    minHeight: 70,
    textAlignVertical: 'top',
    fontSize: 12.5,
    color: Colors.textMain,
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkboxActive: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  checkMark: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 11,
    color: Colors.textMain,
    fontWeight: '700',
    textAlign: 'right',
  },
  btnSubmit: {
    backgroundColor: Colors.emerald,
    borderRadius: BorderRadius.sm,
    paddingVertical: 12,
    alignItems: 'center',
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
    marginTop: 6,
  },
  btnCancelText: {
    color: '#374151',
    fontSize: 11.5,
    fontWeight: '700',
  },
});
