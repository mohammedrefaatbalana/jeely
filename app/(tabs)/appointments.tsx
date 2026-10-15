import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { NubianMural } from '../../src/components/NubianMural';
import { Colors, Shadows, BorderRadius } from '../../src/constants/theme';
import { useAppointments } from '../../src/context/AppointmentsContext';
import { Appointment } from '../../src/types';

export default function AppointmentsScreen() {
  const router = useRouter();
  const { appointments, cancelAppointment } = useAppointments();

  const handleCancel = (appt: Appointment) => {
    Alert.alert(
      'تأكيد الإلغاء',
      `هل أنت متأكد من رغبتك في إلغاء الحجز رقم (${appt.code}) مع الأسطى ${appt.craftNick}؟`,
      [
        { text: 'تراجع', style: 'cancel' },
        {
          text: 'نعم، إلغاء الحجز',
          style: 'destructive',
          onPress: async () => {
            await cancelAppointment(appt.id);
            Alert.alert('تم الإلغاء', 'تم إلغاء موعد الحجز بنجاح.');
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return { label: '✓ مؤكد', bg: Colors.availGreenBg, color: Colors.availGreen };
      case 'cancelled':
        return { label: '✕ ملغي', bg: Colors.busyRedBg, color: Colors.busyRed };
      case 'completed':
        return { label: '★ مكتمل', bg: Colors.nileLight, color: Colors.nileBlue };
      case 'pending':
      default:
        return { label: '⏳ قيد الانتظار', bg: '#FFF8E1', color: '#B45309' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <NubianMural height={14} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>📅 مواعيدي وحجوزاتي</Text>
          <Text style={styles.headerSubtitle}>
            {appointments.length} حجز مسجل مع صنايعية ومحترفي جِيلِي
          </Text>
        </View>
        <View style={styles.goldBottomBorder} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {appointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>لا توجد لديك مواعيد مسجلة</Text>
            <Text style={styles.emptyDesc}>
              لم تقم بحجز أي موعد حتى الآن.{'\n'}
              يمكنك حجز موعد مع أي صنايعي أو محترف بسهولة بالضغط على زر «حجز» في بطاقته بالدليل.
            </Text>
            <TouchableOpacity
              style={styles.btnExplore}
              onPress={() => router.push('/(tabs)')}
              activeOpacity={0.8}
            >
              <Text style={styles.btnExploreText}>تصفح الدليل وحجز موعد ⟁</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listWrap}>
            {appointments.map((appt) => {
              const statusBadge = getStatusBadge(appt.status);
              const isCancelled = appt.status === 'cancelled';

              return (
                <View key={String(appt.id)} style={styles.card}>
                  {/* Card Header: Code & Status */}
                  <View style={styles.cardHeaderRow}>
                    <View
                      style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}
                    >
                      <Text style={[styles.statusBadgeText, { color: statusBadge.color }]}>
                        {statusBadge.label}
                      </Text>
                    </View>
                    <View style={styles.codePill}>
                      <Text style={styles.codePillText}>كود الحجز: {appt.code}</Text>
                    </View>
                  </View>

                  {/* Provider Info */}
                  <View style={styles.providerRow}>
                    <Text style={styles.craftNick}>⟁ مع الأسطى / {appt.craftNick}</Text>
                  </View>

                  {/* Date & Time Box */}
                  <View style={styles.dateTimeBox}>
                    <View style={styles.dateTimeItem}>
                      <Text style={styles.dateTimeLabel}>التاريخ:</Text>
                      <Text style={styles.dateTimeValue}>{appt.day}</Text>
                    </View>
                    <View style={styles.dateTimeItem}>
                      <Text style={styles.dateTimeLabel}>الساعة:</Text>
                      <Text style={styles.dateTimeValue}>{appt.time}</Text>
                    </View>
                  </View>

                  {/* Customer Info */}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>اسم العميل:</Text>
                    <Text style={styles.infoVal}>{appt.custName}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>رقم التواصل:</Text>
                    <Text style={styles.infoVal}>{appt.custPhone}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>مكان الزيارة:</Text>
                    <Text style={styles.infoVal}>{appt.custAddr}</Text>
                  </View>

                  {appt.notes ? (
                    <View style={styles.notesBox}>
                      <Text style={styles.notesText}>ملاحظات: {appt.notes}</Text>
                    </View>
                  ) : null}

                  {/* Actions */}
                  {!isCancelled && (
                    <TouchableOpacity
                      style={styles.btnCancel}
                      onPress={() => handleCancel(appt)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnCancelText}>إلغاء الموعد ✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        )}
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
    gap: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    borderRightWidth: 5,
    borderRightColor: Colors.gold,
    ...Shadows.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codePill: {
    backgroundColor: Colors.goldSoft,
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  codePillText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.emeraldDark,
  },
  statusBadge: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '900',
  },
  providerRow: {
    marginBottom: 8,
  },
  craftNick: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.emeraldDark,
    textAlign: 'right',
  },
  dateTimeBox: {
    flexDirection: 'row-reverse',
    backgroundColor: '#FFFDF5',
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 23, 0.4)',
    borderRadius: BorderRadius.sm,
    padding: 8,
    marginVertical: 6,
    justifyContent: 'space-around',
  },
  dateTimeItem: {
    alignItems: 'center',
  },
  dateTimeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  dateTimeValue: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.emeraldDark,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  infoVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.textMain,
  },
  notesBox: {
    backgroundColor: Colors.sandBg,
    borderRadius: BorderRadius.sm,
    padding: 8,
    marginTop: 8,
  },
  notesText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
  },
  btnCancel: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: BorderRadius.sm,
    paddingVertical: 7,
    alignItems: 'center',
    marginTop: 10,
  },
  btnCancelText: {
    color: '#DC2626',
    fontSize: 11.5,
    fontWeight: '800',
  },
});
