import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Colors, Shadows, BorderRadius } from '../constants/theme';
import { Provider } from '../types';

interface WorksGalleryModalProps {
  visible: boolean;
  provider: Provider | null;
  onClose: () => void;
  onSelectPhoto: (url: string) => void;
}

export const WorksGalleryModal: React.FC<WorksGalleryModalProps> = ({
  visible,
  provider,
  onClose,
  onSelectPhoto,
}) => {
  if (!provider) return null;

  const photos = provider.photos || [];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>إغلاق ✕</Text>
            </TouchableOpacity>
            <View style={styles.titleCol}>
              <Text style={styles.title}>📷 معرض أعمال {provider.nick}</Text>
              <Text style={styles.subtitle}>{provider.prof} • نماذج من أرض الواقع</Text>
            </View>
          </View>

          {/* Grid / Content */}
          <ScrollView contentContainerStyle={styles.content}>
            {photos.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyIcon}>🖼️</Text>
                <Text style={styles.emptyTitle}>لا توجد صور مضافة بعد</Text>
                <Text style={styles.emptyDesc}>
                  لم يقم الصنايعي برفع صور لأعماله حتى الآن. يمكن للصنايعي رفع صور أعماله ومشاريع الشغل من خلال بوابته الشخصية 🛠️
                </Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {photos.map((src, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.gridItem}
                    onPress={() => onSelectPhoto(src)}
                    activeOpacity={0.85}
                  >
                    <Image source={{ uri: src }} style={styles.gridImg} resizeMode="cover" />
                    <View style={styles.zoomBadge}>
                      <Text style={styles.zoomText}>🔍 تكبير</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFDF8',
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    borderWidth: 2.5,
    borderColor: Colors.gold,
    maxHeight: '82%',
    paddingBottom: 20,
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.goldSoft,
  },
  titleCol: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.emeraldDark,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 13,
    color: Colors.terracotta,
    fontWeight: '800',
  },
  content: {
    padding: 16,
  },
  emptyBox: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    padding: 24,
    alignItems: 'center',
    marginVertical: 12,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.emeraldDark,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 11.5,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
    ...Shadows.sm,
  },
  gridImg: {
    width: '100%',
    height: '100%',
  },
  zoomBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  zoomText: {
    color: Colors.white,
    fontSize: 9.5,
    fontWeight: '800',
  },
});
