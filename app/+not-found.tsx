import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Colors, BorderRadius } from '../src/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'الصفحة غير موجودة', headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.symbol}>⟁</Text>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>هذه الصفحة غير موجودة</Text>
        <Text style={styles.subtitle}>الرابط الذي طلبته غير متاح أو تم نقله.</Text>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>↩ العودة للدليل</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.sandBg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  symbol: {
    fontSize: 64,
    color: Colors.gold,
    marginBottom: 8,
  },
  code: {
    fontSize: 72,
    fontWeight: '900',
    color: Colors.emeraldDark,
    lineHeight: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.emeraldDark,
    textAlign: 'center',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  btn: {
    backgroundColor: Colors.emerald,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: BorderRadius.sm,
  },
  btnText: {
    color: Colors.white,
    fontWeight: '900',
    fontSize: 15,
  },
});
