import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { NubianMural } from '../../src/components/NubianMural';
import { BookingModal } from '../../src/components/BookingModal';
import { RatingModal } from '../../src/components/RatingModal';
import { PhotoPreviewModal } from '../../src/components/PhotoPreviewModal';
import { Colors, Shadows, BorderRadius } from '../../src/constants/theme';
import { Provider } from '../../src/types';
import { firestoreService } from '../../src/services/firestoreService';
import { useFavorites } from '../../src/context/FavoritesContext';

export default function ProviderProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  useEffect(() => {
    loadProvider();
  }, [id]);

  const loadProvider = async () => {
    const list = await firestoreService.getProviders();
    const found = list.find((p) => p.id === id);
    if (found) {
      setProvider(found);
    }
  };

  if (!provider) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>جاري تحميل بيانات المهني...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isFav = isFavorite(provider.id);
  const isCraft = provider.sector === 'crafts';

  const handleCall = () => {
    if (provider.phone) {
      Linking.openURL(`tel:${provider.phone}`).catch(() => {
        Alert.alert('تنبيه', 'تعذر إجراء المكالمة الهاتفية');
      });
    }
  };

  const handleChat = () => {
    router.push({
      pathname: '/chat/[id]',
      params: {
        id: provider.id,
        nick: provider.nick,
        name: provider.name,
        prof: provider.prof,
        village: provider.village,
        photo: provider.photo || '',
      },
    });
  };

  const handleOpenMap = () => {
    const queryLocation = provider.mapUrl
      ? provider.mapUrl
      : provider.lat && provider.lng
      ? `https://maps.google.com/?q=${provider.lat},${provider.lng}`
      : `https://maps.google.com/?q=${encodeURIComponent(provider.village + ' ' + provider.street)}`;

    Linking.openURL(queryLocation).catch(() => {
      Alert.alert('تنبيه', 'تعذر فتح خرائط جوجل على الجهاز');
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <NubianMural height={14} />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBtn}>
            <Text style={styles.headerIconBtnText}>← رجوع</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{provider.nick}</Text>

          <TouchableOpacity
            onPress={() => toggleFavorite(provider.id)}
            style={[styles.headerIconBtn, isFav && styles.headerFavActive]}
          >
            <Text style={styles.headerIconBtnText}>{isFav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.goldBottomBorder} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Profile Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.avatarWrap}>
            {provider.photo ? (
              <Image source={{ uri: provider.photo }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarPlaceholder}>{isCraft ? '👷' : '🩺'}</Text>
            )}
          </View>

          <Text style={styles.name}>⟁ {provider.name}</Text>
          <View style={styles.nickPill}>
            <Text style={styles.nickText}>“{provider.nick}”</Text>
          </View>

          <Text style={styles.profTitle}>
            {isCraft ? '🔨' : '🩺'} {provider.prof}
          </Text>

          <View style={styles.badgesRow}>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>🛡️ موثق بالبطاقة والعنوان</Text>
            </View>
            <View style={styles.villageBadge}>
              <Text style={styles.villageText}>🏝️ من ({provider.village})</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                provider.isAvailable ? styles.statusAvail : styles.statusBusy,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  provider.isAvailable ? styles.statusTextAvail : styles.statusTextBusy,
                ]}
              >
                {provider.isAvailable ? '🟢 متاح للعمل' : '🔴 غير متاح حالياً'}
              </Text>
            </View>
          </View>

          {/* Rating Display */}
          <TouchableOpacity
            style={styles.ratingRow}
            onPress={() => setRatingModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.ratingValue}>{provider.rating.toFixed(1)}</Text>
            <Text style={styles.reviewsCount}>({provider.reviews} تقييم حقيقي) • اضغط للتقييم ⭐</Text>
          </TouchableOpacity>
        </View>

        {/* Promotional Offer Banner if present */}
        {provider.offer?.active && (
          <View style={styles.offerCard}>
            <View style={styles.offerBadge}>
              <Text style={styles.offerBadgeText}>🔥 {provider.offer.badge || 'عرض خاص'}</Text>
            </View>
            <Text style={styles.offerText}>{provider.offer.title}</Text>
          </View>
        )}

        {/* Details Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📋 معلومات الخدمة والتسعير</Text>

          {provider.price ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>التسعيرة التقريبية:</Text>
              <Text style={styles.detailVal}>💰 {provider.price}</Text>
            </View>
          ) : null}

          {provider.exp ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>سنوات الخبرة:</Text>
              <Text style={styles.detailVal}>💼 {provider.exp}</Text>
            </View>
          ) : null}

          {provider.specialty ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>التخصص الدقيق:</Text>
              <Text style={styles.detailVal}>{provider.specialty}</Text>
            </View>
          ) : null}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>العنوان بالتفصيل:</Text>
            <Text style={styles.detailVal}>
              📍 {provider.village} - {provider.street}
            </Text>
          </View>

          {provider.tools && provider.tools.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>الأدوات والمعدات:</Text>
              <View style={styles.toolsRow}>
                {provider.tools.map((t, idx) => (
                  <Text key={idx} style={styles.toolBadge}>
                    {t}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Works Portfolio Section */}
        {provider.photos && provider.photos.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>📷 معرض سابقة الأعمال</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
              {provider.photos.map((url, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.galleryThumb}
                  onPress={() => setPreviewPhoto(url)}
                >
                  <Image source={{ uri: url }} style={styles.galleryImg} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Actions Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.btnBottom, styles.btnCall]} onPress={handleCall}>
          <Text style={styles.btnBottomText}>📞 اتصال</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnBottom, styles.btnChat]} onPress={handleChat}>
          <Text style={styles.btnBottomText}>💬 محادثة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnBottom, styles.btnBook]}
          onPress={() => setBookingModalVisible(true)}
        >
          <Text style={[styles.btnBottomText, styles.btnBookText]}>📅 حجز موعد</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnBottom, styles.btnMap]} onPress={handleOpenMap}>
          <Text style={styles.btnBottomText}>📍 لوكيشن</Text>
        </TouchableOpacity>
      </View>

      {/* Booking Modal */}
      <BookingModal
        visible={bookingModalVisible}
        provider={provider}
        onClose={() => setBookingModalVisible(false)}
      />

      {/* Rating Modal */}
      <RatingModal
        visible={ratingModalVisible}
        provider={provider}
        onClose={() => setRatingModalVisible(false)}
        onRatingSubmitted={(up) => setProvider(up)}
      />

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <PhotoPreviewModal
          visible={!!previewPhoto}
          photoUrl={previewPhoto}
          title={provider.nick}
          onClose={() => setPreviewPhoto(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.emeraldDark,
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.sandBg,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.emeraldDark,
  },
  header: {
    backgroundColor: Colors.emeraldDark,
    ...Shadows.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.goldLight,
  },
  headerIconBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  headerFavActive: {
    backgroundColor: '#FFE4E6',
  },
  headerIconBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  goldBottomBorder: {
    height: 3,
    backgroundColor: Colors.gold,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.sandBg,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
    gap: 12,
  },
  heroCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.gold,
    padding: 20,
    alignItems: 'center',
    ...Shadows.sm,
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    borderWidth: 3,
    borderColor: Colors.gold,
    overflow: 'hidden',
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    ...Shadows.goldGlow,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    fontSize: 38,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.emeraldDark,
  },
  nickPill: {
    backgroundColor: '#FFE4B5',
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginTop: 4,
  },
  nickText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4A3200',
  },
  profTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textMain,
    marginTop: 8,
  },
  badgesRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    justifyContent: 'center',
  },
  verifiedBadge: {
    backgroundColor: '#EBF5FF',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  villageBadge: {
    backgroundColor: Colors.goldSoft,
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  villageText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: Colors.emeraldDark,
  },
  statusBadge: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
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
    fontSize: 10.5,
    fontWeight: '800',
  },
  statusTextAvail: {
    color: Colors.availGreen,
  },
  statusTextBusy: {
    color: Colors.busyRed,
  },
  ratingRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.goldSoft,
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginTop: 12,
    gap: 6,
  },
  starIcon: {
    color: Colors.gold,
    fontSize: 14,
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#856404',
  },
  reviewsCount: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  offerCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    padding: 10,
    gap: 8,
  },
  offerBadge: {
    backgroundColor: Colors.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  offerBadgeText: {
    color: Colors.white,
    fontSize: 10.5,
    fontWeight: '900',
  },
  offerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#78350F',
    flex: 1,
    textAlign: 'right',
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    padding: 16,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.emeraldDark,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: Colors.goldSoft,
    paddingBottom: 6,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginVertical: 4,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textMain,
    flex: 1,
    textAlign: 'left',
    marginLeft: 8,
  },
  toolsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  toolBadge: {
    fontSize: 14,
  },
  galleryScroll: {
    marginTop: 8,
  },
  galleryThumb: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    overflow: 'hidden',
    marginLeft: 8,
  },
  galleryImg: {
    width: '100%',
    height: '100%',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 2,
    borderTopColor: Colors.gold,
    flexDirection: 'row-reverse',
    padding: 10,
    gap: 6,
    ...Shadows.md,
  },
  btnBottom: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  btnBottomText: {
    color: Colors.white,
    fontSize: 12,
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
});
