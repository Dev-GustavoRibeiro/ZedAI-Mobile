import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { Card } from '../../components/molecules/Card';
import { Button } from '../../components/atoms/Button';
import { Avatar } from '../../components/atoms/Avatar';
import { colors, gradients, spacing, textStyles, borderRadius, shadows } from '../../theme';
import {
    User,
    Bell,
    Shield,
    HelpCircle,
    LogOut,
    ChevronRight,
    Settings,
    Moon,
    Globe,
    Sparkles,
} from 'lucide-react-native';

interface MenuItem {
    id: string;
    icon: any;
    label: string;
    color?: string;
    onPress?: () => void;
}

export function ProfileScreen() {
    const { user, signOut } = useSupabaseAuth();

    // Animações
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleLogout = () => {
        Alert.alert('Sair', 'Tem certeza que deseja sair?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sair',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await signOut();
                    } catch (error) {
                        Alert.alert('Erro', 'Não foi possível sair');
                    }
                },
            },
        ]);
    };

    const userName = user?.user_metadata?.name || 'Usuário';
    const userEmail = user?.email || '';

    const menuSections: { title: string; items: MenuItem[] }[] = [
        {
            title: 'Conta',
            items: [
                { id: '1', icon: User, label: 'Editar Perfil' },
                { id: '2', icon: Bell, label: 'Notificações' },
                { id: '3', icon: Shield, label: 'Privacidade' },
            ],
        },
        {
            title: 'Preferências',
            items: [
                { id: '4', icon: Moon, label: 'Aparência' },
                { id: '5', icon: Globe, label: 'Idioma' },
                { id: '6', icon: Settings, label: 'Configurações' },
            ],
        },
        {
            title: 'Suporte',
            items: [
                { id: '7', icon: HelpCircle, label: 'Ajuda' },
                { id: '8', icon: Sparkles, label: 'Novidades' },
            ],
        },
    ];

    const renderMenuItem = (item: MenuItem) => {
        const Icon = item.icon;
        return (
            <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuItemLeft}>
                    <View style={styles.menuItemIcon}>
                        <Icon size={20} color={item.color || colors.textSecondary} />
                    </View>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Background gradient */}
            <LinearGradient
                colors={[colors.backgroundSecondary, colors.background]}
                style={styles.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.4 }}
            />

            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header / Profile Card */}
                <Animated.View
                    style={[
                        styles.header,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <LinearGradient
                        colors={gradients.card}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.profileCard}
                    >
                        <View style={styles.avatarContainer}>
                            <Avatar name={userName} size="xl" />
                            <View style={styles.avatarBadge}>
                                <View style={styles.avatarBadgeInner} />
                            </View>
                        </View>
                        <Text style={styles.name}>{userName}</Text>
                        <Text style={styles.email}>{userEmail}</Text>

                        {/* Stats */}
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>12</Text>
                                <Text style={styles.statLabel}>Tarefas</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>5</Text>
                                <Text style={styles.statLabel}>Metas</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>30</Text>
                                <Text style={styles.statLabel}>Dias</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Menu Sections */}
                {menuSections.map((section, sectionIndex) => (
                    <Animated.View
                        key={section.title}
                        style={[
                            styles.section,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Card variant="glass" padding={0}>
                            {section.items.map((item, index) => (
                                <View key={item.id}>
                                    {renderMenuItem(item)}
                                    {index < section.items.length - 1 && (
                                        <View style={styles.menuDivider} />
                                    )}
                                </View>
                            ))}
                        </Card>
                    </Animated.View>
                ))}

                {/* About */}
                <Animated.View
                    style={[
                        styles.section,
                        {
                            opacity: fadeAnim,
                        },
                    ]}
                >
                    <Card variant="glass" padding={5}>
                        <View style={styles.aboutContent}>
                            <LinearGradient
                                colors={gradients.primary}
                                style={styles.aboutLogo}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.aboutLogoText}>Z</Text>
                            </LinearGradient>
                            <Text style={styles.aboutTitle}>ZED</Text>
                            <Text style={styles.aboutSubtitle}>
                                Seu Assistente Virtual Inteligente
                            </Text>
                            <Text style={styles.versionText}>Versão 1.0.0</Text>
                        </View>
                    </Card>
                </Animated.View>

                {/* Logout */}
                <Animated.View
                    style={[
                        styles.section,
                        styles.lastSection,
                        {
                            opacity: fadeAnim,
                        },
                    ]}
                >
                    <Button
                        variant="danger"
                        onPress={handleLogout}
                        fullWidth
                        size="lg"
                        icon={<LogOut size={20} color={colors.white} />}
                    >
                        Sair da Conta
                    </Button>
                </Animated.View>
            </ScrollView>
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
        height: 300,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing[8],
    },
    // Header
    header: {
        padding: spacing[6],
        paddingTop: spacing[12],
    },
    profileCard: {
        borderRadius: borderRadius['2xl'],
        padding: spacing[6],
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        ...shadows.lg,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing[3],
    },
    avatarBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.background,
    },
    avatarBadgeInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.success,
    },
    name: {
        ...textStyles.h3,
        color: colors.text,
        fontWeight: '700',
    },
    email: {
        ...textStyles.body,
        color: colors.textSecondary,
        marginTop: spacing[1],
    },
    // Stats
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing[5],
        paddingTop: spacing[4],
        borderTopWidth: 1,
        borderTopColor: colors.border,
        width: '100%',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        ...textStyles.h3,
        color: colors.primary,
        fontWeight: '800',
    },
    statLabel: {
        ...textStyles.caption,
        color: colors.textSecondary,
        marginTop: spacing[0.5],
    },
    statDivider: {
        width: 1,
        height: 32,
        backgroundColor: colors.border,
    },
    // Sections
    section: {
        paddingHorizontal: spacing[6],
        marginBottom: spacing[5],
    },
    lastSection: {
        marginBottom: 0,
    },
    sectionTitle: {
        ...textStyles.bodySmall,
        color: colors.textTertiary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing[3],
        paddingLeft: spacing[1],
    },
    // Menu Items
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing[4],
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
    },
    menuItemIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemLabel: {
        ...textStyles.body,
        color: colors.text,
        fontWeight: '500',
    },
    menuDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: spacing[4] + 40 + spacing[3],
    },
    // About
    aboutContent: {
        alignItems: 'center',
    },
    aboutLogo: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing[3],
    },
    aboutLogoText: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.white,
    },
    aboutTitle: {
        ...textStyles.h4,
        color: colors.text,
        fontWeight: '700',
    },
    aboutSubtitle: {
        ...textStyles.bodySmall,
        color: colors.textSecondary,
        marginTop: spacing[1],
    },
    versionText: {
        ...textStyles.caption,
        color: colors.textTertiary,
        marginTop: spacing[2],
    },
});
