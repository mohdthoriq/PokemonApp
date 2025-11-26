import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Theme } from '../../styles/themes';

const BottomTabBar: React.FC<BottomTabBarProps> = ({ 
  state, 
  descriptors, 
  navigation 
}) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tab}
          >
            <View style={[
              styles.tabContent,
              isFocused && styles.tabContentFocused
            ]}>
              <Text style={[
                styles.tabText,
                isFocused && styles.tabTextFocused
              ]}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingBottom: Theme.spacing.sm,
    ...Theme.shadows.medium,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  tabContent: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borders.radius.round,
  },
  tabContentFocused: {
    backgroundColor: Theme.colors.primaryLight,
  },
  tabText: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.secondary,
  },
  tabTextFocused: {
    color: Theme.colors.primary,
    fontFamily: Theme.typography.family.bold,
  },
});

export default BottomTabBar;