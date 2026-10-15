import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { NubianMural } from '../../src/components/NubianMural';
import { Colors, Shadows, BorderRadius } from '../../src/constants/theme';
import { Sector } from '../../src/types';
import { firestoreService } from '../../src/services/firestoreService';

export default function JoinScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [nick, setNick] = useState('');
  const [prof, setProf] = useState('');
  const [sector, setSector] = useState<Sector>('crafts');
  const [village, setVillage] = useState('');
  const [street, setStreet] = useState('');
  const [phoneCall, setPhoneCall] = useState('');
  const [phoneWa, setPhoneWa] = useState('');
  const [price, setPrice] = useState('');
  const [exp, setExp] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [idCardUri, setIdCardUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  // Pick Personal Photo
  const handlePickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!res.canceled && res.assets[0].uri) {
      setPhotoUri(res.assets[0].uri);
    }
  };

  // Pick ID Card Photo
  const handlePickIdCard = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!res.canceled && res.assets[0].uri) {
      setIdCardUri(res.assets[0].uri);
    }
  };

  // Auto-detect GPS Location
  const handleUseMyLocation = async () => {
    setLocLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('إذن الموقع', 'يرجى تفعيل صلاحية الوصول للموقع الجغرافي من الإعدادات');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      setMapUrl(`https://maps.google.com/?q=${loc.coords.latitude},${loc.coords.longitude}`);
      Alert.alert('نجاح 📍', 'تم تحديد إحداثيات موقعك الجغرافي بدقة!');
    } catch {
      Alert.alert('خطأ', 'تعذر جلب الموقع الحالي، تأكد من تفعيل الـ GPS');
    } finally {
      setLocLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !nick.trim() || !prof.trim() || !village.trim() || !street.trim() || !phoneCall.trim()) {
      Alert.alert('تنبيه', 'جميع الحقول المميزة بعلامة (*) إجبارية لإتمام التسجيل!');
      return;
    }

    setIsSubmitting(true);
    try {
      await firestoreService.savePendingProvider({
        name: name.trim(),
        nick: nick.trim(),
        prof: prof.trim(),
        sector,
        category: prof.trim(),
        village: village.trim(),
        street: street.trim(),
        phone: phoneCall.trim(),
        phoneWa: phoneWa.trim() || phoneCall.trim(),
        price: price.trim() || 'حسب الاتفاق',
        exp: exp.trim() || 'خبرة معتمدة',
        specialty: specialty.trim() || prof.trim(),
        mapUrl: mapUrl.trim(),
        lat: coords.lat,
        lng: coords.lng,
        photo: photoUri || undefined,
        photos: photoUri ? [photoUri] : [],
      });

      Alert.alert(
        '✅ تم إرسال طلب الانضمام بنجاح!',
        'بمجرد مراجعة الإدارة للبيانات المسجلة والتحقق من التوثيق سيتم تفعيل حسابك وظهوره فوراً في دليل جِيلِي ⟁',
        [
          {
            text: 'حسناً',
            onPress: () => router.push('/(tabs)'),
          },
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <NubianMural height={14} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>➕ انضم كمهني في جِـيلِي</Text>
          <Text style={styles.headerSubtitle}>
            تسجيل صنايعي أو محترف جديد في الدليل النوبي الموحد
          </Text>
        </View>
        <View style={styles.goldBottomBorder} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formCard}>
          <Text style={styles.formSectionTitle}>📌 البيانات الأساسية للنشاط</Text>

          {/* Sector Selector */}
          <Text style={styles.label}>اختر قطاع العمل *:</Text>
          <View style={styles.sectorRow}>
            <TouchableOpacity
              style={[styles.sectorBtn, sector === 'crafts' && styles.sectorBtnActive]}
              onPress={() => setSector('crafts')}
            >
              <Text style={styles.sectorBtnIcon}>🔨</Text>
              <Text style={[styles.sectorBtnText, sector === 'crafts' && styles.sectorBtnTextActive]}>
                صنائع وحرف فنية
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sectorBtn, sector === 'profs' && styles.sectorBtnActive]}
              onPress={() => setSector('profs')}
            >
              <Text style={styles.sectorBtnIcon}>🩺</Text>
              <Text style={[styles.sectorBtnText, sector === 'profs' && styles.sectorBtnTextActive]}>
                محترفون واستشارات NPL
              </Text>
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <Text style={styles.label}>الاسم الرسمي رباعي *:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="الاسم بالكامل كما في البطاقة"
            placeholderTextColor="rgba(20, 32, 27, 0.4)"
            textAlign="right"
          />

          <Text style={styles.label}>اسم الشهرة المعروف به *:</Text>
          <TextInput
            style={styles.input}
            value={nick}
            onChangeText={setNick}
            placeholder="مثال: الأسطى عبده / د. حمدي"
            placeholderTextColor="rgba(20, 32, 27, 0.4)"
            textAlign="right"
          />

          <Text style={styles.label}>المهنة والتخصص الدقيق *:</Text>
          <TextInput
            style={styles.input}
            value={prof}
            onChangeText={setProf}
            placeholder="مثال: كهربائي منازل / استشاري باطنة"
            placeholderTextColor="rgba(20, 32, 27, 0.4)"
            textAlign="right"
          />

          <Text style={styles.label}>القرية أو الموطن الأصلي *:</Text>
          <TextInput
            style={styles.input}
            value={village}
            onChangeText={setVillage}
            placeholder="مثال: بلانة، غرب سهيل، أسوان، نصر النوبة"
            placeholderTextColor="rgba(20, 32, 27, 0.4)"
            textAlign="right"
          />

          <Text style={styles.label}>العنوان بالتفصيل والشارع والعلامة المميزة *:</Text>
          <TextInput
            style={styles.input}
            value={street}
            onChangeText={setStreet}
            placeholder="مثال: الشارع الرئيسي بجوار مدرسة الأمل"
            placeholderTextColor="rgba(20, 32, 27, 0.4)"
            textAlign="right"
          />

          <View style={styles.twoCols}>
            <View style={styles.col}>
              <Text style={styles.label}>رقم تليفون المكالمات *:</Text>
              <TextInput
                style={styles.input}
                value={phoneCall}
                onChangeText={setPhoneCall}
                placeholder="010XXXXXXXX"
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                keyboardType="phone-pad"
                textAlign="right"
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>رقم الواتساب:</Text>
              <TextInput
                style={styles.input}
                value={phoneWa}
                onChangeText={setPhoneWa}
                placeholder="01XXXXXXXXX"
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                keyboardType="phone-pad"
                textAlign="right"
              />
            </View>
          </View>

          <View style={styles.twoCols}>
            <View style={styles.col}>
              <Text style={styles.label}>تقدير السعر / الزيارة:</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="مثال: 150 ج زيارة"
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                textAlign="right"
              />
            </View>

            <View style={styles.col}>
              <Text style={styles.label}>سنوات الخبرة:</Text>
              <TextInput
                style={styles.input}
                value={exp}
                onChangeText={setExp}
                placeholder="مثال: 15 سنة خبرة"
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                textAlign="right"
              />
            </View>
          </View>

          {/* Location / GPS */}
          <Text style={styles.label}>الموقع الجغرافي واللوكيشن:</Text>
          <View style={styles.locRow}>
            <TextInput
              style={[styles.input, styles.locInput]}
              value={mapUrl}
              onChangeText={setMapUrl}
              placeholder="رابط لوكيشن جوجل ماب أو اضغط تحديد موقعي"
              placeholderTextColor="rgba(20, 32, 27, 0.4)"
              textAlign="right"
            />
            <TouchableOpacity
              style={styles.btnGps}
              onPress={handleUseMyLocation}
              disabled={locLoading}
            >
              {locLoading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.btnGpsText}>📍 موقعي</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Photos Upload Section */}
          <Text style={[styles.formSectionTitle, { marginTop: 16 }]}>
            📸 الصور والمستندات التوثيقية
          </Text>

          <View style={styles.photoPickGrid}>
            {/* Personal Photo */}
            <View style={styles.photoPickerCol}>
              <Text style={styles.photoPickerTitle}>الصورة الشخصية:</Text>
              <TouchableOpacity
                style={styles.photoBox}
                onPress={handlePickPhoto}
                activeOpacity={0.8}
              >
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.previewImg} />
                ) : (
                  <View style={styles.photoEmpty}>
                    <Text style={styles.photoEmptyIcon}>📷</Text>
                    <Text style={styles.photoEmptyText}>اختر صورة وجه واضحة</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* National ID Photo */}
            <View style={styles.photoPickerCol}>
              <Text style={styles.photoPickerTitle}>صورة البطاقة / الكارنيه:</Text>
              <TouchableOpacity
                style={styles.photoBox}
                onPress={handlePickIdCard}
                activeOpacity={0.8}
              >
                {idCardUri ? (
                  <Image source={{ uri: idCardUri }} style={styles.previewImg} />
                ) : (
                  <View style={styles.photoEmpty}>
                    <Text style={styles.photoEmptyIcon}>🛡️</Text>
                    <Text style={styles.photoEmptyText}>صورة البطاقة للتوثيق</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit CTA */}
          <TouchableOpacity
            style={[styles.btnSubmit, isSubmitting && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.btnSubmitText}>إرسال طلب الانضمام للتوثيق ⟁</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    padding: 18,
    ...Shadows.sm,
  },
  formSectionTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: Colors.emeraldDark,
    textAlign: 'right',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.goldSoft,
    paddingBottom: 6,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'right',
    marginTop: 8,
    marginBottom: 4,
  },
  sectorRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginBottom: 8,
  },
  sectorBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  sectorBtnActive: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  sectorBtnIcon: {
    fontSize: 14,
  },
  sectorBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  sectorBtnTextActive: {
    color: Colors.white,
    fontWeight: '900',
  },
  input: {
    backgroundColor: '#FFFDF8',
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.textMain,
  },
  twoCols: {
    flexDirection: 'row-reverse',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  locRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  locInput: {
    flex: 1,
  },
  btnGps: {
    backgroundColor: Colors.emerald,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGpsText: {
    color: Colors.white,
    fontSize: 11.5,
    fontWeight: '900',
  },
  photoPickGrid: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginTop: 6,
  },
  photoPickerCol: {
    flex: 1,
  },
  photoPickerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'right',
    marginBottom: 4,
  },
  photoBox: {
    aspectRatio: 1,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.sm,
    backgroundColor: '#FFFDF5',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImg: {
    width: '100%',
    height: '100%',
  },
  photoEmpty: {
    alignItems: 'center',
    padding: 8,
  },
  photoEmptyIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  photoEmptyText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  btnSubmit: {
    backgroundColor: Colors.emerald,
    borderRadius: BorderRadius.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 22,
    ...Shadows.sm,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnSubmitText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
});
