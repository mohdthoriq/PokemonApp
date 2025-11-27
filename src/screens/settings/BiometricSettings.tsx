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
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import Container from '../../components/layout/Container';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { Theme } from '../../styles/themes';
import { useBiometric } from '../../hooks/useBiometric';
import { useAuth } from '../../hooks/useAuth';

const BiometricSettings: React.FC = () => {
  const navigation = useNavigation();
  const { 
    isAvailable, 
    biometryType, 
    isEnabled, 
    enableBiometric, 
    disableBiometric, 
    isLoading,
    authenticate 
  } = useBiometric();
  const { user } = useAuth();
  
  const [processing, setProcessing] = useState(false);
  const pulseValue = new Animated.Value(1);

  useEffect(() => {
    if (isEnabled) {
      startPulseAnimation();
    } else {
      pulseValue.stopAnimation();
      pulseValue.setValue(1);
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

  const getBiometricIconName = (): string => {
    switch (biometryType) {
      case 'FaceID':
        return 'face-smile';
      case 'TouchID':
      case 'Fingerprint':
        return 'fingerprint';
      default:
        return 'lock';
    }
  };

  const handleOpenSetupScreen = () => {
    navigation.navigate('BiometricSetup' as never);
  };

  const handleEnableBiometric = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found. Please login again.');
      return;
    }

    setProcessing(true);
    try {
      // First authenticate with biometric to ensure it's set up
      const authSuccess = await authenticate();
      
      if (!authSuccess) {
        Alert.alert(
          'Authentication Required',
          'Please authenticate with your biometric to enable it for the app.',
          [{ text: 'OK' }]
        );
        setProcessing(false);
        return;
      }

      // If authentication successful, enable biometric for the app
      const success = await enableBiometric(user.email, 'your-password-here');
      
      if (success) {
        Alert.alert(
          'Success',
          `${getBiometricName()} has been enabled successfully. You can now use it to login to the app.`
        );
      } else {
        Alert.alert(
          'Error',
          `Failed to enable ${getBiometricName()}. Please try again.`
        );
      }
    } catch (error) {
      console.error('Error enabling biometric:', error);
      Alert.alert(
        'Error',
        'An error occurred while enabling biometric authentication. Please make sure your biometric is set up in device settings.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleDisableBiometric = async () => {
    Alert.alert(
      'Disable Biometric Authentication',
      `Are you sure you want to disable ${getBiometricName()}? You will need to use your password to login.`,
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
            try {
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
            } catch (error) {
              Alert.alert('Error', 'An error occurred while disabling biometric.');
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleTestBiometric = async () => {
    try {
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
    } catch (error) {
      Alert.alert('Error', 'An error occurred during authentication.');
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
                { 
                  transform: [{ scale: pulseValue }],
                  backgroundColor: isEnabled ? Theme.colors.primaryLight : Theme.colors.gray[200]
                }
              ]}
            >
              <FontAwesome6 
                name={getBiometricIconName() as any} 
                size={40} 
                color={isEnabled ? Theme.colors.primary : Theme.colors.text.secondary} 
              />
            </Animated.View>
            
            <Text style={styles.statusTitle}>
              {isAvailable ? getBiometricName() : 'Not Available'}
            </Text>
            
            <Text style={styles.statusDescription}>
              {isAvailable
                ? isEnabled
                  ? `${getBiometricName()} is currently enabled for authentication.`
                  : `${getBiometricName()} is available but not enabled. Tap "Setup" to configure.`
                : 'Your device does not support biometric authentication or it is not set up.'}
            </Text>

            <View style={[
              styles.statusBadge,
              { 
                backgroundColor: isEnabled 
                  ? (Theme.colors.success || '#22c55e') + '20'
                  : (Theme.colors.warning || '#f59e0b') + '20'
              }
            ]}>
              <FontAwesome6 
                name={isEnabled ? "circle-check" : "circle-xmark"} 
                size={16} 
                color={isEnabled 
                  ? Theme.colors.success || '#22c55e'
                  : Theme.colors.warning || '#f59e0b'
                } 
                style={styles.badgeIcon}
              />
              <Text style={[
                styles.statusBadgeText,
                { 
                  color: isEnabled 
                    ? Theme.colors.success || '#22c55e'
                    : Theme.colors.warning || '#f59e0b'
                }
              ]}>
                {isEnabled ? 'ENABLED' : 'DISABLED'}
              </Text>
            </View>
          </View>
        </View>

        {/* Setup Section - Show only if biometric is available but not enabled */}
        {isAvailable && !isEnabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Setup Required</Text>
            <View style={styles.card}>
              <View style={styles.setupHeader}>
                <FontAwesome6 name="gear" size={24} color={Theme.colors.primary} iconStyle='solid'/>
                <Text style={styles.setupTitle}>Complete Setup</Text>
              </View>
              
              <Text style={styles.registrationDescription}>
                {`To use ${getBiometricName()}, you need to complete the setup process.`}
              </Text>
              
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <FontAwesome6 name="circle-check" size={16} color={Theme.colors.success} />
                  <Text style={styles.featureText}>Device configuration</Text>
                </View>
                <View style={styles.featureItem}>
                  <FontAwesome6 name="circle-check" size={16} color={Theme.colors.success} />
                  <Text style={styles.featureText}>App integration</Text>
                </View>
                <View style={styles.featureItem}>
                  <FontAwesome6 name="circle-check" size={16} color={Theme.colors.success} />
                  <Text style={styles.featureText}>Security setup</Text>
                </View>
              </View>

              <Button
                title={`Start ${getBiometricName()} Setup`}
                onPress={handleOpenSetupScreen}
                variant="primary"
                size="large"
                style={styles.setupButton}
                icon="arrow-right"
              />
            </View>
          </View>
        )}

        {/* Actions Section */}
        {isAvailable && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Authentication Actions</Text>
            <View style={styles.card}>
              {!isEnabled ? (
                <View style={styles.enableSection}>
                  <Text style={styles.enableDescription}>
                    {`Enable ${getBiometricName()} to use it for quick and secure login to the app.`}
                  </Text>
                  <Button
                    title={`Enable ${getBiometricName()}`}
                    onPress={handleEnableBiometric}
                    loading={processing}
                    disabled={processing}
                    variant="primary"
                    size="large"
                    style={styles.actionButton}
                    icon="lock"
                  />
                </View>
              ) : (
                <>
                  <Text style={styles.enableDescription}>
                    {`${getBiometricName()} is enabled. You can test it or disable it below.`}
                  </Text>
                  <Button
                    title={`Test ${getBiometricName()}`}
                    onPress={handleTestBiometric}
                    variant="outline"
                    size="large"
                    style={styles.actionButton}
                    icon="check"
                  />
                  
                  <Button
                    title={`Disable ${getBiometricName()}`}
                    onPress={handleDisableBiometric}
                    loading={processing}
                    disabled={processing}
                    variant="danger"
                    size="large"
                    style={styles.actionButton}
                    icon="lock-open"
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
              <View style={styles.infoLabelContainer}>
                <FontAwesome6 name="fingerprint" size={16} color={Theme.colors.text.secondary} iconStyle='solid'/>
                <Text style={styles.infoLabel}>Biometric Type</Text>
              </View>
              <Text style={styles.infoValue}>
                {isAvailable ? getBiometricName() : 'Not Available'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoLabelContainer}>
                <FontAwesome6 name="power-off" size={16} color={Theme.colors.text.secondary}iconStyle='solid' />
                <Text style={styles.infoLabel}>Status</Text>
              </View>
              <View style={styles.statusValue}>
                <FontAwesome6 
                  name={isEnabled ? "circle-check" : "circle-xmark"} 
                  size={16} 
                  color={isEnabled 
                    ? Theme.colors.success || '#22c55e'
                    : Theme.colors.warning || '#f59e0b'
                  } 
                />
                <Text style={[
                  styles.infoValue,
                  { 
                    color: isEnabled 
                      ? Theme.colors.success || '#22c55e'
                      : Theme.colors.warning || '#f59e0b',
                    marginLeft: 4
                  }
                ]}>
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoLabelContainer}>
                <FontAwesome6 name="mobile" size={16} color={Theme.colors.text.secondary} iconStyle='solid'/>
                <Text style={styles.infoLabel}>Device Support</Text>
              </View>
              <Text style={styles.infoValue}>
                {isAvailable ? 'Supported' : 'Not Supported'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoLabelContainer}>
                <FontAwesome6 name="shield-halved" size={16} color={Theme.colors.text.secondary}iconStyle='solid' />
                <Text style={styles.infoLabel}>Security Level</Text>
              </View>
              <Text style={[styles.infoValue, { color: Theme.colors.success }]}>
                High
              </Text>
            </View>
          </View>
        </View>

        {/* Help Section */}
        {!isAvailable && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Help</Text>
            <View style={styles.card}>
              <View style={styles.helpHeader}>
                <FontAwesome6 name="circle-question" size={24} color={Theme.colors.text.primary} iconStyle='solid'/>
                <Text style={styles.helpTitle}>Setup Instructions</Text>
              </View>
              <View style={styles.helpItems}>
                <View style={styles.helpItem}>
                  <FontAwesome6 name="mobile" size={16} color={Theme.colors.text.secondary} iconStyle='solid'/>
                  <Text style={styles.helpText}>Ensure your device supports {getBiometricName()}</Text>
                </View>
                <View style={styles.helpItem}>
                  <FontAwesome6 name="gear" size={16} color={Theme.colors.text.secondary} iconStyle='solid'/>
                  <Text style={styles.helpText}>Set up {getBiometricName()} in device settings</Text>
                </View>
                <View style={styles.helpItem}>
                  <FontAwesome6 name="lock" size={16} color={Theme.colors.text.secondary}iconStyle='solid' />
                  <Text style={styles.helpText}>Enable screen lock security</Text>
                </View>
                <View style={styles.helpItem}>
                  <FontAwesome6 name="user-shield" size={16} color={Theme.colors.text.secondary}iconStyle='solid' />
                  <Text style={styles.helpText}>Grant permission to this app</Text>
                </View>
              </View>
              <View style={styles.securityNote}>
                <FontAwesome6 name="shield" size={16} color={Theme.colors.text.secondary} iconStyle='solid' />
                <Text style={styles.securityText}>
                  Biometric data is stored securely on your device and is never shared with our servers.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </Container>
  );
}

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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borders.radius.small,
  },
  badgeIcon: {
    marginRight: Theme.spacing.xs,
  },
  statusBadgeText: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.bold,
  },
  setupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  setupTitle: {
    fontSize: Theme.typography.size.lg,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    marginLeft: Theme.spacing.sm,
  },
  registrationDescription: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
    lineHeight: Theme.typography.lineHeight.md,
  },
  featureList: {
    width: '100%',
    marginBottom: Theme.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  featureText: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.primary,
    marginLeft: Theme.spacing.sm,
  },
  setupButton: {
    width: '100%',
  },
  actionButton: {
    width: '100%',
    marginBottom: Theme.spacing.md,
  },
  enableSection: {
    width: '100%',
    alignItems: 'center',
  },
  enableDescription: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
    lineHeight: Theme.typography.lineHeight.md,
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
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.primary,
    marginLeft: Theme.spacing.sm,
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    width: '100%',
  },
  helpTitle: {
    fontSize: Theme.typography.size.lg,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    marginLeft: Theme.spacing.sm,
  },
  helpItems: {
    width: '100%',
    marginBottom: Theme.spacing.lg,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  helpText: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Theme.colors.gray[50],
    borderRadius: Theme.borders.radius.medium,
    padding: Theme.spacing.md,
    width: '100%',
  },
  securityText: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
    marginLeft: Theme.spacing.sm,
    flex: 1,
    fontStyle: 'italic',
  },
});

export default BiometricSettings;