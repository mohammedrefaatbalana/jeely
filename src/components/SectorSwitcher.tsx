import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Shadows, BorderRadius } from '../constants/theme';
import { Sector } from '../types';

interface SectorSwitcherProps {
  currentSector: Sector | 'all';
  onSelectSector: (sector: Sector) => void;
  craftsCount: number;
  profsCount: number;
  onOpenGatewayModal?: () => void;
}

export const SectorSwitcher: React.FC<SectorSwitcherProps> = ({
  currentSector,
  onSelectSector,
  craftsCount,
  profsCount,
  onOpenGatewayModal,
}) => {
  const isCrafts = currentSector === 'crafts';
  const isProfs = currentSector === 'profs';

  return (
    <View style={styles.container}>
      {/* Switcher Buttons Box */}
      <View style={styles.tabBox}>
        {/* Craftsmen Tab */}
        <TouchableOpacity
          style={[styles.tabButton, isCrafts && styles.tabButtonActive]}
          onPress={() => onSelectSector('crafts')}
          activeOpacity={0.85}
        >
          <Text style={styles.tabIcon}>🔨</Text>
          <Text style={[styles.tabText, isCrafts && styles.tabTextActive]}>
            الصنائع والحرف
          </Text>
          <View style={[styles.badge, isCrafts ? styles.badgeActive : styles.badgeInactive]}>
            <Text style={[styles.badgeText, isCrafts && styles.badgeTextActive]}>
              {craftsCount}
            </Text>
          </View>
        </TouchableOpacity>

        {/* NPL Professionals Tab */}
        <TouchableOpacity
          style={[styles.tabButton, isProfs && styles.tabButtonActive]}
          onPress={() => onSelectSector('profs')}
          activeOpacity={0.85}
        >
          <Text style={styles.tabIcon}>🩺</Text>
          <Text style={[styles.tabText, isProfs && styles.tabTextActive]}>
            المحترفين NPL
          </Text>
          <View style={[styles.badge, isProfs ? styles.badgeActive : styles.badgeInactive]}>
            <Text style={[styles.badgeText, isProfs && styles.badgeTextActive]}>
              {profsCount}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Sector Description Pill */}
      <View style={styles.descRow}>
        <View style={styles.descTextWrap}>
          <Text style={styles.descTitle}>
            {isCrafts
              ? '🔨 قسم الصنائع والحرف الفنية'
              : '🩺 نخبة المحترفين والاستشارات NPL'}
          </Text>
          <Text style={styles.descSubtitle}>
            {isCrafts
              ? 'مطابخ ألومنيوم • سباكة • كهرباء • نجارة • نقاشة • تكييف'
              : 'أطباء • مهندسون • معلمون • محامون • محاسبون'}
          </Text>
        </View>

        {onOpenGatewayModal && (
          <TouchableOpacity
            style={styles.btnSwitchModal}
            onPress={onOpenGatewayModal}
            activeOpacity={0.8}
          >
            <Text style={styles.btnSwitchModalText}>🔄 البوابات</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  tabBox: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.gold,
    padding: 4,
    ...Shadows.sm,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: Colors.emerald,
    ...Shadows.sm,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.white,
    fontWeight: '900',
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  badgeActive: {
    backgroundColor: Colors.gold,
  },
  badgeInactive: {
    backgroundColor: 'rgba(15, 76, 58, 0.08)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.textMuted,
  },
  badgeTextActive: {
    color: Colors.emeraldDark,
  },
  descRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.goldSoft,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  descTextWrap: {
    flex: 1,
  },
  descTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.emeraldDark,
    textAlign: 'right',
  },
  descSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 2,
  },
  btnSwitchModal: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginLeft: 8,
  },
  btnSwitchModalText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.emeraldDark,
  },
});
