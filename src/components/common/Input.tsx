import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps,
  ViewStyle 
} from 'react-native';
import { Theme } from '../../styles/themes';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={Theme.colors.gray[400]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
  },
  label: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  input: {
    borderWidth: Theme.borders.width.thin,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borders.radius.medium,
    paddingVertical: Theme.spacing.inputPadding.vertical,
    paddingHorizontal: Theme.spacing.inputPadding.horizontal,
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.primary,
    backgroundColor: Theme.colors.surface,
  },
  inputError: {
    borderColor: Theme.colors.error,
  },
  errorText: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.error,
    marginTop: Theme.spacing.xs,
  },
});

export default Input;