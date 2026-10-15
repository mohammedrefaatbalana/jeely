import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Shadows, BorderRadius } from '../../src/constants/theme';
import { ChatMessage } from '../../src/types';
import { firestoreService } from '../../src/services/firestoreService';
import { useAuth } from '../../src/context/AuthContext';

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  const craftId = (params.id as string) || '';
  const craftNick = (params.nick as string) || 'الصنايعي';
  const craftName = (params.name as string) || '';
  const craftProf = (params.prof as string) || '';
  const craftVillage = (params.village as string) || '';
  const craftPhoto = (params.photo as string) || '';

  const clientPhone = user?.phone || '01000000000';
  const clientName = user?.name || 'عميل جِيلِي';
  const chatId = `${craftId}_${clientPhone}`;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const unsub = firestoreService.subscribeChatMessages(chatId, (msgs) => {
      setMessages(msgs);
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 150);
    });

    return () => unsub();
  }, [chatId]);

  const handleSendMessage = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'م' : 'ص';
    const h12 = hours % 12 || 12;
    const timeStr = `${h12}:${minutes} ${ampm}`;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'client',
      text: trimmed,
      timestamp: Date.now(),
      timeStr,
      unreadCraftsman: true,
      unreadClient: false,
    };

    setInputText('');

    await firestoreService.sendChatMessage(chatId, newMsg, {
      chatId,
      craftsmanId: craftId,
      craftsmanNick: craftNick,
      clientPhone,
      clientName,
      lastMessage: trimmed,
      updatedAt: Date.now(),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Chat Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerNick} numberOfLines={1}>
              {craftNick} {craftName ? `(${craftName})` : ''}
            </Text>
            <Text style={styles.headerProf} numberOfLines={1}>
              {craftProf} • {craftVillage}
            </Text>
          </View>

          <View style={styles.avatarWrap}>
            {craftPhoto ? (
              <Image source={{ uri: craftPhoto }} style={styles.avatarImg} />
            ) : (
              <Text style={styles.avatarPlaceholder}>👷</Text>
            )}
          </View>
        </View>

        {/* Notice Banner */}
        <View style={styles.noticeBanner}>
          <Text style={styles.noticeText}>
            🔔 دردشة مباشرة مع المهني • سيصل إشعار فوري للصنايعي بالرسالة
          </Text>
        </View>

        {/* Messages List */}
        <ScrollView
          ref={scrollRef}
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyChatBox}>
              <Text style={styles.emptyChatIcon}>👋</Text>
              <Text style={styles.emptyChatTitle}>ابدأ المحادثة مع الأسطى {craftNick}</Text>
              <Text style={styles.emptyChatDesc}>
                اكتب استفسارك أو مشكلتك بالتفصيل وسيتم الرد عليك مباشرة لحجز أو مناقشة العمل.
              </Text>
            </View>
          ) : (
            messages.map((m) => {
              const isClient = m.sender === 'client';
              return (
                <View
                  key={m.id}
                  style={[
                    styles.messageRow,
                    isClient ? styles.messageRowClient : styles.messageRowCraft,
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      isClient ? styles.bubbleClient : styles.bubbleCraft,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        isClient ? styles.bubbleTextClient : styles.bubbleTextCraft,
                      ]}
                    >
                      {m.text}
                    </Text>
                    <Text
                      style={[
                        styles.bubbleTime,
                        isClient ? styles.bubbleTimeClient : styles.bubbleTimeCraft,
                      ]}
                    >
                      {m.timeStr} {isClient ? '✓✓' : ''}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity
            style={[styles.btnSend, !inputText.trim() && styles.btnSendDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Text style={styles.btnSendText}>إرسال</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="اكتب رسالتك هنا للأسطى..."
            placeholderTextColor="rgba(20, 32, 27, 0.45)"
            textAlign="right"
            multiline
          />
        </View>
      </KeyboardAvoidingView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.emeraldDark,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: Colors.gold,
    ...Shadows.md,
  },
  backBtn: {
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.full,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'flex-end',
    marginHorizontal: 12,
  },
  headerNick: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.goldLight,
  },
  headerProf: {
    fontSize: 11,
    color: '#E2F1EC',
    marginTop: 2,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.gold,
    overflow: 'hidden',
    backgroundColor: Colors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    fontSize: 22,
  },
  noticeBanner: {
    backgroundColor: '#F0FDF4',
    borderBottomWidth: 1,
    borderBottomColor: '#BBF7D0',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  noticeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#166534',
    textAlign: 'center',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 10,
  },
  emptyChatBox: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
    marginVertical: 40,
  },
  emptyChatIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyChatTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.emeraldDark,
    marginBottom: 4,
  },
  emptyChatDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  messageRowClient: {
    justifyContent: 'flex-start',
  },
  messageRowCraft: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  bubbleClient: {
    backgroundColor: Colors.emerald,
    borderBottomLeftRadius: 2,
  },
  bubbleCraft: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderBottomRightRadius: 2,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'right',
  },
  bubbleTextClient: {
    color: Colors.white,
    fontWeight: '600',
  },
  bubbleTextCraft: {
    color: Colors.textMain,
    fontWeight: '700',
  },
  bubbleTime: {
    fontSize: 9.5,
    marginTop: 4,
  },
  bubbleTimeClient: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'left',
  },
  bubbleTimeCraft: {
    color: Colors.textMuted,
    textAlign: 'right',
  },
  inputBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderTopWidth: 1.5,
    borderTopColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFDF8',
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.textMain,
    maxHeight: 90,
  },
  btnSend: {
    backgroundColor: Colors.emerald,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSendDisabled: {
    opacity: 0.5,
  },
  btnSendText: {
    color: Colors.white,
    fontSize: 12.5,
    fontWeight: '900',
  },
});
