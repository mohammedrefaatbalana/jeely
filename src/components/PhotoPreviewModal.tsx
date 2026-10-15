import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors, Shadows, BorderRadius } from '../constants/theme';

interface PhotoPreviewModalProps {
  visible: boolean;
  photoUrl: string;
  title: string;
  onClose: () => void;
}

export const PhotoPreviewModal: React.FC<PhotoPreviewModalProps> = ({
  visible,
  photoUrl,
  title,
  onClose,
}) => {
  if (!photoUrl) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕ إغلاق</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>
            📷 {title}
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: photoUrl }} style={styles.image} resizeMode="contain" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 160, 23, 0.4)',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.goldLight,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  closeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  closeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.md,
  },
});
