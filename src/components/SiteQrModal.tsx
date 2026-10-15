import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { Colors, Shadows, BorderRadius } from '../constants/theme';

interface SiteQrModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SiteQrModal: React.FC<SiteQrModalProps> = ({ visible, onClose }) => {
  const [copied, setCopied] = useState(false);
  const appUrl = 'https://jeely-app.vercel.app';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `حمل واستخدم تطبيق جِيلِي (JEELY) — دليل المهن والخدمات الشامل لأهل النوبة:\n${appUrl}`,
        url: appUrl,
        title: 'تطبيق جِيلِي للخدمات النوبية',
      });
    } catch {
      // Ignored
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>📱 مشاركة تطبيق جِـيلِي</Text>
          <Text style={styles.subtitle}>
            امسح الباركود بكاميرا الموبايل لفتح وتحميل التطبيق مباشرة
          </Text>

          {/* Stylized QR Card */}
          <View style={styles.qrContainer}>
            <Svg width={180} height={180} viewBox="0 0 100 100">
              {/* Background */}
              <Rect width="100" height="100" fill="#FFFFFF" rx="4" />
              {/* Corner markers */}
              <Rect x="5" y="5" width="25" height="25" fill="#0A3D2E" rx="3" />
              <Rect x="9" y="9" width="17" height="17" fill="#FFFFFF" rx="2" />
              <Rect x="13" y="13" width="9" height="9" fill="#D4A017" rx="1" />

              <Rect x="70" y="5" width="25" height="25" fill="#0A3D2E" rx="3" />
              <Rect x="74" y="9" width="17" height="17" fill="#FFFFFF" rx="2" />
              <Rect x="78" y="13" width="9" height="9" fill="#D4A017" rx="1" />

              <Rect x="5" y="70" width="25" height="25" fill="#0A3D2E" rx="3" />
              <Rect x="9" y="74" width="17" height="17" fill="#FFFFFF" rx="2" />
              <Rect x="13" y="78" width="9" height="9" fill="#D4A017" rx="1" />

              {/* Data Blocks */}
              <Rect x="35" y="10" width="6" height="6" fill="#0A3D2E" />
              <Rect x="45" y="10" width="6" height="12" fill="#D4A017" />
              <Rect x="55" y="10" width="6" height="6" fill="#0A3D2E" />
              <Rect x="35" y="25" width="12" height="6" fill="#0A3D2E" />
              <Rect x="52" y="25" width="12" height="6" fill="#D4A017" />
              <Rect x="10" y="38" width="8" height="8" fill="#D4A017" />
              <Rect x="25" y="38" width="8" height="8" fill="#0A3D2E" />
              <Rect x="40" y="38" width="20" height="20" fill="#0A3D2E" rx="4" />
              <Rect x="46" y="44" width="8" height="8" fill="#D4A017" />
              <Rect x="68" y="38" width="8" height="8" fill="#0A3D2E" />
              <Rect x="82" y="38" width="8" height="8" fill="#D4A017" />
              <Rect x="35" y="65" width="8" height="8" fill="#0A3D2E" />
              <Rect x="50" y="65" width="14" height="6" fill="#D4A017" />
              <Rect x="70" y="65" width="8" height="14" fill="#0A3D2E" />
              <Rect x="82" y="65" width="8" height="6" fill="#0A3D2E" />
              <Rect x="35" y="80" width="15" height="8" fill="#0A3D2E" />
              <Rect x="55" y="78" width="10" height="10" fill="#D4A017" />
            </Svg>
            <Text style={styles.qrLabel}>جِـيلِي • JEELY 2026</Text>
          </View>

          {/* Link Box */}
          <View style={styles.linkBox}>
            <Text style={styles.linkText} numberOfLines={1}>
              {appUrl}
            </Text>
          </View>

          {/* Share Action */}
          <TouchableOpacity style={styles.btnShare} onPress={handleShare}>
            <Text style={styles.btnShareText}>📤 مشاركة الرابط مع الأصدقاء</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnClose} onPress={onClose}>
            <Text style={styles.btnCloseText}>إغلاق</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
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
    maxWidth: 380,
    alignItems: 'center',
    ...Shadows.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.emeraldDark,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  qrContainer: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.md,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
    ...Shadows.sm,
  },
  qrLabel: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '900',
    color: Colors.emeraldDark,
    letterSpacing: 1,
  },
  linkBox: {
    backgroundColor: Colors.goldSoft,
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '100%',
    marginBottom: 12,
  },
  linkText: {
    fontSize: 12,
    color: Colors.emeraldDark,
    fontWeight: '800',
    textAlign: 'center',
  },
  btnShare: {
    backgroundColor: Colors.emerald,
    borderRadius: BorderRadius.sm,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 6,
    ...Shadows.sm,
  },
  btnShareText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
  btnClose: {
    backgroundColor: '#E5E7EB',
    borderRadius: BorderRadius.sm,
    paddingVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  btnCloseText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '700',
  },
});
