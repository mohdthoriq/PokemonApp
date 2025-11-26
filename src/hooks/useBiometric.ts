import { useState, useEffect, useCallback } from 'react';
import BiometricAuthService from '../services/biometrics/biometricAuth';

export const useBiometric = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const [availability, enabled] = await Promise.all([
        BiometricAuthService.isBiometricAvailable(),
        BiometricAuthService.isBiometricEnabled(),
      ]);

      setIsAvailable(availability.available);
      setBiometryType(availability.biometryType || '');
      setIsEnabled(enabled);
    } catch (error) {
      console.error('Error checking biometric status:', error);
      setIsAvailable(false);
      setIsEnabled(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const enableBiometric = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const success = await BiometricAuthService.enableBiometricAuth(username, password);
      if (success) {
        setIsEnabled(true);
      }
      return success;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return false;
    }
  }, []);

  const disableBiometric = useCallback(async (): Promise<boolean> => {
    try {
      const success = await BiometricAuthService.disableBiometricAuth();
      if (success) {
        setIsEnabled(false);
      }
      return success;
    } catch (error) {
      console.error('Error disabling biometric:', error);
      return false;
    }
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    try {
      return await BiometricAuthService.authenticateWithBiometric();
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      return false;
    }
  }, []);

  return {
    isAvailable,
    biometryType,
    isEnabled,
    isLoading,
    enableBiometric,
    disableBiometric,
    authenticate,
    refreshStatus: checkBiometricStatus,
  };
};