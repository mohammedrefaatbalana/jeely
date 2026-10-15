import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors, Shadows, BorderRadius } from '../constants/theme';

interface ContractModalProps {
  visible: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  visible,
  onAccept,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>📜 وثيقة الأمان والعقد الإلكتروني</Text>
          <Text style={styles.subtitle}>
            تراث نوبي - لكل أبناء النوبة من أسوان إلى الإسكندرية
          </Text>

          <ScrollView style={styles.content}>
            <View style={styles.itemBox}>
              <Text style={styles.bullet}>⟁</Text>
              <Text style={styles.itemText}>
                <Text style={{ fontWeight: '900' }}>تطبيق جِـيلِي</Text>
                {' '}هو وسيط تعريفي مجتمعي غير هادف للربح يربط أصحاب المهن بالعملاء لحفظ الصنعة النوبية الأصيلة وتسهيل التواصل.
              </Text>
            </View>

            <View style={styles.itemBox}>
              <Text style={styles.bullet}>⟁</Text>
              <Text style={styles.itemText}>
                الاتفاق المالي ومواعيد التنفيذ تتم بالتراضي المباشر بين الطرفين وفقاً للأعراف المهنية النوبية.
              </Text>
            </View>

            <View style={styles.itemBox}>
              <Text style={styles.bullet}>⟁</Text>
              <Text style={styles.itemText}>
                جميع الحرفيين والمحترفين موثقون بالقرية واسم الشهرة واللوكيشن ورقم الهاتف المعتمد.
              </Text>
            </View>

            <View style={styles.itemBox}>
              <Text style={styles.bullet}>⟁</Text>
              <Text style={styles.itemText}>
                حرصاً على الأمان، يحق لإدارة المنصة حظر أي حساب يسيء المعاملة أو يثبت إخلاله بالتعهدات بعد مراجعة الشكاوى الواردة.
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.btnAccept} onPress={onAccept}>
            <Text style={styles.btnAcceptText}>موافق وأتعهد بالالتزام 🤝</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
    maxHeight: '80%',
    ...Shadows.md,
  },
  title: {
    fontSize: 17,
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
  content: {
    marginVertical: 10,
  },
  itemBox: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    backgroundColor: Colors.goldSoft,
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    padding: 10,
    marginBottom: 8,
    gap: 8,
  },
  bullet: {
    fontSize: 14,
    color: Colors.emerald,
    fontWeight: '900',
  },
  itemText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textMain,
    lineHeight: 18,
    textAlign: 'right',
    fontWeight: '600',
  },
  btnAccept: {
    backgroundColor: Colors.emerald,
    borderRadius: BorderRadius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    ...Shadows.sm,
  },
  btnAcceptText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
});
