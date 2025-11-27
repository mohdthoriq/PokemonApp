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
import { Theme } from '../../styles/themes';
import { useAuth } from '../../hooks/useAuth';
import { AuthStackParamList } from '../../types/navigation';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const Register: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
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

  const validateForm = (): boolean => {
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const success = await register(formData);
    
    if (!success) {
      setErrors({
        ...errors,
        email: 'Registration failed. Please try again.',
      });
    }
    
    setIsSubmitting(false);
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <Container safeArea={false}>
      {/* Background Elements */}
      <View style={styles.background} />
      
      {/* Floating Icons */}
      <View style={[styles.floatingIcon, styles.icon1]}>
        <FontAwesome6 name="user-plus" size={35} color={Theme.colors.primary}iconStyle='solid' />
      </View>
      <View style={[styles.floatingIcon, styles.icon2]}>
        <FontAwesome6 name="shield-halved" size={25} color={Theme.colors.secondary} iconStyle='solid'/>
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
                <FontAwesome6 name="user-plus" size={70} color={Theme.colors.primary} iconStyle='solid'/>
              </View>
              <Text style={styles.title}>Join the Adventure!</Text>
              <Text style={styles.subtitle}>Create your Pokedex account</Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              <Input
                label="Username"
                placeholder="Choose a username"
                value={formData.username}
                onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
                error={errors.username}
                autoCapitalize="none"
                icon="user"
              />

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
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                error={errors.password}
                secureTextEntry
                icon="lock"
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                error={errors.confirmPassword}
                secureTextEntry
                icon="lock"
              />

              <Button
                title="Create Account"
                onPress={handleRegister}
                loading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
                variant="success"
                size="large"
                style={styles.registerButton}
                icon="user-plus"
                iconPosition="left"
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Features Section */}
            <View style={styles.features}>
              <Text style={styles.featuresTitle}>Why Join Pokedex?</Text>
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <FontAwesome6 name="dragon" size={20} color={Theme.colors.primary} iconStyle='solid'/>
                  <Text style={styles.featureText}>Discover all Pokémon</Text>
                </View>
                <View style={styles.featureItem}>
                  <FontAwesome6 name="heart" size={20} color={Theme.colors.primary} />
                  <Text style={styles.featureText}>Save favorites</Text>
                </View>
                <View style={styles.featureItem}>
                  <FontAwesome6 name="shield-halved" size={20} color={Theme.colors.primary}iconStyle='solid' />
                  <Text style={styles.featureText}>Secure account</Text>
                </View>
              </View>
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
  icon1: {
    top: 80,
    right: 30,
  },
  icon2: {
    bottom: 120,
    left: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(40, 167, 69, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    borderWidth: 3,
    borderColor: Theme.colors.success,
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
  registerButton: {
    marginTop: Theme.spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Theme.spacing.xl,
    padding: Theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: Theme.borders.radius.medium,
  },
  loginText: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
  },
  loginLink: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.primary,
  },
  features: {
    marginTop: Theme.spacing.xl,
    padding: Theme.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: Theme.borders.radius.large,
    width: '100%',
    maxWidth: 400,
  },
  featuresTitle: {
    fontSize: Theme.typography.size.lg,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  featureList: {
    gap: Theme.spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.sm,
  },
  featureText: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.primary,
    marginLeft: Theme.spacing.md,
  },
});

export default Register;