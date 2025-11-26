import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Theme } from '../../styles/themes';

interface LoadingProps {
  size?: 'small' | 'large';
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'large', text }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={Theme.colors.primary} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  text: {
    marginTop: Theme.spacing.md,
    fontSize: Theme.typography.size.md,
    color: Theme.colors.text.secondary,
    fontFamily: Theme.typography.family.regular,
  },
});

export default Loading;