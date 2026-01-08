import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { colors, gradients, spacing, textStyles, borderRadius } from '../../theme';
import { Mail, Lock, Sparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export function LoginScreen({ navigation }: any) {
    const { signIn } = useSupabaseAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Animações
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Animação de entrada
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Animação de pulso contínua no logo
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        try {
            setLoading(true);
            await signIn(email, password);
        } catch (error: any) {
            Alert.alert('Erro ao fazer login', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Background com gradiente */}
            <LinearGradient
                colors={[colors.background, colors.backgroundSecondary, colors.background]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Círculos decorativos de fundo */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo e Header */}
                    <Animated.View
                        style={[
                            styles.header,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: logoScale }],
                            },
                        ]}
                    >
                        <Animated.View
                            style={[
                                styles.logoContainer,
                                { transform: [{ scale: pulseAnim }] },
                            ]}
                        >
                            <LinearGradient
                                colors={gradients.primary}
                                style={styles.logoGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.logoText}>Z</Text>
                            </LinearGradient>
                            <View style={styles.logoGlow} />
                        </Animated.View>

                        <Text style={styles.title}>ZED</Text>
                        <View style={styles.subtitleContainer}>
                            <Sparkles size={16} color={colors.accent} />
                            <Text style={styles.subtitle}>Seu Assistente Virtual Inteligente</Text>
                        </View>
                    </Animated.View>

                    {/* Formulário */}
                    <Animated.View
                        style={[
                            styles.formContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <View style={styles.formCard}>
                            <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
                            <Text style={styles.welcomeSubtext}>
                                Entre para continuar sua jornada
                            </Text>

                            <View style={styles.inputsContainer}>
                                <Input
                                    label="Email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    leftIcon={<Mail size={20} color={colors.textTertiary} />}
                                />

                                <Input
                                    label="Senha"
                                    placeholder="••••••••"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    leftIcon={<Lock size={20} color={colors.textTertiary} />}
                                />
                            </View>

                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
                            </TouchableOpacity>

                            <Button
                                onPress={handleLogin}
                                loading={loading}
                                fullWidth
                                size="lg"
                                style={styles.loginButton}
                            >
                                Entrar
                            </Button>

                            {/* Divider */}
                            <View style={styles.dividerContainer}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>ou</Text>
                                <View style={styles.divider} />
                            </View>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('SignUp')}
                                style={styles.signUpContainer}
                            >
                                <Text style={styles.signUpText}>
                                    Não tem uma conta?{' '}
                                    <Text style={styles.signUpTextBold}>Cadastre-se</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing[6],
        paddingVertical: spacing[8],
    },
    // Círculos decorativos
    decorativeCircle1: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: colors.glowPrimary,
        opacity: 0.15,
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: -50,
        left: -80,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: colors.glowAccent,
        opacity: 0.1,
    },
    decorativeCircle3: {
        position: 'absolute',
        top: height * 0.4,
        right: -60,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.glowSuccess,
        opacity: 0.08,
    },
    // Header e Logo
    header: {
        alignItems: 'center',
        marginBottom: spacing[8],
    },
    logoContainer: {
        position: 'relative',
        marginBottom: spacing[4],
    },
    logoGradient: {
        width: 100,
        height: 100,
        borderRadius: borderRadius['2xl'],
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 48,
        fontWeight: '800',
        color: colors.white,
        letterSpacing: -2,
    },
    logoGlow: {
        position: 'absolute',
        top: -10,
        left: -10,
        right: -10,
        bottom: -10,
        borderRadius: borderRadius['3xl'],
        backgroundColor: colors.glowPrimary,
        opacity: 0.4,
        zIndex: -1,
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        color: colors.text,
        letterSpacing: 4,
        marginBottom: spacing[2],
    },
    subtitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
    },
    subtitle: {
        ...textStyles.body,
        color: colors.textSecondary,
    },
    // Formulário
    formContainer: {
        width: '100%',
    },
    formCard: {
        backgroundColor: colors.cardGlass,
        borderRadius: borderRadius['2xl'],
        padding: spacing[6],
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    welcomeText: {
        ...textStyles.h3,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing[1],
    },
    welcomeSubtext: {
        ...textStyles.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing[6],
    },
    inputsContainer: {
        gap: spacing[1],
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: spacing[4],
        marginTop: -spacing[2],
    },
    forgotPasswordText: {
        ...textStyles.bodySmall,
        color: colors.primary,
        fontWeight: '600',
    },
    loginButton: {
        marginTop: spacing[2],
    },
    // Divider
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing[6],
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        ...textStyles.bodySmall,
        color: colors.textTertiary,
        marginHorizontal: spacing[4],
    },
    // Sign Up
    signUpContainer: {
        alignItems: 'center',
    },
    signUpText: {
        ...textStyles.body,
        color: colors.textSecondary,
    },
    signUpTextBold: {
        color: colors.primary,
        fontWeight: '700',
    },
});
