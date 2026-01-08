import React from 'react';
import {
    Modal as RNModal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, textStyles, shadows } from '../../theme';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    containerStyle?: ViewStyle;
    maxHeight?: number;
}

export const Modal: React.FC<ModalProps> = ({
    visible,
    onClose,
    title,
    children,
    footer,
    containerStyle,
    maxHeight,
}) => {
    return (
        <RNModal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View style={[styles.container, containerStyle]}>
                    {title && (
                        <View style={styles.header}>
                            <Text style={styles.title}>{title}</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <ScrollView
                        style={[styles.content, maxHeight ? { maxHeight } : null]}
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                    </ScrollView>

                    {footer && <View style={styles.footer}>{footer}</View>}
                </View>
            </View>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.overlay,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    container: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        width: '90%',
        maxWidth: 500,
        ...shadows.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        ...textStyles.h3,
        color: colors.text,
        flex: 1,
    },
    closeButton: {
        padding: spacing[2],
    },
    closeButtonText: {
        ...textStyles.h3,
        color: colors.textSecondary,
    },
    content: {
        padding: spacing[4],
    },
    footer: {
        padding: spacing[4],
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
});
