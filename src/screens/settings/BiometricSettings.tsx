import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import Container from '../../components/layout/Container';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { Theme } from '../../styles/themes';
import { useBiometric } from '../../hooks/useBiometric';
import { useAuth } from '../../hooks/useAuth';

const BiometricSettings: React.FC = () => {
  const { isAvailable, biometryType, isEnabled, enableBiometric, disableBiometric, isLoading } = useBiometric();
  const { user } = useAuth();
  
  const [processing, setProcessing] = useState(false);
  const pulseValue = new Animated.Value(1);

  useEffect(() => {
    if (isEnabled) {
      startPulseAnimation();
    }
  }, [isEnabled]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const getBiometricName = () => {
    switch (biometryType) {
      case 'FaceID':
        return 'Face ID';
      case 'TouchID':
      case 'Fingerprint':
        return 'Fingerprint';
      default:
        return 'Biometric';
    }
  };

  const getBiometricIcon = () => {
    switch (biometryType) {
      case 'FaceID':
        return '👁️';
      case 'TouchID':
      case 'Fingerprint':
        return '👆';
      default:
        return '🔒';
    }
  };

  const handleEnableBiometric = async () => {
    if (!user) return;

    setProcessing(true);
    try {
      const success = await enableBiometric(user.email, 'password');
      
      if (success) {
        Alert.alert(
          'Success',
          `${getBiometricName()} has been enabled successfully.`
        );
      } else {
        Alert.alert(
          'Error',
          `Failed to enable ${getBiometricName()}. Please try again.`
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while enabling biometric authentication.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDisableBiometric = async () => {
    Alert.alert(
      'Disable Biometric Authentication',
      `Are you sure you want to disable ${getBiometricName()}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: async () => {
            setProcessing(true);
            const success = await disableBiometric();
            
            if (success) {
              Alert.alert(
                'Success',
                `${getBiometricName()} has been disabled.`
              );
            } else {
              Alert.alert(
                'Error',
                `Failed to disable ${getBiometricName()}. Please try again.`
              );
            }
            setProcessing(false);
          },
        },
      ]
    );
  };

  const handleTestBiometric = async () => {
    const { authenticate } = useBiometric();
    const success = await authenticate();
    
    if (success) {
      Alert.alert(
        'Success',
        `${getBiometricName()} authentication successful!`
      );
    } else {
      Alert.alert(
        'Failed',
        `${getBiometricName()} authentication failed. Please try again.`
      );
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Loading text="Loading biometric settings..." />
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView style={styles.container}>
        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biometric Status</Text>
          <View style={styles.card}>
            <Animated.View 
              style={[
                styles.statusIcon,
                { transform: [{ scale: pulseValue }] }
              ]}
            >
              <Text style={styles.icon}>{getBiometricIcon()}</Text>
            </Animated.View>
            
            <Text style={styles.statusTitle}>
              {isAvailable ? getBiometricName() : 'Not Available'}
            </Text>
            
            <Text style={styles.statusDescription}>
              {isAvailable
                ? isEnabled
                  ? `${getBiometricName()} is currently enabled for authentication.`
                  : `${getBiometricName()} is available but not enabled.`
                : 'Your device does not support biometric authentication or it is not set up.'}
            </Text>

            <View style={styles.statusBadge}>
              <Text style={[
                styles.statusBadgeText,
                { color: isEnabled ? Theme.colors.success : Theme.colors.warning }
              ]}>
                {isEnabled ? 'ENABLED' : 'DISABLED'}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        {isAvailable && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <View style={styles.card}>
              {!isEnabled ? (
                <Button
                  title={`Enable ${getBiometricName()}`}
                  onPress={handleEnableBiometric}
                  loading={processing}
                  disabled={processing}
                  variant="primary"
                  size="large"
                  style={styles.actionButton}
                />
              ) : (
                <>
                  <Button
                    title={`Test ${getBiometricName()}`}
                    onPress={handleTestBiometric}
                    variant="outline"
                    size="large"
                    style={styles.actionButton}
                  />
                  
                  <Button
                    title={`Disable ${getBiometricName()}`}
                    onPress={handleDisableBiometric}
                    loading={processing}
                    disabled={processing}
                    variant="danger"
                    size="large"
                    style={styles.actionButton}
                  />
                </>
              )}
            </View>
          </View>
        )}

        {/* Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>
          <View style={styles.card}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Biometric Type</Text>
              <Text style={styles.infoValue}>
                {isAvailable ? getBiometricName() : 'Not Available'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>
                {isEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Security Level</Text>
              <Text style={styles.infoValue}>High</Text>
            </View>
          </View>
        </View>

        {/* Help Section */}
        {!isAvailable && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Help</Text>
            <View style={styles.card}>
              <Text style={styles.helpText}>
                To use biometric authentication:{'\n\n'}
                • Ensure your device supports {getBiometricName()}{'\n'}
                • Set up {getBiometricName()} in your device settings{'\n'}
                • Enable screen lock security{'\n'}
                • Grant permission to this app{'\n\n'}
                Biometric data is stored securely on your device and is never shared with our servers.
              </Text>
            </View>
          </View>
        )}
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
    padding: Theme.spacing.xl,
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  icon: {
    fontSize: 40,
  },
  statusTitle: {
    fontSize: Theme.typography.size.xl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
    lineHeight: Theme.typography.lineHeight.md,
  },
  statusBadge: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borders.radius.small,
    backgroundColor: Theme.colors.gray[100],
  },
  statusBadgeText: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.bold,
  },
  actionButton: {
    width: '100%',
    marginBottom: Theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.borderLight,
    width: '100%',
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
  helpText: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
    lineHeight: Theme.typography.lineHeight.md,
  },
});

export default BiometricSettings;