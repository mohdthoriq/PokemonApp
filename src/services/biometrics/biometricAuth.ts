import { 
  isSensorAvailable,
  simplePrompt
} from '@sbaiahmed1/react-native-biometrics';
import Keychain from 'react-native-keychain';
import { STORAGE_KEYS } from '../../utils/constans';

class BiometricAuthService {

  async isBiometricAvailable() {
    try {
      const result = await isSensorAvailable();
      return {
        available: result.available,
        biometryType: result.biometryType
      };
    } catch (e) {
      console.log('Biometric check failed:', e);
      return { available: false };
    }
  }

  async enableBiometricAuth(username: string, password: string) {
    try {
      const { available } = await this.isBiometricAvailable();
      if (!available) return false;

      // Prompt biometric
      const { success } = await simplePrompt('Enable biometric login for Pokedex App');
      if (!success) return false;

      // Simpan credentials
      await Keychain.setGenericPassword(username, password, {
        service: STORAGE_KEYS.BIOMETRIC_ENABLED,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY
      });

      // Simpan flag biometric aktif
      await Keychain.setGenericPassword('biometric_enabled', 'true', {
        service: STORAGE_KEYS.BIOMETRIC_STATUS,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY
      });

      return true;

    } catch (e) {
      console.log('Enable biometric error:', e);
      return false;
    }
  }

  async disableBiometricAuth() {
    try {
      await Keychain.resetGenericPassword({ service: STORAGE_KEYS.BIOMETRIC_ENABLED });
      await Keychain.resetGenericPassword({ service: STORAGE_KEYS.BIOMETRIC_STATUS });
      return true;
    } catch (e) {
      console.log('Disable biometric error:', e);
      return false;
    }
  }

  async isBiometricEnabled() {
    try {
      const flag = await Keychain.getGenericPassword({
        service: STORAGE_KEYS.BIOMETRIC_STATUS
      });
      if (!flag) return false;
      return flag?.password === 'true';
    } catch (e) {
      console.log('Check biometric status error:', e);
      return false;
    }
  }

  async getStoredCredentials() {
    try {
      const creds = await Keychain.getGenericPassword({
        service: STORAGE_KEYS.BIOMETRIC_ENABLED
      });

      if (!creds) return null;

      return {
        username: creds.username,
        password: creds.password
      };

    } catch (e) {
      console.log('Get stored credentials error:', e);
      return null;
    }
  }

  async authenticateWithBiometric() {
    try {
      const { success } = await simplePrompt('Authenticate to access Pokedex App');
      if (!success) return { success: false };

      const credentials = await this.getStoredCredentials();
      return { success: true, credentials };

    } catch (e) {
      console.log('Biometric auth error:', e);
      return { success: false };
    }
  }
}

export default new BiometricAuthService();
