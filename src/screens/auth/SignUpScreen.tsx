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
import { User, Mail, Lock, ArrowLeft, UserPlus } from 'lucide-react-native';

const { height } = Dimensions.get('window');

export function SignUpScreen({ navigation }: any) {
    const { signUp } = useSupabaseAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Animações
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
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
        ]).start();
    }, []);

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Erro', 'Preencha todos os campos');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não conferem');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
            return;
        }

        try {
            setLoading(true);
            await signUp(email, password, { name });
            Alert.alert(
                'Sucesso!',
                'Conta criada com sucesso. Faça login para continuar.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        } catch (error: any) {
            Alert.alert('Erro ao criar conta', error.message);
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

            {/* Círculos decorativos */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowLeft size={24} color={colors.text} />
                    </TouchableOpacity>

                    {/* Header */}
                    <Animated.View
                        style={[
                            styles.header,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <View style={styles.iconContainer}>
                            <LinearGradient
                                colors={gradients.accent}
                                style={styles.iconGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <UserPlus size={32} color={colors.white} />
                            </LinearGradient>
                        </View>
                        <Text style={styles.title}>Criar Conta</Text>
                        <Text style={styles.subtitle}>
                            Comece sua jornada com o ZED
                        </Text>
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
                            <View style={styles.inputsContainer}>
                                <Input
                                    label="Nome"
                                    placeholder="Seu nome completo"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    leftIcon={<User size={20} color={colors.textTertiary} />}
                                />

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
                                    placeholder="Mínimo 6 caracteres"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    leftIcon={<Lock size={20} color={colors.textTertiary} />}
                                />

                                <Input
                                    label="Confirmar Senha"
                                    placeholder="Digite a senha novamente"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    leftIcon={<Lock size={20} color={colors.textTertiary} />}
                                />
                            </View>

                            <Button
                                onPress={handleSignUp}
                                loading={loading}
                                fullWidth
                                size="lg"
                                variant="accent"
                                style={styles.signUpButton}
                            >
                                Criar Conta
                            </Button>

                            {/* Divider */}
                            <View style={styles.dividerContainer}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>ou</Text>
                                <View style={styles.divider} />
                            </View>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('Login')}
                                style={styles.loginContainer}
                            >
                                <Text style={styles.loginText}>
                                    Já tem uma conta?{' '}
                                    <Text style={styles.loginTextBold}>Faça login</Text>
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
        paddingHorizontal: spacing[6],
        paddingTop: spacing[12],
        paddingBottom: spacing[8],
    },
    // Círculos decorativos
    decorativeCircle1: {
        position: 'absolute',
        top: -80,
        left: -80,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: colors.glowAccent,
        opacity: 0.12,
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: height * 0.3,
        right: -100,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: colors.glowPrimary,
        opacity: 0.1,
    },
    // Back button
    backButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        backgroundColor: colors.card,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing[6],
    },
    // Header
    header: {
        alignItems: 'center',
        marginBottom: spacing[6],
    },
    iconContainer: {
        marginBottom: spacing[4],
    },
    iconGradient: {
        width: 72,
        height: 72,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.text,
        marginBottom: spacing[2],
    },
    subtitle: {
        ...textStyles.body,
        color: colors.textSecondary,
        textAlign: 'center',
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
    inputsContainer: {
        gap: spacing[1],
    },
    signUpButton: {
        marginTop: spacing[4],
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
    // Login link
    loginContainer: {
        alignItems: 'center',
    },
    loginText: {
        ...textStyles.body,
        color: colors.textSecondary,
    },
    loginTextBold: {
        color: colors.accent,
        fontWeight: '700',
    },
});
