import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import Container from '../../components/layout/Container';
import Button from '../../components/common/Button';
import { Theme } from '../../styles/themes';
import { useAuth } from '../../hooks/useAuth';
import { useBiometric } from '../../hooks/useBiometric';
import { DrawerParamList } from '../../types/navigation';

type SettingsScreenNavigationProp = NativeStackNavigationProp<DrawerParamList>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Settings: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { user, logout } = useAuth();
  const { isAvailable, isEnabled } = useBiometric();

  const [pulseAnim] = useState(new Animated.Value(0));
  const [glowAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(SCREEN_WIDTH));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Pulse animation for background
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();

    // Rotating pokeball
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const backgroundColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1a1a2e', '#16213e'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const navigateToBiometricSettings = () => {
    navigation.navigate('BiometricSettings');
  };

  const navigateToLocationSettings = () => {
    navigation.navigate('LocationSettings');
  };

  // Custom Gradient Component Replacement
  const GradientView = ({ colors, style, children }: any) => (
    <View style={[style, { overflow: 'hidden' }]}>
      {/* Simulate gradient with multiple layered views */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors[0], opacity: 0.6 }]} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors[1], opacity: 0.8 }]} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors[2], opacity: 0.6 }]} />
      {children}
    </View>
  );

  const MenuItem = ({ 
    icon, 
    title, 
    description, 
    status, 
    onPress, 
    color = Theme.colors.primary,
    isLast = false 
  }: any) => (
    <TouchableOpacity 
      style={[styles.menuItem, isLast && styles.menuItemLast]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.menuIconContainer, { backgroundColor: color + '20' }]}>
        <FontAwesome6 name={icon} size={24} color={color} />
      </Animated.View>
      
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuDescription}>{description}</Text>
      </View>
      
      <View style={styles.menuAction}>
        {status && <Text style={styles.menuStatus}>{status}</Text>}
        <FontAwesome6 name="chevron-right" size={16} color={Theme.colors.text.secondary} iconStyle='solid'/>
      </View>
    </TouchableOpacity>
  );

  return (
    <Container safeArea={false}>
      {/* Animated Background */}
      <Animated.View 
        style={[
          styles.background,
          { backgroundColor }
        ]}
      />
      
      {/* Animated Glow Effects */}
      <Animated.View 
        style={[
          styles.glowEffect,
          styles.glow1,
          { opacity: glowOpacity }
        ]}
      />
      <Animated.View 
        style={[
          styles.glowEffect,
          styles.glow2,
          { opacity: glowAnim }
        ]}
      />

      {/* Floating Pokeballs */}
      <Animated.View 
        style={[
          styles.floatingPokeball,
          styles.pokeball1,
          { transform: [{ rotate }] }
        ]}
      >
        <Text style={styles.pokeballIcon}>⚫</Text>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.floatingPokeball,
          styles.pokeball2,
          { transform: [{ rotate: rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '-360deg']
          }) }] }
        ]}
      >
        <Text style={styles.pokeballIcon}>🔴</Text>
      </Animated.View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section with Slide Animation */}
        <Animated.View 
          style={[
            styles.headerSection,
            { 
              transform: [{ translateX: slideAnim }],
              opacity: fadeAnim
            }
          ]}
        >
          <GradientView
            colors={['#DC0A2D', '#FF3B5C', '#DC0A2D']}
            style={styles.headerGradient}
          >
            {/* Profile Avatar with Animated Border */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBorder}>
                <View style={styles.avatarGradient}>
                  <View style={styles.avatar}>
                    <FontAwesome6 name="user-astronaut" size={40} color={Theme.colors.white} iconStyle='solid'/>
                  </View>
                </View>
              </View>
              
              {/* Level Badge */}
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Lv. 25</Text>
              </View>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.username || 'Pokémon Trainer'}</Text>
              <Text style={styles.userTitle}>Pokémon Master</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>128</Text>
                <Text style={styles.statLabel}>Pokémon</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>47</Text>
                <Text style={styles.statLabel}>Caught</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>81</Text>
                <Text style={styles.statLabel}>Seen</Text>
              </View>
            </View>
          </GradientView>
        </Animated.View>

        {/* Menu Section */}
        <Animated.View 
          style={[
            styles.menuSection,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.sectionTitle}>Trainer Settings</Text>
          
          <View style={styles.menuCard}>
            <MenuItem
              icon="fingerprint"
              title="Biometric Auth"
              description="Secure login with Face ID/Fingerprint"
              status={isEnabled ? "ACTIVE" : "INACTIVE"}
              onPress={navigateToBiometricSettings}
              color="#4ECDC4"
            />
            
            <MenuItem
              icon="location-dot"
              title="Location Services"
              description="Access your current location"
              status="ENABLED"
              onPress={navigateToLocationSettings}
              color="#45B7D1"
            />
            
            <MenuItem
              icon="bell"
              title="Notifications"
              description="Pokémon alerts and updates"
              status="ON"
              onPress={() => {}}
              color="#FF6B6B"
            />
            
            <MenuItem
              icon="palette"
              title="Appearance"
              description="Dark mode and themes"
              status="AUTO"
              onPress={() => {}}
              color="#FFD166"
              isLast={true}
            />
          </View>
        </Animated.View>

        {/* Game Stats Section */}
        <Animated.View 
          style={[
            styles.menuSection,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.sectionTitle}>Game Progress</Text>
          
          <View style={styles.statsCard}>
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Kanto Dex Completion</Text>
                <Text style={styles.progressPercent}>68%</Text>
              </View>
              <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, { width: '68%' }]} />
              </View>
            </View>
            
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Johto Discovery</Text>
                <Text style={styles.progressPercent}>42%</Text>
              </View>
              <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, { width: '42%', backgroundColor: '#4ECDC4' }]} />
              </View>
            </View>
            
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Battle Wins</Text>
                <Text style={styles.progressPercent}>156</Text>
              </View>
              <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, { width: '85%', backgroundColor: '#FFD166' }]} />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Achievements Section */}
        <Animated.View 
          style={[
            styles.menuSection,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          
          <View style={styles.achievementsCard}>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#FFD700' }]}>
                <FontAwesome6 name="trophy" size={20} color={Theme.colors.white} iconStyle='solid'/>
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>First Pokémon</Text>
                <Text style={styles.achievementDesc}>Caught your starter Pokémon</Text>
              </View>
              <Text style={styles.achievementTime}>2d ago</Text>
            </View>
            
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#C0C0C0' }]}>
                <FontAwesome6 name="medal" size={20} color={Theme.colors.white} iconStyle='solid'/>
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Type Master</Text>
                <Text style={styles.achievementDesc}>Discovered all Pokémon types</Text>
              </View>
              <Text style={styles.achievementTime}>1w ago</Text>
            </View>

            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#CD7F32' }]}>
                <FontAwesome6 name="award" size={20} color={Theme.colors.white} iconStyle='solid'/>
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>Gym Leader</Text>
                <Text style={styles.achievementDesc}>Defeated first gym</Text>
              </View>
              <Text style={styles.achievementTime}>3d ago</Text>
            </View>
          </View>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View 
          style={[
            styles.logoutSection,
            { opacity: fadeAnim }
          ]}
        >
          <Button
            title="Logout from Pokedex"
            onPress={handleLogout}
            variant="danger"
            size="large"
            style={styles.logoutButton}
            icon="right-from-bracket"
          />
        </Animated.View>

        {/* Footer */}
        <Animated.View 
          style={[
            styles.footer,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.footerText}>Pokedex App v1.0.0</Text>
          <Text style={styles.footerSubtext}>Gotta Catch 'Em All!</Text>
        </Animated.View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xxl,
  },
  glowEffect: {
    position: 'absolute',
    borderRadius: 500,
  },
  glow1: {
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    backgroundColor: '#DC0A2D',
    opacity: 0.3,
  },
  glow2: {
    bottom: -150,
    left: -100,
    width: 400,
    height: 400,
    backgroundColor: '#4ECDC4',
    opacity: 0.2,
  },
  floatingPokeball: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
  },
  pokeball1: {
    top: SCREEN_HEIGHT * 0.1,
    right: 30,
    width: 60,
    height: 60,
  },
  pokeball2: {
    bottom: SCREEN_HEIGHT * 0.15,
    left: 20,
    width: 40,
    height: 40,
  },
  pokeballIcon: {
    fontSize: 24,
  },
  headerSection: {
    marginBottom: Theme.spacing.xl,
  },
  headerGradient: {
    padding: Theme.spacing.xl,
    paddingTop: Theme.spacing.xxl,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    ...Theme.shadows.large,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  avatarBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
    backgroundColor: '#FFD700', // Gold border
    ...Theme.shadows.medium,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 47,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 47,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borders.radius.round,
    ...Theme.shadows.small,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  levelText: {
    fontSize: Theme.typography.size.xs,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.white,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  userName: {
    fontSize: Theme.typography.size.xxl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  userTitle: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.white,
    opacity: 0.9,
    marginBottom: Theme.spacing.xs,
  },
  userEmail: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.white,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Theme.borders.radius.large,
    padding: Theme.spacing.md,
    marginTop: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Theme.typography.size.xl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.xs,
  },
  statLabel: {
    fontSize: Theme.typography.size.xs,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.white,
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  menuSection: {
    marginBottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.size.xl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Theme.borders.radius.large,
    overflow: 'hidden',
    ...Theme.shadows.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.xs,
  },
  menuDescription: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.white,
    opacity: 0.7,
  },
  menuAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuStatus: {
    fontSize: Theme.typography.size.xs,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.success,
    marginRight: Theme.spacing.sm,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borders.radius.small,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Theme.borders.radius.large,
    padding: Theme.spacing.lg,
    ...Theme.shadows.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressItem: {
    marginBottom: Theme.spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  progressLabel: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.white,
  },
  progressPercent: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.white,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Theme.borders.radius.small,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borders.radius.small,
  },
  achievementsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Theme.borders.radius.large,
    padding: Theme.spacing.lg,
    ...Theme.shadows.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.xs,
  },
  achievementDesc: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.white,
    opacity: 0.7,
  },
  achievementTime: {
    fontSize: Theme.typography.size.xs,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.white,
    opacity: 0.5,
  },
  logoutSection: {
    paddingHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.xl,
  },
  logoutButton: {
    backgroundColor: 'rgba(220, 10, 45, 0.8)',
    borderWidth: 0,
  },
  footer: {
    alignItems: 'center',
    marginTop: Theme.spacing.xxl,
    padding: Theme.spacing.lg,
  },
  footerText: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.white,
    opacity: 0.7,
    marginBottom: Theme.spacing.xs,
  },
  footerSubtext: {
    fontSize: Theme.typography.size.xs,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.white,
    opacity: 0.5,
  },
});

export default Settings;