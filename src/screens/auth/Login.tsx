import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Container from '../../components/layout/Container';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { Theme } from '../../styles/themes';
import { useAuth } from '../../hooks/useAuth';
import { useBiometric } from '../../hooks/useBiometric';
import { RootStackParamList, AuthStackParamList } from '../../types/navigation';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList & AuthStackParamList>;
const Login: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, biometricLogin, isLoading: authLoading } = useAuth();
  const { isAvailable, isEnabled, authenticate, isLoading: biometricLoading } = useBiometric();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkBiometricLogin();
  }, []);

  const checkBiometricLogin = async () => {
    if (isEnabled) {
      const success = await biometricLogin();
      if (success) {
        // Biometric login successful, navigation handled by auth hook
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const success = await login(formData);

    if (success) {
      navigation.navigate('Main');
    } else {
      setErrors({
        email: 'Invalid credentials',
        password: 'Invalid credentials',
      });

    }

    setIsSubmitting(false);
  };

  const handleBiometricLogin = async () => {
    const success = await biometricLogin();
    if (!success) {
      setErrors({
        email: 'Biometric authentication failed',
        password: 'Biometric authentication failed',
      });
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Auth', { screen: 'Register' });
  };

  if (authLoading || biometricLoading) {
    return <Loading text="Loading..." />;
  }

  return (
    <Container>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to your Pokedex account</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
              error={errors.password}
              secureTextEntry
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isSubmitting}
              disabled={isSubmitting}
              variant="primary"
              size="large"
              style={styles.loginButton}
            />

            {isAvailable && isEnabled && (
              <Button
                title="Sign In with Biometric"
                onPress={handleBiometricLogin}
                variant="outline"
                size="large"
                style={styles.biometricButton}
              />
            )}

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  title: {
    fontSize: Theme.typography.size.xxxl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: Theme.spacing.md,
  },
  biometricButton: {
    marginTop: Theme.spacing.sm,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Theme.spacing.xl,
  },
  registerText: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
  },
  registerLink: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.primary,
  },
});

export default Login;