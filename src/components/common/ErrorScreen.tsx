import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';
import { Theme } from '../../styles/themes';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryButtonText?: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title = 'Error',
  message = 'Something went wrong',
  onRetry,
  retryButtonText = 'Try Again',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          title={retryButtonText}
          onPress={onRetry}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
    backgroundColor: Theme.colors.background,
  },
  title: {
    fontSize: Theme.typography.size.xl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.md,
  },
  message: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    lineHeight: Theme.typography.lineHeight.md,
  },
  button: {
    minWidth: 120,
  },
});

export default ErrorScreen;