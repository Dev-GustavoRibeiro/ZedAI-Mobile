import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Home,
  MessageCircle,
  ClipboardList,
  Wallet,
  User,
} from 'lucide-react-native';

// Hooks
import { useSupabaseAuth } from './src/hooks/useSupabaseAuth';

// Screens
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignUpScreen } from './src/screens/auth/SignUpScreen';
import { HomeScreen } from './src/screens/dashboard/HomeScreen';
import { ChatScreen } from './src/screens/dashboard/ChatScreen';
import { RoutineScreen } from './src/screens/dashboard/RoutineScreen';
import { FinancesScreen } from './src/screens/dashboard/FinancesScreen';
import { ProfileScreen } from './src/screens/dashboard/ProfileScreen';

// Theme
import { colors, gradients, spacing, borderRadius, shadows } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Componente de ícone da tab personalizado
function TabIcon({ 
  focused, 
  icon: Icon, 
  color 
}: { 
  focused: boolean; 
  icon: any; 
  color: string;
}) {
  if (focused) {
    return (
      <View style={styles.activeTabIconContainer}>
        <LinearGradient
          colors={gradients.primary}
          style={styles.activeTabIconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon size={22} color={colors.white} strokeWidth={2} />
        </LinearGradient>
      </View>
    );
  }
  return <Icon size={22} color={color} strokeWidth={1.5} />;
}

// Bottom tabs para área logada
function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} icon={Home} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} icon={MessageCircle} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Routine"
        component={RoutineScreen}
        options={{
          tabBarLabel: 'Tarefas',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} icon={ClipboardList} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Finances"
        component={FinancesScreen}
        options={{
          tabBarLabel: 'Finanças',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} icon={Wallet} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} icon={User} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { loading, isAuthenticated } = useSupabaseAuth();

  // Loading state com visual melhorado
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={[colors.backgroundSecondary, colors.background]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.loadingContent}>
          <LinearGradient
            colors={gradients.primary}
            style={styles.loadingLogo}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.loadingLogoInner}>
              <ActivityIndicator size="large" color={colors.white} />
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          {isAuthenticated ? (
            <Stack.Screen name="Dashboard" component={DashboardTabs} />
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingLogo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius['2xl'],
    padding: 3,
  },
  loadingLogoInner: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Tab Bar
  tabBar: {
    backgroundColor: colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingTop: spacing[2],
    paddingBottom: Platform.OS === 'ios' ? spacing[6] : spacing[2],
    ...shadows.lg,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: spacing[1],
  },
  tabBarItem: {
    paddingTop: spacing[1],
  },
  // Active tab icon
  activeTabIconContainer: {
    ...shadows.sm,
  },
  activeTabIconGradient: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -spacing[1],
  },
});
