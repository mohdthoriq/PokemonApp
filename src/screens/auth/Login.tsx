import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
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
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    checkBiometricLogin();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();
  };

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
    return <Loading text="Loading..." type="spinner" />;
  }

  return (
    <Container safeArea={false}>
      {/* Animated Background */}
      <View style={styles.background} />
      
      {/* Floating Pokeballs */}
      <View style={[styles.floatingIcon, styles.pokeball1]}>
        <FontAwesome6 name="dragon" size={40} color={Theme.colors.primary} iconStyle='solid'/>
      </View>
      <View style={[styles.floatingIcon, styles.pokeball2]}>
        <FontAwesome6 name="dragon" size={30} color={Theme.colors.secondary} iconStyle='solid'/>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              styles.content,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <FontAwesome6 name="dragon" size={80} color={Theme.colors.primary} iconStyle='solid'/>
              </View>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Sign in to your Pokedex account</Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                error={errors.email}
                autoCapitalize="none"
                keyboardType="email-address"
                icon="envelope"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                error={errors.password}
                secureTextEntry
                icon="lock"
              />

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={isSubmitting}
                disabled={isSubmitting}
                variant="primary"
                size="large"
                style={styles.loginButton}
                icon="right-to-bracket"
                iconPosition="right"
              />

              {isAvailable && isEnabled && (
                <Button
                  title="Sign In with Biometric"
                  onPress={handleBiometricLogin}
                  variant="outline"
                  size="large"
                  style={styles.biometricButton}
                  icon="fingerprint"
                  iconPosition="left"
                />
              )}

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={navigateToRegister}>
                  <Text style={styles.registerLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <FontAwesome6 name="shield-halved" size={16} color={Theme.colors.text.secondary} iconStyle='solid' />
              <Text style={styles.footerText}>Secure authentication</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    backgroundColor: Theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Theme.spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  floatingIcon: {
    position: 'absolute',
    opacity: 0.1,
  },
  pokeball1: {
    top: 100,
    left: 30,
  },
  pokeball2: {
    bottom: 150,
    right: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(220, 10, 45, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    borderWidth: 3,
    borderColor: Theme.colors.primary,
    ...Theme.shadows.medium,
  },
  title: {
    fontSize: Theme.typography.size.xxxl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
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
    padding: Theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: Theme.borders.radius.medium,
  },
  registerText: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
  },
  registerLink: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.xxl,
    padding: Theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: Theme.borders.radius.medium,
  },
  footerText: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.secondary,
    marginLeft: Theme.spacing.sm,
  },
});

export default Login;