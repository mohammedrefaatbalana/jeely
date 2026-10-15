import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from '../../src/constants/theme';
import { useFavorites } from '../../src/context/FavoritesContext';

export default function TabsLayout() {
  const { favoritesCount } = useFavorites();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.emerald,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الدليل',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>⟁</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'المفضلة',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWithBadge}>
              <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
                {focused ? '❤️' : '🤍'}
              </Text>
              {favoritesCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{favoritesCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="appointments"
        options={{
          title: 'مواعيدي',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>📅</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="join"
        options={{
          title: 'انضم كمهني',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>➕</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="safety"
        options={{
          title: 'الأمان والشكاوى',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>⚖️</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2.5,
    borderTopColor: Colors.gold,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
  tabIcon: {
    fontSize: 18,
  },
  tabIconActive: {
    transform: [{ scale: 1.15 }],
  },
  iconWithBadge: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.terracotta,
    borderRadius: 999,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
});
