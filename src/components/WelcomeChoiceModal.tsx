import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors, Shadows, BorderRadius } from '../constants/theme';
import { Sector } from '../types';

interface WelcomeChoiceModalProps {
  visible: boolean;
  onSelect: (sector: Sector) => void;
  onClose: () => void;
}

export const WelcomeChoiceModal: React.FC<WelcomeChoiceModalProps> = ({
  visible,
  onSelect,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.iconRing}>
            <Text style={styles.iconText}>⟁</Text>
          </View>
          <Text style={styles.modalTitle}>مرحباً بك في جِـيلِي</Text>
          <Text style={styles.modalSubtitle}>
            دليل المهن والخدمات الشامل لأهل النوبة في كل مصر
          </Text>
          <Text style={styles.promptText}>
            اختر البوابة التي تود تصفحها أولاً:
          </Text>

          {/* Option 1: Craftsmen */}
          <TouchableOpacity
            style={styles.choiceBtn}
            onPress={() => onSelect('crafts')}
            activeOpacity={0.85}
          >
            <View style={styles.choiceIconWrap}>
              <Text style={styles.choiceIcon}>🔨</Text>
            </View>
            <View style={styles.choiceInfo}>
              <Text style={styles.choiceTitle}>بوابة الصنائع والحرف الفنية</Text>
              <Text style={styles.choiceDesc}>
                مطابخ ألومنيوم • سباكة • كهرباء • نجارة • نقاشة • تكييف
              </Text>
            </View>
          </TouchableOpacity>

          {/* Option 2: NPL Professionals */}
          <TouchableOpacity
            style={[styles.choiceBtn, styles.choiceBtnProfs]}
            onPress={() => onSelect('profs')}
            activeOpacity={0.85}
          >
            <View style={[styles.choiceIconWrap, styles.choiceIconWrapProfs]}>
              <Text style={styles.choiceIcon}>🩺</Text>
            </View>
            <View style={styles.choiceInfo}>
              <Text style={styles.choiceTitle}>بوابة المحترفين والخبراء NPL</Text>
              <Text style={styles.choiceDesc}>
                أطباء • مهندسون • معلمون • محامون • محاسبون • مبرمجون
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnDismiss} onPress={onClose}>
            <Text style={styles.btnDismissText}>تصفح الكل مباشرة ✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 27, 20, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: Colors.emeraldDark,
    borderRadius: BorderRadius.lg,
    borderWidth: 2.5,
    borderColor: Colors.gold,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    ...Shadows.goldGlow,
  },
  iconRing: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(212, 160, 23, 0.2)',
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 30,
    color: Colors.goldLight,
    fontWeight: '900',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.goldLight,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#E2F1EC',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '700',
  },
  promptText: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 14,
    textAlign: 'center',
  },
  choiceBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.md,
    padding: 14,
    width: '100%',
    marginBottom: 12,
    gap: 12,
  },
  choiceBtnProfs: {
    borderColor: Colors.goldLight,
  },
  choiceIconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceIconWrapProfs: {
    backgroundColor: Colors.nileBlue,
  },
  choiceIcon: {
    fontSize: 24,
  },
  choiceInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  choiceTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'right',
  },
  choiceDesc: {
    fontSize: 11,
    color: '#E2F1EC',
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 3,
  },
  btnDismiss: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  btnDismissText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
