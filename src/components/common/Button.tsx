import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { Theme } from '../../styles/themes';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = () => {
    const baseStyle = styles.base;
    const variantStyle = styles[variant];
    const sizeStyle = styles[size];
    const disabledStyle = disabled ? styles.disabled : {};
    
    return [baseStyle, variantStyle, sizeStyle, disabledStyle, style];
  };

  const getTextStyle = () => {
    const baseTextStyle = styles.baseText;
    const variantTextStyle = styles[`${variant}Text`];
    const sizeTextStyle = styles[`${size}Text`];
    const disabledTextStyle = disabled ? styles.disabledText : {};
    
    return [baseTextStyle, variantTextStyle, sizeTextStyle, disabledTextStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? Theme.colors.primary : Theme.colors.white} 
        />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Theme.borders.radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  baseText: {
    fontFamily: Theme.typography.family.medium,
    textAlign: 'center',
  },
  
  // Variants
  primary: {
    backgroundColor: Theme.colors.primary,
  },
  primaryText: {
    color: Theme.colors.white,
  },
  
  secondary: {
    backgroundColor: Theme.colors.secondary,
  },
  secondaryText: {
    color: Theme.colors.white,
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderWidth: Theme.borders.width.thin,
    borderColor: Theme.colors.primary,
  },
  outlineText: {
    color: Theme.colors.primary,
  },
  
  danger: {
    backgroundColor: Theme.colors.error,
  },
  dangerText: {
    color: Theme.colors.white,
  },
  
  // Sizes
  small: {
    paddingVertical: Theme.spacing.buttonPadding.small.vertical,
    paddingHorizontal: Theme.spacing.buttonPadding.small.horizontal,
  },
  smallText: {
    fontSize: Theme.typography.size.sm,
  },
  
  medium: {
    paddingVertical: Theme.spacing.buttonPadding.medium.vertical,
    paddingHorizontal: Theme.spacing.buttonPadding.medium.horizontal,
  },
  mediumText: {
    fontSize: Theme.typography.size.md,
  },
  
  large: {
    paddingVertical: Theme.spacing.buttonPadding.large.vertical,
    paddingHorizontal: Theme.spacing.buttonPadding.large.horizontal,
  },
  largeText: {
    fontSize: Theme.typography.size.lg,
  },
  
  // States
  disabled: {
    backgroundColor: Theme.colors.gray[300],
    borderColor: Theme.colors.gray[300],
  },
  disabledText: {
    color: Theme.colors.gray[500],
  },
});

export default Button;