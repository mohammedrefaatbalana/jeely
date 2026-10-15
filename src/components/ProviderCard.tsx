import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { Colors, Shadows, BorderRadius } from '../constants/theme';
import { Provider } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

interface ProviderCardProps {
  provider: Provider;
  onOpenChat: (provider: Provider) => void;
  onOpenBook: (provider: Provider) => void;
  onOpenRate: (provider: Provider) => void;
  onOpenGallery: (provider: Provider) => void;
  onOpenPhotoPreview: (photoUrl: string, name: string) => void;
  onOpenMap: (provider: Provider) => void;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  onOpenChat,
  onOpenBook,
  onOpenRate,
  onOpenGallery,
  onOpenPhotoPreview,
  onOpenMap,
  isAdmin = false,
  onDelete,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const isFav = isFavorite(provider.id);
  const isCraft = provider.sector === 'crafts';

  const handleCall = () => {
    if (provider.phone) {
      Linking.openURL(`tel:${provider.phone}`).catch(() => {
        Alert.alert('تنبيه', 'تعذر إجراء المكالمة الهاتفية');
      });
    }
  };

  const handleFavPress = async () => {
    await toggleFavorite(provider.id);
  };

  const defaultAvatar = isCraft ? '👷' : '🩺';

  return (
    <View style={[styles.card, isCraft ? styles.cardCraft : styles.cardProf]}>
      {/* Promotional Offer Banner if Active */}
      {provider.offer?.active && (
        <View style={styles.offerBanner}>
          <View style={styles.offerPill}>
            <Text style={styles.offerPillText}>🔥 {provider.offer.badge || 'عرض خاص'}</Text>
          </View>
          <Text style={styles.offerTitle} numberOfLines={1}>
            {provider.offer.title}
          </Text>
        </View>
      )}

      {/* Top Header Row */}
      <View style={styles.cardTop}>
        {/* Avatar */}
        <TouchableOpacity
          style={styles.avatarWrap}
          onPress={() => {
            if (provider.photo) {
              onOpenPhotoPreview(provider.photo, provider.nick);
            }
          }}
          activeOpacity={provider.photo ? 0.7 : 1}
        >
          {provider.photo ? (
            <Image source={{ uri: provider.photo }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarIcon}>{defaultAvatar}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Center Info */}
        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text style={styles.providerName}>⟁ {provider.name}</Text>
            {provider.village ? (
              <View style={styles.villagePill}>
                <Text style={styles.villagePillText}>🏝️ ({provider.village})</Text>
              </View>
            ) : null}
            <Text style={styles.verifiedShield}>🛡️</Text>
          </View>

          <View style={styles.tagRow}>
            <View style={styles.nickTag}>
              <Text style={styles.nickText}>{provider.nick}</Text>
            </View>
            <View
              style={[
                styles.statusPill,
                provider.isAvailable ? styles.statusAvail : styles.statusBusy,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  provider.isAvailable ? styles.statusTextAvail : styles.statusTextBusy,
                ]}
              >
                {provider.isAvailable ? '🟢 متاح الآن' : '🔴 مشغول'}
              </Text>
            </View>
          </View>

          <Text style={styles.profText}>
            {isCraft ? '🔨' : '🩺'} {provider.prof}
          </Text>
        </View>

        {/* End Actions: Favorite & Rating */}
        <View style={styles.topEndCol}>
          <View style={styles.favAndRateRow}>
            <TouchableOpacity
              style={styles.btnStarRate}
              onPress={() => onOpenRate(provider)}
              activeOpacity={0.7}
            >
              <Text style={styles.starBtnIcon}>⭐</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnFav, isFav && styles.btnFavActive]}
              onPress={handleFavPress}
              activeOpacity={0.7}
            >
              <Text style={styles.favIcon}>{isFav ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.ratingBadge}
            onPress={() => onOpenRate(provider)}
            activeOpacity={0.8}
          >
            <Text style={styles.starText}>★</Text>
            <Text style={styles.ratingNum}>
              {provider.rating.toFixed(1)} ({provider.reviews})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Specialty or Experience Pill if present */}
      {(provider.exp || provider.price) && (
        <View style={styles.expPriceRow}>
          {provider.exp ? (
            <View style={styles.expPill}>
              <Text style={styles.expPillText}>💼 {provider.exp}</Text>
            </View>
          ) : null}
          {provider.price ? (
            <View style={styles.pricePill}>
              <Text style={styles.pricePillText}>💰 {provider.price}</Text>
            </View>
          ) : null}
          {provider.tools && provider.tools.length > 0 ? (
            <View style={styles.toolsWrap}>
              {provider.tools.map((t, idx) => (
                <Text key={idx} style={styles.toolIcon}>
                  {t}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      )}

      {/* Address Box */}
      <View style={styles.addressBox}>
        <Text style={styles.addressText}>
          📍 <Text style={styles.addressBold}>العنوان: </Text>
          {provider.village} - {provider.street || 'العنوان متاح بالتفصيل'}
        </Text>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={[styles.btnAction, styles.btnCall]} onPress={handleCall}>
          <Text style={styles.btnActionText}>📞 اتصل</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnAction, styles.btnChat]}
          onPress={() => onOpenChat(provider)}
        >
          <Text style={styles.btnActionText}>💬 دردشة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnAction, styles.btnBook]}
          onPress={() => onOpenBook(provider)}
        >
          <Text style={[styles.btnActionText, styles.btnBookText]}>📅 حجز</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnAction, styles.btnMap]}
          onPress={() => onOpenMap(provider)}
        >
          <Text style={styles.btnActionText}>📍 لوك</Text>
        </TouchableOpacity>

        {isCraft && (
          <TouchableOpacity
            style={[styles.btnAction, styles.btnWorks]}
            onPress={() => onOpenGallery(provider)}
          >
            <Text style={styles.btnActionText}>📷 أعمالي</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Admin Action Bar */}
      {isAdmin && onDelete && (
        <View style={styles.adminBar}>
          <Text style={styles.adminBarText}>⚙️ لوحة الإدارة</Text>
          <TouchableOpacity
            style={styles.adminDelBtn}
            onPress={() => onDelete(provider.id)}
          >
            <Text style={styles.adminDelBtnText}>حذف مقدم الخدمة</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 160, 23, 0.35)',
    borderRightWidth: 6,
    ...Shadows.sm,
  },
  cardCraft: {
    borderRightColor: Colors.gold,
  },
  cardProf: {
    borderRightColor: Colors.nileBlue,
  },
  offerBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    padding: 6,
    marginBottom: 10,
    gap: 8,
  },
  offerPill: {
    backgroundColor: Colors.terracotta,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  offerPillText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  offerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#78350F',
    flex: 1,
    textAlign: 'right',
  },
  cardTop: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 10,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.gold,
    overflow: 'hidden',
    backgroundColor: '#FFF8E1',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 26,
  },
  infoCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  nameRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  providerName: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.emeraldDark,
    textAlign: 'right',
  },
  villagePill: {
    backgroundColor: Colors.goldSoft,
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  villagePillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: Colors.emeraldDark,
  },
  verifiedShield: {
    fontSize: 12,
  },
  tagRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  nickTag: {
    backgroundColor: '#FFE4B5',
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
  nickText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4A3200',
  },
  statusPill: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderWidth: 1,
  },
  statusAvail: {
    backgroundColor: Colors.availGreenBg,
    borderColor: '#A5D6A7',
  },
  statusBusy: {
    backgroundColor: Colors.busyRedBg,
    borderColor: '#FFCDD2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusTextAvail: {
    color: Colors.availGreen,
  },
  statusTextBusy: {
    color: Colors.busyRed,
  },
  profText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: Colors.textMain,
    marginTop: 4,
    textAlign: 'right',
  },
  topEndCol: {
    alignItems: 'flex-start',
    gap: 6,
  },
  favAndRateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnStarRate: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#FDE047',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  starBtnIcon: {
    fontSize: 14,
  },
  btnFav: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#F3C5CD',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  btnFavActive: {
    backgroundColor: '#FFF0F2',
    borderColor: '#FF4757',
  },
  favIcon: {
    fontSize: 14,
  },
  ratingBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.goldSoft,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    gap: 3,
  },
  starText: {
    color: Colors.gold,
    fontSize: 12,
  },
  ratingNum: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#856404',
  },
  expPriceRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  expPill: {
    backgroundColor: '#F5E6CC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  expPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMain,
  },
  pricePill: {
    backgroundColor: Colors.nileLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  pricePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.nileBlue,
  },
  toolsWrap: {
    flexDirection: 'row',
    gap: 4,
  },
  toolIcon: {
    fontSize: 12,
  },
  addressBox: {
    backgroundColor: '#FFFDF5',
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.sm,
    padding: 8,
    marginTop: 8,
  },
  addressText: {
    fontSize: 11.5,
    lineHeight: 18,
    color: Colors.textMain,
    textAlign: 'right',
  },
  addressBold: {
    fontWeight: '900',
    color: Colors.emeraldDark,
  },
  actionsGrid: {
    flexDirection: 'row-reverse',
    gap: 5,
    marginTop: 10,
  },
  btnAction: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  btnActionText: {
    color: Colors.white,
    fontSize: 10.5,
    fontWeight: '900',
  },
  btnCall: {
    backgroundColor: Colors.emerald,
  },
  btnChat: {
    backgroundColor: Colors.nileBlue,
  },
  btnBook: {
    backgroundColor: Colors.gold,
  },
  btnBookText: {
    color: '#1A2823',
  },
  btnMap: {
    backgroundColor: '#2563EB',
  },
  btnWorks: {
    backgroundColor: '#7C3AED',
  },
  adminBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.goldSoft,
    padding: 6,
    borderRadius: BorderRadius.sm,
    marginTop: 8,
  },
  adminBarText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.emeraldDark,
  },
  adminDelBtn: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  adminDelBtnText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
});
