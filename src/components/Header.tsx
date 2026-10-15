import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NubianMural } from './NubianMural';
import { Colors, Shadows, BorderRadius } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenSiteQr: () => void;
  onOpenAuth: () => void;
  onToggleNotifications: () => void;
  notificationsEnabled?: boolean;
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSiteQr,
  onOpenAuth,
  onToggleNotifications,
  notificationsEnabled = false,
  isAdmin = false,
}) => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.headerWrapper}>
      <NubianMural height={16} />
      <View style={styles.inner}>
        {/* Top Branding Row */}
        <View style={styles.logoRow}>
          <View style={styles.iconCircle}>
            <Text style={styles.pyramidIcon}>⟁</Text>
          </View>
          <View style={styles.titlesWrap}>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>جِـ</Text>
              <Text style={styles.brandTitleGold}>ـيلِي</Text>
              <Text style={styles.brandEnglish}>JEELY</Text>
            </View>
            <Text style={styles.brandSlogan}>دليل المهن والخدمات الشامل • تراث نوبي أصيل</Text>
          </View>
        </View>

        {/* Action Badges Row */}
        <View style={styles.actionsRow}>
          {/* QR Code Share Pill */}
          <TouchableOpacity
            style={styles.actionPill}
            onPress={onOpenSiteQr}
            activeOpacity={0.8}
          >
            <Text style={styles.pillIcon}>📱</Text>
            <Text style={styles.pillText}>مشاركة التطبيق</Text>
          </TouchableOpacity>

          {/* Notifications Toggle Pill */}
          <TouchableOpacity
            style={[styles.actionPill, notificationsEnabled && styles.actionPillActive]}
            onPress={onToggleNotifications}
            activeOpacity={0.8}
          >
            <Text style={styles.pillIcon}>🔔</Text>
            <Text style={styles.pillText}>
              {notificationsEnabled ? 'الإشعارات مفعلة ✓' : 'تفعيل الإشعارات'}
            </Text>
          </TouchableOpacity>

          {/* User Account / Auth Pill */}
          {user ? (
            <TouchableOpacity
              style={[styles.actionPill, styles.userPill]}
              onPress={logout}
              activeOpacity={0.8}
            >
              <Text style={styles.pillIcon}>👤</Text>
              <Text style={styles.userPillText}>
                {user.name.split(' ')[0]} (خروج)
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionPill, styles.loginPill]}
              onPress={onOpenAuth}
              activeOpacity={0.8}
            >
              <Text style={styles.pillIcon}>🔐</Text>
              <Text style={styles.loginPillText}>دخول / حساب</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Admin Bar if Active */}
        {isAdmin && (
          <View style={styles.adminStatusBadge}>
            <Text style={styles.adminStatusText}>
              🛡️ وضع الإدارة مفعل • مرحباً أدمن جِيلِي
            </Text>
          </View>
        )}
      </View>
      <View style={styles.goldBottomBorder} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: Colors.emeraldDark,
    ...Shadows.md,
  },
  inner: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(212, 160, 23, 0.2)',
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.goldGlow,
  },
  pyramidIcon: {
    color: Colors.goldLight,
    fontSize: 22,
    fontWeight: '900',
  },
  titlesWrap: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  brandTitleGold: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.goldLight,
    letterSpacing: -0.5,
  },
  brandEnglish: {
    fontSize: 13,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.6)',
    marginRight: 8,
    letterSpacing: 2,
  },
  brandSlogan: {
    fontSize: 11,
    color: Colors.goldLight,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  actionPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  actionPillActive: {
    backgroundColor: '#16a34a',
    borderColor: '#86efac',
  },
  pillIcon: {
    fontSize: 12,
  },
  pillText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  userPill: {
    backgroundColor: Colors.goldSoft,
    borderColor: Colors.gold,
  },
  userPillText: {
    color: Colors.emeraldDark,
    fontSize: 11,
    fontWeight: '900',
  },
  loginPill: {
    backgroundColor: 'rgba(212, 160, 23, 0.25)',
    borderColor: Colors.goldLight,
  },
  loginPillText: {
    color: Colors.goldLight,
    fontSize: 11,
    fontWeight: '900',
  },
  adminStatusBadge: {
    marginTop: 8,
    backgroundColor: Colors.goldSoft,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  adminStatusText: {
    color: Colors.emeraldDark,
    fontSize: 10,
    fontWeight: '900',
  },
  goldBottomBorder: {
    height: 3,
    backgroundColor: Colors.gold,
    width: '100%',
  },
});
