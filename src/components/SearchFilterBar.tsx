import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Colors, Shadows, BorderRadius } from '../constants/theme';
import { CATEGORY_GROUPS, QUICK_CHIPS } from '../constants/categories';
import { LOCATION_GROUPS } from '../constants/locations';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedProfession: string;
  onProfessionChange: (prof: string) => void;
  selectedVillage: string;
  onVillageChange: (village: string) => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedProfession,
  onProfessionChange,
  selectedVillage,
  onVillageChange,
}) => {
  const [profModalVisible, setProfModalVisible] = useState(false);
  const [villageModalVisible, setVillageModalVisible] = useState(false);
  const [activeChip, setActiveChip] = useState('all');

  const handleChipPress = (chip: (typeof QUICK_CHIPS)[0]) => {
    setActiveChip(chip.id);
    onProfessionChange(chip.value);
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onProfessionChange('');
    onVillageChange('');
    setActiveChip('all');
  };

  const hasActiveFilters = searchQuery !== '' || selectedProfession !== '' || selectedVillage !== '';

  return (
    <View style={styles.container}>
      {/* Search Input Box */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن طبيب، مهندس، معلم، فني، أو باسم..."
          placeholderTextColor="rgba(20, 32, 27, 0.45)"
          value={searchQuery}
          onChangeText={onSearchChange}
          textAlign="right"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearSearchBtn}>
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Grid (Profession Selector & Village Selector) */}
      <View style={styles.filterGrid}>
        {/* Profession Selector Button */}
        <TouchableOpacity
          style={[styles.selectBtn, selectedProfession !== '' && styles.selectBtnActive]}
          onPress={() => setProfModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.selectBtnArrow}>▾</Text>
          <Text style={[styles.selectBtnText, selectedProfession !== '' && styles.selectBtnTextActive]} numberOfLines={1}>
            {selectedProfession ? `مهنة: ${selectedProfession}` : '🌟 كل المهن والأقسام'}
          </Text>
        </TouchableOpacity>

        {/* Village / Location Selector Button */}
        <TouchableOpacity
          style={[styles.selectBtn, selectedVillage !== '' && styles.selectBtnActive]}
          onPress={() => setVillageModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.selectBtnArrow}>▾</Text>
          <Text style={[styles.selectBtnText, selectedVillage !== '' && styles.selectBtnTextActive]} numberOfLines={1}>
            {selectedVillage ? `منطقة: ${selectedVillage}` : '📍 كل المناطق والقرى'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Filter Chips Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        style={styles.chipsScroll}
      >
        {QUICK_CHIPS.map((chip) => {
          const isActive =
            activeChip === chip.id ||
            (chip.value !== '' && selectedProfession === chip.value);
          return (
            <TouchableOpacity
              key={chip.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => handleChipPress(chip)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {hasActiveFilters && (
          <TouchableOpacity style={styles.chipClear} onPress={clearAllFilters}>
            <Text style={styles.chipClearText}>✕ تفريغ الفلاتر</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Profession Modal Selector */}
      <Modal visible={profModalVisible} transparent animationType="slide" onRequestClose={() => setProfModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalSheetHeader}>
              <TouchableOpacity onPress={() => setProfModalVisible(false)}>
                <Text style={styles.modalCloseText}>إغلاق ✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalSheetTitle}>اختر التخصص والمهنة</Text>
            </View>

            <ScrollView style={styles.modalSheetContent}>
              <TouchableOpacity
                style={[styles.optionItem, selectedProfession === '' && styles.optionItemActive]}
                onPress={() => {
                  onProfessionChange('');
                  setProfModalVisible(false);
                }}
              >
                <Text style={styles.optionItemText}>🌟 جميع المهن والتخصصات</Text>
              </TouchableOpacity>

              {CATEGORY_GROUPS.map((group, gIdx) => (
                <View key={gIdx} style={styles.optGroupWrap}>
                  <Text style={styles.optGroupLabel}>
                    {group.icon} {group.label}
                  </Text>
                  {group.options.map((opt, oIdx) => {
                    const isSelected = selectedProfession === opt.value;
                    return (
                      <TouchableOpacity
                        key={oIdx}
                        style={[styles.optionItem, isSelected && styles.optionItemActive]}
                        onPress={() => {
                          onProfessionChange(opt.value);
                          setProfModalVisible(false);
                        }}
                      >
                        <Text style={[styles.optionItemText, isSelected && styles.optionItemTextActive]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Village Modal Selector */}
      <Modal visible={villageModalVisible} transparent animationType="slide" onRequestClose={() => setVillageModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalSheetHeader}>
              <TouchableOpacity onPress={() => setVillageModalVisible(false)}>
                <Text style={styles.modalCloseText}>إغلاق ✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalSheetTitle}>اختر القرية أو المحافظة</Text>
            </View>

            <ScrollView style={styles.modalSheetContent}>
              <TouchableOpacity
                style={[styles.optionItem, selectedVillage === '' && styles.optionItemActive]}
                onPress={() => {
                  onVillageChange('');
                  setVillageModalVisible(false);
                }}
              >
                <Text style={styles.optionItemText}>📍 كل المحافظات والمناطق</Text>
              </TouchableOpacity>

              {LOCATION_GROUPS.map((group, gIdx) => (
                <View key={gIdx} style={styles.optGroupWrap}>
                  <Text style={styles.optGroupLabel}>
                    {group.icon} {group.label}
                  </Text>
                  {group.options.map((opt, oIdx) => {
                    const isSelected = selectedVillage === opt.value;
                    return (
                      <TouchableOpacity
                        key={oIdx}
                        style={[styles.optionItem, isSelected && styles.optionItemActive]}
                        onPress={() => {
                          onVillageChange(opt.value);
                          setVillageModalVisible(false);
                        }}
                      >
                        <Text style={[styles.optionItemText, isSelected && styles.optionItemTextActive]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    ...Shadows.sm,
  },
  searchBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  searchIcon: {
    fontSize: 16,
    marginLeft: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMain,
    paddingVertical: 6,
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '800',
  },
  filterGrid: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginTop: 8,
  },
  selectBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 160, 23, 0.45)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  selectBtnActive: {
    backgroundColor: Colors.goldSoft,
    borderColor: Colors.gold,
  },
  selectBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMain,
    flex: 1,
    textAlign: 'right',
  },
  selectBtnTextActive: {
    color: Colors.emeraldDark,
    fontWeight: '900',
  },
  selectBtnArrow: {
    fontSize: 10,
    color: Colors.textMuted,
    marginLeft: 4,
  },
  chipsScroll: {
    marginTop: 8,
  },
  chipsRow: {
    flexDirection: 'row-reverse',
    gap: 6,
    paddingBottom: 2,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(15, 76, 58, 0.2)',
  },
  chipActive: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.emerald,
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: '900',
  },
  chipClear: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#F87171',
  },
  chipClearText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFDF8',
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.gold,
    maxHeight: '75%',
    paddingBottom: 24,
  },
  modalSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.goldSoft,
  },
  modalSheetTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.emeraldDark,
  },
  modalCloseText: {
    fontSize: 13,
    color: Colors.terracotta,
    fontWeight: '800',
  },
  modalSheetContent: {
    paddingHorizontal: 16,
  },
  optGroupWrap: {
    marginTop: 12,
  },
  optGroupLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.emerald,
    textAlign: 'right',
    marginBottom: 6,
    backgroundColor: Colors.goldSoft,
    padding: 6,
    borderRadius: BorderRadius.sm,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.sm,
    marginVertical: 2,
  },
  optionItemActive: {
    backgroundColor: 'rgba(212, 160, 23, 0.2)',
  },
  optionItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMain,
    textAlign: 'right',
  },
  optionItemTextActive: {
    fontWeight: '900',
    color: Colors.emeraldDark,
  },
});
