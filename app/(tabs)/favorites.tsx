import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { NubianMural } from '../../src/components/NubianMural';
import { ProviderCard } from '../../src/components/ProviderCard';
import { BookingModal } from '../../src/components/BookingModal';
import { RatingModal } from '../../src/components/RatingModal';
import { WorksGalleryModal } from '../../src/components/WorksGalleryModal';
import { PhotoPreviewModal } from '../../src/components/PhotoPreviewModal';
import { Colors, Shadows, BorderRadius } from '../../src/constants/theme';
import { Provider } from '../../src/types';
import { firestoreService } from '../../src/services/firestoreService';
import { useFavorites } from '../../src/context/FavoritesContext';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [providers, setProviders] = useState<Provider[]>([]);

  // Modals state
  const [activeBookingProvider, setActiveBookingProvider] = useState<Provider | null>(null);
  const [activeRateProvider, setActiveRateProvider] = useState<Provider | null>(null);
  const [activeGalleryProvider, setActiveGalleryProvider] = useState<Provider | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    const unsub = firestoreService.subscribeProviders((list) => {
      setProviders(list);
    });
    return () => unsub();
  }, []);

  const favoriteProviders = useMemo(() => {
    return providers.filter((p) => favorites.includes(p.id));
  }, [providers, favorites]);

  // Card Handlers
  const handleOpenChat = (p: Provider) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: p.id, nick: p.nick, name: p.name, prof: p.prof, village: p.village, photo: p.photo || '' },
    });
  };

  const handleOpenMap = (p: Provider) => {
    const queryLocation = p.mapUrl
      ? p.mapUrl
      : p.lat && p.lng
      ? `https://maps.google.com/?q=${p.lat},${p.lng}`
      : `https://maps.google.com/?q=${encodeURIComponent(p.village + ' ' + p.street)}`;

    Linking.openURL(queryLocation).catch(() => {
      Alert.alert('تنبيه', 'تعذر فتح خرائط جوجل على الجهاز');
    });
  };

  const handleRatingSubmitted = (updated: Provider) => {
    setProviders((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <NubianMural height={14} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>❤️ قائمة المفضلين</Text>
          <Text style={styles.headerSubtitle}>
            {favoriteProviders.length} مقدم خدمة محفوظ في قائمتك الخاصة
          </Text>
        </View>
        <View style={styles.goldBottomBorder} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {favoriteProviders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🤍</Text>
            <Text style={styles.emptyTitle}>قائمة المفضلين فارغة</Text>
            <Text style={styles.emptyDesc}>
              لم تقم بإضافة أي صنايعي أو محترف للمفضلة حتى الآن.{'\n'}
              اضغط على رمز القلب ❤️ بجانب أي مقدم خدمة في الدليل لحفظه هنا والوصول إليه سريعاً.
            </Text>
            <TouchableOpacity
              style={styles.btnExplore}
              onPress={() => router.push('/(tabs)')}
              activeOpacity={0.8}
            >
              <Text style={styles.btnExploreText}>تصفح الدليل الآن ⟁</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listWrap}>
            {favoriteProviders.map((p) => (
              <ProviderCard
                key={p.id}
                provider={p}
                onOpenChat={handleOpenChat}
                onOpenBook={(prov) => setActiveBookingProvider(prov)}
                onOpenRate={(prov) => setActiveRateProvider(prov)}
                onOpenGallery={(prov) => setActiveGalleryProvider(prov)}
                onOpenPhotoPreview={(url, name) => setPreviewPhoto({ url, title: name })}
                onOpenMap={handleOpenMap}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Booking Modal */}
      <BookingModal
        visible={!!activeBookingProvider}
        provider={activeBookingProvider}
        onClose={() => setActiveBookingProvider(null)}
      />

      {/* Rating Modal */}
      <RatingModal
        visible={!!activeRateProvider}
        provider={activeRateProvider}
        onClose={() => setActiveRateProvider(null)}
        onRatingSubmitted={handleRatingSubmitted}
      />

      {/* Works Gallery Modal */}
      <WorksGalleryModal
        visible={!!activeGalleryProvider}
        provider={activeGalleryProvider}
        onClose={() => setActiveGalleryProvider(null)}
        onSelectPhoto={(url) =>
          setPreviewPhoto({
            url,
            title: activeGalleryProvider ? activeGalleryProvider.nick : 'عمل منفذ',
          })
        }
      />

      {/* Photo Zoom Modal */}
      {previewPhoto && (
        <PhotoPreviewModal
          visible={!!previewPhoto}
          photoUrl={previewPhoto.url}
          title={previewPhoto.title}
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
  header: {
    backgroundColor: Colors.emeraldDark,
    ...Shadows.md,
  },
  headerContent: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: Colors.goldLight,
    fontWeight: '700',
    marginTop: 2,
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
    paddingBottom: 30,
  },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.gold,
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    marginTop: 20,
    ...Shadows.sm,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.emeraldDark,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  btnExplore: {
    backgroundColor: Colors.emerald,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: BorderRadius.sm,
    ...Shadows.sm,
  },
  btnExploreText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
  listWrap: {
    marginTop: 4,
  },
});
