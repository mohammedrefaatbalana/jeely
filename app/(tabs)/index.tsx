import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Linking,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { SectorSwitcher } from '../../src/components/SectorSwitcher';
import { WelcomeChoiceModal } from '../../src/components/WelcomeChoiceModal';
import { SearchFilterBar } from '../../src/components/SearchFilterBar';
import { SynergyBanner } from '../../src/components/SynergyBanner';
import { ProviderCard } from '../../src/components/ProviderCard';
import { BookingModal } from '../../src/components/BookingModal';
import { RatingModal } from '../../src/components/RatingModal';
import { WorksGalleryModal } from '../../src/components/WorksGalleryModal';
import { PhotoPreviewModal } from '../../src/components/PhotoPreviewModal';
import { SiteQrModal } from '../../src/components/SiteQrModal';
import { AuthModal } from '../../src/components/AuthModal';
import { Colors } from '../../src/constants/theme';
import { Provider, Sector } from '../../src/types';
import { firestoreService } from '../../src/services/firestoreService';
import { useSector } from '../../src/context/SectorContext';

export default function DirectoryScreen() {
  const router = useRouter();
  const { sector, setSector, showWelcomeModal, openWelcomeModal, closeWelcomeModal, selectGateway } =
    useSector();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Modals state
  const [siteQrVisible, setSiteQrVisible] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);
  const [activeBookingProvider, setActiveBookingProvider] = useState<Provider | null>(null);
  const [activeRateProvider, setActiveRateProvider] = useState<Provider | null>(null);
  const [activeGalleryProvider, setActiveGalleryProvider] = useState<Provider | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    // Subscribe to real-time providers list
    const unsub = firestoreService.subscribeProviders((list) => {
      setProviders(list);
    });
    return () => unsub();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const list = await firestoreService.getProviders();
    setProviders(list);
    setRefreshing(false);
  };

  // Counts
  const craftsCount = useMemo(
    () => providers.filter((p) => p.sector === 'crafts').length,
    [providers]
  );
  const profsCount = useMemo(
    () => providers.filter((p) => p.sector === 'profs').length,
    [providers]
  );

  // Filtered list
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      // 1. Sector filter
      if (sector !== 'all' && p.sector !== sector) {
        return false;
      }
      // 2. Search query (matches name, nickname, prof, specialty, or village)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesNick = p.nick.toLowerCase().includes(q);
        const matchesProf = p.prof.toLowerCase().includes(q);
        const matchesSpecialty = (p.specialty || '').toLowerCase().includes(q);
        const matchesVillage = p.village.toLowerCase().includes(q);
        if (!matchesName && !matchesNick && !matchesProf && !matchesSpecialty && !matchesVillage) {
          return false;
        }
      }
      // 3. Profession filter
      if (selectedProfession && !p.prof.includes(selectedProfession) && !(p.category || '').includes(selectedProfession)) {
        return false;
      }
      // 4. Village filter
      if (selectedVillage && !p.village.includes(selectedVillage)) {
        return false;
      }

      return true;
    });
  }, [providers, sector, searchQuery, selectedProfession, selectedVillage]);

  // Card Action Handlers
  const handleOpenChat = (p: Provider) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: p.id, nick: p.nick, name: p.name, prof: p.prof, village: p.village, photo: p.photo || '' },
    });
  };

  const handleOpenBook = (p: Provider) => {
    setActiveBookingProvider(p);
  };

  const handleOpenRate = (p: Provider) => {
    setActiveRateProvider(p);
  };

  const handleOpenGallery = (p: Provider) => {
    setActiveGalleryProvider(p);
  };

  const handleOpenPhotoPreview = (url: string, name: string) => {
    setPreviewPhoto({ url, title: name });
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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />
        }
      >
        {/* Header */}
        <Header
          onOpenSiteQr={() => setSiteQrVisible(true)}
          onOpenAuth={() => setAuthVisible(true)}
          onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
          notificationsEnabled={notificationsEnabled}
        />

        {/* Sector Switcher (الصنائع vs المحترفين NPL) */}
        <SectorSwitcher
          currentSector={sector}
          onSelectSector={setSector}
          craftsCount={craftsCount}
          profsCount={profsCount}
          onOpenGatewayModal={openWelcomeModal}
        />

        {/* Search & Categorized Filters */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedProfession={selectedProfession}
          onProfessionChange={setSelectedProfession}
          selectedVillage={selectedVillage}
          onVillageChange={setSelectedVillage}
        />

        {/* Synergy Banner: ترابط جييلي */}
        <SynergyBanner />

        {/* Providers Section */}
        <View style={styles.listSection}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.listHeaderCount}>{filteredProviders.length} متوفر</Text>
            <Text style={styles.listHeaderTitle}>
              {sector === 'crafts'
                ? '🔨 صنايعية وفنيو النوبة'
                : sector === 'profs'
                ? '🩺 نخبة المحترفين والاستشارات NPL'
                : '🌟 جميع المهن والخدمات'}
            </Text>
          </View>

          {filteredProviders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>لا توجد نتائج مطابقة</Text>
              <Text style={styles.emptyDesc}>
                لم نجد أي مقدم خدمة مطابق للبحث الحالي. جرب تغيير القرية أو التخصص.
              </Text>
              <TouchableOpacity
                style={styles.btnResetFilters}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedProfession('');
                  setSelectedVillage('');
                  setSector('all');
                }}
              >
                <Text style={styles.btnResetFiltersText}>إعادة ضبط كل الفلاتر</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredProviders.map((p) => (
              <ProviderCard
                key={p.id}
                provider={p}
                onOpenChat={handleOpenChat}
                onOpenBook={handleOpenBook}
                onOpenRate={handleOpenRate}
                onOpenGallery={handleOpenGallery}
                onOpenPhotoPreview={handleOpenPhotoPreview}
                onOpenMap={handleOpenMap}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Welcome Gateway Choice Modal */}
      <WelcomeChoiceModal
        visible={showWelcomeModal}
        onSelect={selectGateway}
        onClose={closeWelcomeModal}
      />

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

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <PhotoPreviewModal
          visible={!!previewPhoto}
          photoUrl={previewPhoto.url}
          title={previewPhoto.title}
          onClose={() => setPreviewPhoto(null)}
        />
      )}

      {/* Site QR Share Modal */}
      <SiteQrModal visible={siteQrVisible} onClose={() => setSiteQrVisible(false)} />

      {/* Client Auth Modal */}
      <AuthModal visible={authVisible} onClose={() => setAuthVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.emeraldDark,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.sandBg,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  listSection: {
    marginHorizontal: 16,
    marginTop: 6,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: Colors.emeraldDark,
  },
  listHeaderCount: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    marginTop: 10,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.emeraldDark,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  btnResetFilters: {
    backgroundColor: Colors.emerald,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  btnResetFiltersText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
});
