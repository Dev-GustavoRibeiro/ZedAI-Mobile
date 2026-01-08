import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useChat } from '../../hooks/useChat';
import { Spinner } from '../../components/atoms/Spinner';
import { colors, gradients, spacing, textStyles, borderRadius, shadows } from '../../theme';
import { Send, Bot, User, Sparkles, Mic } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export function ChatScreen() {
    const { messages, loading, sendMessage, loadHistory } = useChat();
    const [input, setInput] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const inputAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    useEffect(() => {
        // Animar quando o input muda
        Animated.spring(inputAnimation, {
            toValue: input.length > 0 ? 1 : 0,
            tension: 100,
            friction: 10,
            useNativeDriver: true,
        }).start();
    }, [input]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const message = input;
        setInput('');

        try {
            await sendMessage(message);
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    };

    const renderMessage = ({ item, index }: any) => {
        const isUser = item.role === 'user';

        return (
            <Animated.View
                style={[
                    styles.messageContainer,
                    isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
                ]}
            >
                {/* Avatar */}
                {!isUser && (
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={gradients.primary}
                            style={styles.avatar}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Bot size={16} color={colors.white} />
                        </LinearGradient>
                    </View>
                )}

                <View
                    style={[
                        styles.messageBubble,
                        isUser ? styles.userBubble : styles.assistantBubble,
                    ]}
                >
                    {isUser ? (
                        <LinearGradient
                            colors={gradients.primary}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.userBubbleGradient}
                        >
                            <Text style={styles.userMessageText}>{item.content}</Text>
                            <Text style={styles.userTimestamp}>
                                {new Date(item.timestamp).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </LinearGradient>
                    ) : (
                        <>
                            <Text style={styles.assistantMessageText}>{item.content}</Text>
                            <Text style={styles.assistantTimestamp}>
                                {new Date(item.timestamp).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </>
                    )}
                </View>

                {/* Avatar do usuário */}
                {isUser && (
                    <View style={styles.avatarContainer}>
                        <View style={styles.userAvatar}>
                            <User size={16} color={colors.textSecondary} />
                        </View>
                    </View>
                )}
            </Animated.View>
        );
    };

    const EmptyChat = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <LinearGradient
                    colors={gradients.primary}
                    style={styles.emptyIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Sparkles size={40} color={colors.white} />
                </LinearGradient>
                <View style={styles.emptyIconGlow} />
            </View>
            <Text style={styles.emptyTitle}>Olá! Sou o ZED</Text>
            <Text style={styles.emptyText}>
                Seu assistente pessoal inteligente.{'\n'}
                Como posso te ajudar hoje?
            </Text>

            {/* Sugestões */}
            <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Experimente perguntar:</Text>
                {[
                    'Crie uma tarefa para estudar amanhã',
                    'Quanto gastei esse mês?',
                    'Quais são meus eventos de hoje?',
                ].map((suggestion, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.suggestionChip}
                        onPress={() => setInput(suggestion)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const sendButtonScale = inputAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
    });

    return (
        <View style={styles.container}>
            {/* Background */}
            <LinearGradient
                colors={[colors.backgroundSecondary, colors.background]}
                style={styles.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.2 }}
            />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <LinearGradient
                            colors={gradients.primary}
                            style={styles.headerAvatar}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Bot size={20} color={colors.white} />
                        </LinearGradient>
                        <View style={styles.headerInfo}>
                            <Text style={styles.headerTitle}>ZED</Text>
                            <View style={styles.statusContainer}>
                                <View style={styles.statusDot} />
                                <Text style={styles.headerSubtitle}>Online</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Messages */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item, index) => `message-${index}`}
                    contentContainerStyle={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={EmptyChat}
                />

                {/* Typing indicator */}
                {loading && (
                    <View style={styles.typingContainer}>
                        <View style={styles.typingBubble}>
                            <View style={styles.typingDot} />
                            <View style={[styles.typingDot, styles.typingDot2]} />
                            <View style={[styles.typingDot, styles.typingDot3]} />
                        </View>
                    </View>
                )}

                {/* Input */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            value={input}
                            onChangeText={setInput}
                            placeholder="Digite sua mensagem..."
                            placeholderTextColor={colors.textTertiary}
                            multiline
                            maxLength={500}
                        />

                        <TouchableOpacity style={styles.micButton}>
                            <Mic size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                    </View>

                    <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                (!input.trim() || loading) && styles.sendButtonDisabled,
                            ]}
                            onPress={handleSend}
                            disabled={!input.trim() || loading}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={input.trim() && !loading ? gradients.primary : [colors.border, colors.border]}
                                style={styles.sendButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                {loading ? (
                                    <Spinner size="small" color={colors.white} />
                                ) : (
                                    <Send size={20} color={colors.white} />
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    backgroundGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
    },
    keyboardView: {
        flex: 1,
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing[4],
        paddingTop: spacing[12],
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
    },
    headerAvatar: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerInfo: {
        gap: spacing[0.5],
    },
    headerTitle: {
        ...textStyles.h4,
        color: colors.text,
        fontWeight: '700',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.success,
    },
    headerSubtitle: {
        ...textStyles.caption,
        color: colors.success,
    },
    // Messages
    messagesList: {
        padding: spacing[4],
        gap: spacing[4],
        flexGrow: 1,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: spacing[2],
    },
    userMessageContainer: {
        justifyContent: 'flex-end',
    },
    assistantMessageContainer: {
        justifyContent: 'flex-start',
    },
    avatarContainer: {
        marginBottom: spacing[1],
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userAvatar: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.full,
        backgroundColor: colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    messageBubble: {
        maxWidth: width * 0.7,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    userBubble: {
        ...shadows.md,
    },
    userBubbleGradient: {
        padding: spacing[3],
        paddingHorizontal: spacing[4],
    },
    assistantBubble: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing[3],
        paddingHorizontal: spacing[4],
    },
    userMessageText: {
        ...textStyles.body,
        color: colors.white,
    },
    assistantMessageText: {
        ...textStyles.body,
        color: colors.text,
    },
    userTimestamp: {
        ...textStyles.caption,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'right',
        marginTop: spacing[1],
    },
    assistantTimestamp: {
        ...textStyles.caption,
        color: colors.textTertiary,
        marginTop: spacing[1],
    },
    // Typing indicator
    typingContainer: {
        paddingHorizontal: spacing[4],
        paddingBottom: spacing[2],
    },
    typingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
        backgroundColor: colors.card,
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[4],
        borderRadius: borderRadius.xl,
        alignSelf: 'flex-start',
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.textTertiary,
        opacity: 0.4,
    },
    typingDot2: {
        opacity: 0.6,
    },
    typingDot3: {
        opacity: 0.8,
    },
    // Empty state
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[6],
        paddingTop: spacing[12],
    },
    emptyIconContainer: {
        position: 'relative',
        marginBottom: spacing[4],
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: borderRadius['2xl'],
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyIconGlow: {
        position: 'absolute',
        top: -10,
        left: -10,
        right: -10,
        bottom: -10,
        borderRadius: borderRadius['3xl'],
        backgroundColor: colors.glowPrimary,
        opacity: 0.3,
        zIndex: -1,
    },
    emptyTitle: {
        ...textStyles.h3,
        color: colors.text,
        marginBottom: spacing[2],
    },
    emptyText: {
        ...textStyles.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    suggestionsContainer: {
        marginTop: spacing[8],
        width: '100%',
    },
    suggestionsTitle: {
        ...textStyles.bodySmall,
        color: colors.textTertiary,
        marginBottom: spacing[3],
    },
    suggestionChip: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing[3],
        paddingHorizontal: spacing[4],
        marginBottom: spacing[2],
    },
    suggestionText: {
        ...textStyles.body,
        color: colors.text,
    },
    // Input
    inputContainer: {
        flexDirection: 'row',
        padding: spacing[4],
        gap: spacing[3],
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.backgroundSecondary,
        alignItems: 'flex-end',
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[1],
    },
    input: {
        flex: 1,
        ...textStyles.body,
        color: colors.text,
        maxHeight: 100,
        paddingVertical: spacing[3],
    },
    micButton: {
        padding: spacing[2],
    },
    sendButton: {
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        ...shadows.md,
    },
    sendButtonDisabled: {
        opacity: 0.6,
    },
    sendButtonGradient: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
