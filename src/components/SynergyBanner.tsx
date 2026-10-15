import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Shadows, BorderRadius } from '../constants/theme';

export const SynergyBanner: React.FC = () => {
  return (
    <View style={styles.banner}>
      <View style={styles.contentRow}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>⟁</Text>
        </View>
        <View style={styles.textWrap}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>ترابط جِـيلِي (Jeely Synergy)</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>مشروع متكامل</Text>
            </View>
          </View>
          <Text style={styles.desc}>
            مهندسة الديكور تحتاج نجار ونقاش من نفس المنصة — جِيلِي يربط المحترف الأكاديمي بالصنايعي الماهر في مشروع واحد متكامل لحفظ حقوق الجميع.
          </Text>
          <View style={styles.teamPillRow}>
            <View style={styles.teamPill}>
              <Text style={styles.teamPillText}>👷‍♀️ مهندسة + 🪚 نجار + 🎨 نقاش</Text>
            </View>
            <View style={styles.guaranteePill}>
              <Text style={styles.guaranteePillText}>🛡️ إشراف وضمان نوبي</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.black,
    borderRadius: BorderRadius.md,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    ...Shadows.goldGlow,
  },
  contentRow: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
    color: Colors.black,
    fontWeight: '900',
  },
  textWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '900',
    color: Colors.goldLight,
    textAlign: 'right',
  },
  tag: {
    backgroundColor: 'rgba(212, 160, 23, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  tagText: {
    color: Colors.goldLight,
    fontSize: 9.5,
    fontWeight: '800',
  },
  desc: {
    fontSize: 11,
    color: '#E2F1EC',
    lineHeight: 16,
    textAlign: 'right',
    marginTop: 4,
  },
  teamPillRow: {
    flexDirection: 'row-reverse',
    gap: 6,
    marginTop: 8,
  },
  teamPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  teamPillText: {
    color: Colors.white,
    fontSize: 9.5,
    fontWeight: '800',
  },
  guaranteePill: {
    backgroundColor: 'rgba(212, 160, 23, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  guaranteePillText: {
    color: Colors.goldLight,
    fontSize: 9.5,
    fontWeight: '800',
  },
});
