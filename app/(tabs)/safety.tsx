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
} from 'react-native';
import { NubianMural } from '../../src/components/NubianMural';
import { ContractModal } from '../../src/components/ContractModal';
import { Colors, Shadows, BorderRadius } from '../../src/constants/theme';
import { firestoreService } from '../../src/services/firestoreService';
import { useAuth } from '../../src/context/AuthContext';

export default function SafetyScreen() {
  const { user } = useAuth();

  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [complaintStep, setComplaintStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState(user?.phone || '');
  const [name, setName] = useState(user?.name || '');
  const [craftsmanInfo, setCraftsmanInfo] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin access state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleSubmitComplaint = async () => {
    if (!phone.trim() || !complaintText.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال رقم هاتفك للتواصل ونص الشكوى بالتفصيل!');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      Alert.alert('تنبيه', 'يرجى التأكد من كتابة رقم هاتف صحيح للتواصل معك!');
      return;
    }

    setIsSubmitting(true);
    try {
      await firestoreService.submitComplaint({
        id: Date.now().toString(),
        phone: cleanPhone,
        name: name.trim() || 'عميل محترم',
        craftsmanInfo: craftsmanInfo.trim() || 'غير محدد',
        text: complaintText.trim(),
        createdAt: Date.now(),
        dateStr: new Date().toLocaleDateString('ar-EG', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        status: 'pending',
      });

      Alert.alert(
        '⟁ تم استلام شكواك بنجاح!',
        `رقم التواصل المسجل: ${cleanPhone}\nسنقوم بمراجعة التفاصيل والتدخل والحل الودّي قدر استطاعتنا إن شاء الله 🤝`
      );

      setComplaintText('');
      setCraftsmanInfo('');
      setComplaintStep(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminAuth = () => {
    if (adminPass.trim() === 'nubi2026') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPass('');
      Alert.alert('⟁ تم التفعيل', 'مرحباً بك! تم تفعيل وضع الإدارة النوبية بنجاح.');
    } else {
      Alert.alert('خطأ', 'كلمة سر الإدارة غير صحيحة.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <NubianMural height={14} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>⚖️ الأمان والشكاوى والعقود</Text>
          <Text style={styles.headerSubtitle}>
            حماية المعاملات وحفظ الحقوق بروح التكافل النوبي الأصيل
          </Text>
        </View>
        <View style={styles.goldBottomBorder} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Electronic Contract Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardIcon}>📜</Text>
            <View style={styles.cardTitleCol}>
              <Text style={styles.cardTitle}>اتفاقية الاستخدام والعقد الإلكتروني</Text>
              <Text style={styles.cardDesc}>
                عقد تعريفي مجتمعي لحفظ حقوق العملاء والصنايعية
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.btnGoldOutline}
            onPress={() => setContractModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.btnGoldOutlineText}>قراءة بنود الاتفاقية كاملة ⟁</Text>
          </TouchableOpacity>
        </View>

        {/* Complaints Section */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardIcon}>🚨</Text>
            <View style={styles.cardTitleCol}>
              <Text style={styles.cardTitle}>منظومة الشكاوى وبلاغات الجودة</Text>
              <Text style={styles.cardDesc}>
                نستمع إليك ونتدخل ودياً في حال حدوث أي خلاف
              </Text>
            </View>
          </View>

          {complaintStep === 1 ? (
            /* Step 1: Legal Disclaimer & Notice */
            <View style={styles.stepNoticeWrap}>
              <View style={styles.noticeBox}>
                <Text style={styles.noticeTitle}>⚖️ إخلاء مسؤولية وتأكيد هام:</Text>
                <Text style={styles.noticeText}>
                  • تطبيق «جِـيلِي» هو دليل خدمي وسيط لا يتقاضى أي نسبة أو عمولة من الأعمال.{'\n'}
                  • الاتفاق المالي يتم مباشرة بين العميل والصنايعي.{'\n'}
                  • في حال وجود خلاف مهني، تتدخل إدارة المنصة ودياً للتقريب بين الطرفين.{'\n'}
                  • يحق للإدارة استبعاد وحظر أي صنايعي أو عميل تثبت مخالفته للأمانة والشفافية.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.btnProceed}
                onPress={() => setComplaintStep(2)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnProceedText}>قرأت التوضيح ومتابعة تقديم الشكوى ✍️</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Step 2: Complaint Submission Form */
            <View style={styles.formWrap}>
              <Text style={styles.label}>رقم هاتفك للتواصل والمتابعة *:</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="010XXXXXXXX"
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                keyboardType="phone-pad"
                textAlign="right"
              />

              <Text style={styles.label}>اسمك الكريم:</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="الاسم"
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                textAlign="right"
              />

              <Text style={styles.label}>اسم الصنايعي أو المهني وبياناته:</Text>
              <TextInput
                style={styles.input}
                value={craftsmanInfo}
                onChangeText={setCraftsmanInfo}
                placeholder="مثال: الأسطى فلان - كهربائي في بلانة"
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                textAlign="right"
              />

              <Text style={styles.label}>نص الشكوى وتفاصيل ما حدث *:</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={complaintText}
                onChangeText={setComplaintText}
                placeholder="يرجى كتابة ما حدث بأمانة وتوضيح المشكلة..."
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                multiline
                numberOfLines={4}
                textAlign="right"
              />

              <TouchableOpacity
                style={[styles.btnSubmit, isSubmitting && styles.btnDisabled]}
                onPress={handleSubmitComplaint}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                <Text style={styles.btnSubmitText}>
                  {isSubmitting ? 'جاري إرسال البلاغ...' : 'إرسال الشكوى للإدارة ⟁'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnBack}
                onPress={() => setComplaintStep(1)}
              >
                <Text style={styles.btnBackText}>← رجوع للتوضيح</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Admin Portal Section */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardIcon}>🛡️</Text>
            <View style={styles.cardTitleCol}>
              <Text style={styles.cardTitle}>بوابة الإدارة النوبية</Text>
              <Text style={styles.cardDesc}>
                {isAdmin
                  ? 'وضع الإدارة مفعل • يمكنك حذف وتعديل الحسابات'
                  : 'خاص بمشرفي ومنسقي منصة جِيلِي'}
              </Text>
            </View>
          </View>

          {isAdmin ? (
            <View style={styles.adminActiveBox}>
              <Text style={styles.adminActiveText}>
                ✅ حسابك مفعل بصلاحيات الإدارة النوبية كاملة!
              </Text>
              <TouchableOpacity
                style={styles.adminLogoutBtn}
                onPress={() => setIsAdmin(false)}
              >
                <Text style={styles.adminLogoutText}>تسجيل خروج من الإدارة</Text>
              </TouchableOpacity>
            </View>
          ) : showAdminLogin ? (
            <View style={styles.adminLoginBox}>
              <Text style={styles.label}>ادخل كلمة سر الإدارة:</Text>
              <TextInput
                style={styles.input}
                value={adminPass}
                onChangeText={setAdminPass}
                placeholder="كلمة السر التجريبية: nubi2026"
                placeholderTextColor="rgba(20, 32, 27, 0.4)"
                secureTextEntry
                textAlign="center"
              />
              <TouchableOpacity style={styles.btnSubmit} onPress={handleAdminAuth}>
                <Text style={styles.btnSubmitText}>تأكيد الدخول كأدمن</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.btnAdminOpen}
              onPress={() => setShowAdminLogin(true)}
            >
              <Text style={styles.btnAdminOpenText}>تسجيل دخول الإدارة (nubi2026)</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Contract Modal */}
      <ContractModal
        visible={contractModalVisible}
        onAccept={() => setContractModalVisible(false)}
        onClose={() => setContractModalVisible(false)}
      />
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
    gap: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    padding: 16,
    ...Shadows.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardTitleCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.emeraldDark,
    textAlign: 'right',
  },
  cardDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 2,
  },
  btnGoldOutline: {
    backgroundColor: Colors.goldSoft,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnGoldOutlineText: {
    color: Colors.emeraldDark,
    fontSize: 12.5,
    fontWeight: '900',
  },
  stepNoticeWrap: {
    marginTop: 6,
  },
  noticeBox: {
    backgroundColor: '#FFFDF5',
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    padding: 12,
    marginBottom: 12,
  },
  noticeTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: Colors.emeraldDark,
    textAlign: 'right',
    marginBottom: 6,
  },
  noticeText: {
    fontSize: 11.5,
    lineHeight: 18,
    color: Colors.textMain,
    textAlign: 'right',
  },
  btnProceed: {
    backgroundColor: Colors.emerald,
    borderRadius: BorderRadius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    ...Shadows.sm,
  },
  btnProceedText: {
    color: Colors.white,
    fontSize: 12.5,
    fontWeight: '900',
  },
  formWrap: {
    marginTop: 6,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.textMain,
    textAlign: 'right',
    marginTop: 6,
    marginBottom: 4,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  btnSubmit: {
    backgroundColor: Colors.emerald,
    borderRadius: BorderRadius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
    ...Shadows.sm,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnSubmitText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
  btnBack: {
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  btnBackText: {
    color: Colors.textMuted,
    fontSize: 11.5,
    fontWeight: '700',
  },
  btnAdminOpen: {
    backgroundColor: 'rgba(15, 76, 58, 0.08)',
    borderRadius: BorderRadius.sm,
    paddingVertical: 9,
    alignItems: 'center',
  },
  btnAdminOpenText: {
    color: Colors.emeraldDark,
    fontSize: 12,
    fontWeight: '800',
  },
  adminLoginBox: {
    marginTop: 8,
  },
  adminActiveBox: {
    backgroundColor: Colors.availGreenBg,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: BorderRadius.sm,
    padding: 12,
    alignItems: 'center',
  },
  adminActiveText: {
    color: Colors.availGreen,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
  },
  adminLogoutBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.busyRed,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  adminLogoutText: {
    color: Colors.busyRed,
    fontSize: 11,
    fontWeight: '800',
  },
});
