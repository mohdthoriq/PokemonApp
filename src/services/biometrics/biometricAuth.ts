import ReactNativeBiometrics from 'react-native-biometrics';
import Keychain from 'react-native-keychain';
import { STORAGE_KEYS, BIOMETRIC_TYPE } from '../../utils/constans';

class BiometricAuthService {
  private reactNativeBiometrics = ReactNativeBiometrics;

  async isBiometricAvailable(): Promise<{
    available: boolean;
    biometryType?: string;
    error?: string;
  }> {
    try {
      const { available, biometryType } = await this.reactNativeBiometrics.isSensorAvailable();
      
      return {
        available,
        biometryType: biometryType || undefined,
      };
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return {
        available: false,
        error: 'Biometric check failed',
      };
    }
  }

  async enableBiometricAuth(username: string, password: string): Promise<boolean> {
    try {
      const { available } = await this.isBiometricAvailable();
      
      if (!available) {
        throw new Error('Biometric authentication not available');
      }

      // Create biometric signature
      const { success, signature } = await this.reactNativeBiometrics.createSignature({
        promptMessage: 'Enable biometric login for Pokedex App',
        payload: username,
      });

      if (success && signature) {
        // Store biometric enabled flag
        await Keychain.setInternetCredentials(
          STORAGE_KEYS.BIOMETRIC_ENABLED,
          username,
          'true',
          { accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
        );

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error enabling biometric auth:', error);
      return false;
    }
  }

  async disableBiometricAuth(): Promise<boolean> {
    try {
      await Keychain.resetInternetCredentials(STORAGE_KEYS.BIOMETRIC_ENABLED);
      return true;
    } catch (error) {
      console.error('Error disabling biometric auth:', error);
      return false;
    }
  }

  async isBiometricEnabled(): Promise<boolean> {
    try {
      const credentials = await Keychain.getInternetCredentials(STORAGE_KEYS.BIOMETRIC_ENABLED);
      return !!credentials && credentials.password === 'true';
    } catch (error) {
      console.error('Error checking biometric status:', error);
      return false;
    }
  }

  async authenticateWithBiometric(): Promise<boolean> {
    try {
      const { success } = await this.reactNativeBiometrics.simplePrompt({
        promptMessage: 'Authenticate to access Pokedex App',
      });

      return success;
    } catch (error) {
      console.error('Error with biometric authentication:', error);
      return false;
    }
  }
}

export default new BiometricAuthService();