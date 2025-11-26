import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Container from '../../components/layout/Container';
import Button from '../../components/common/Button';
import { Theme } from '../../styles/themes';
import { useAuth } from '../../hooks/useAuth';
import { useBiometric } from '../../hooks/useBiometric';
import { DrawerParamList } from '../../types/navigation';

type SettingsScreenNavigationProp = NativeStackNavigationProp<DrawerParamList>;

const Settings: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { user, logout } = useAuth();
  const { isAvailable, isEnabled } = useBiometric();

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

  return (
    <Container>
      <ScrollView style={styles.container}>
        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.username}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Biometric Authentication</Text>
                <Text style={styles.settingDescription}>
                  Use Face ID or fingerprint to login
                </Text>
              </View>
              <View style={styles.settingAction}>
                <Text style={styles.settingStatus}>
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </Text>
                <Button
                  title="Configure"
                  onPress={navigateToBiometricSettings}
                  variant="outline"
                  size="small"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Location Services</Text>
                <Text style={styles.settingDescription}>
                  Access your current location
                </Text>
              </View>
              <View style={styles.settingAction}>
                <Button
                  title="Manage"
                  onPress={navigateToLocationSettings}
                  variant="outline"
                  size="small"
                />
              </View>
            </View>
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.card}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>1001</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>API</Text>
              <Text style={styles.infoValue}>PokeAPI v2</Text>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            size="large"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.spacing.lg,
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.typography.size.xl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.md,
  },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borders.radius.large,
    padding: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: Theme.typography.size.xl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  userEmail: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: Theme.spacing.md,
  },
  settingTitle: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  settingDescription: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
  },
  settingAction: {
    alignItems: 'flex-end',
    gap: Theme.spacing.xs,
  },
  settingStatus: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.secondary,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.borderLight,
  },
  infoLabel: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.primary,
  },
  infoValue: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
  },
  logoutButton: {
    marginTop: Theme.spacing.md,
  },
});

export default Settings;