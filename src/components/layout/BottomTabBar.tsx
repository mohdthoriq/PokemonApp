import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// Type untuk icon names yang tersedia di FontAwesome6
type FontAwesome6IconName = 
  | 'house'
  | 'magnifying-glass'
  | 'compass'
  | 'dragon'
  | 'heart'
  | 'user'
  | 'user-circle'
  | 'gear'
  | 'fingerprint'
  | 'shield-halved'
  | 'bell'
  | 'message'
  | 'circle';

const BottomTabBar: React.FC<BottomTabBarProps> = ({ 
  state, 
  descriptors, 
  navigation 
}) => {
  // Gunakan useRef untuk menyimpan semua animasi
  const animationsRef = useRef<{
    scale: Animated.Value[];
    bounce: Animated.Value[];
    glow: Animated.Value[];
    iconScale: Animated.Value[];
    pulse: Animated.Value[];
  }>({
    scale: [],
    bounce: [],
    glow: [],
    iconScale: [],
    pulse: []
  });

  // Initialize animations sekali saja
  if (animationsRef.current.scale.length === 0) {
    for (let i = 0; i < state.routes.length; i++) {
      animationsRef.current.scale[i] = new Animated.Value(1);
      animationsRef.current.bounce[i] = new Animated.Value(0);
      animationsRef.current.glow[i] = new Animated.Value(0);
      animationsRef.current.iconScale[i] = new Animated.Value(1);
      animationsRef.current.pulse[i] = new Animated.Value(1);
    }
  }

  // Function to get icon name based on route name dengan type yang benar
  const getIconName = (routeName: string): FontAwesome6IconName => {
    const iconMap: { [key: string]: FontAwesome6IconName } = {
      'pokemonlist': 'dragon', // Icon dragon untuk Pokémon
      'favorites': 'heart',    // Icon heart untuk Favorites
      'home': 'house',
      'explore': 'magnifying-glass',
      'discover': 'compass',
      'pokedex': 'dragon',
      'pokemon': 'dragon',
      'favourites': 'heart',
      'profile': 'user',
      'account': 'user-circle',
      'settings': 'gear',
      'biometric': 'fingerprint',
      'security': 'shield-halved',
      'notifications': 'bell',
      'messages': 'message',
    };
    
    return iconMap[routeName.toLowerCase()] || 'circle';
  };

  // Animasi untuk tab aktif
  useEffect(() => {
    state.routes.forEach((_, index) => {
      if (state.index === index) {
        // Bounce animation dengan tema kuning
        Animated.sequence([
          Animated.timing(animationsRef.current.bounce[index], {
            toValue: -5,
            duration: 150,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.spring(animationsRef.current.bounce[index], {
            toValue: 0,
            friction: 4,
            tension: 100,
            useNativeDriver: true,
          })
        ]).start();

        // Icon scale animation dengan efek lebih dramatis
        Animated.sequence([
          Animated.spring(animationsRef.current.iconScale[index], {
            toValue: 1.3,
            friction: 2,
            tension: 150,
            useNativeDriver: true,
          }),
          Animated.spring(animationsRef.current.iconScale[index], {
            toValue: 1.15,
            friction: 3,
            tension: 80,
            useNativeDriver: true,
          })
        ]).start();

        // Pulse animation untuk background
        Animated.loop(
          Animated.sequence([
            Animated.timing(animationsRef.current.pulse[index], {
              toValue: 1.1,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(animationsRef.current.pulse[index], {
              toValue: 1,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();

        // Gold glow animation - gunakan native driver untuk opacity
        Animated.loop(
          Animated.sequence([
            Animated.timing(animationsRef.current.glow[index], {
              toValue: 1,
              duration: 1500,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(animationsRef.current.glow[index], {
              toValue: 0.6,
              duration: 1500,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        // Reset animations untuk tab tidak aktif
        animationsRef.current.bounce[index].setValue(0);
        animationsRef.current.iconScale[index].setValue(1);
        animationsRef.current.pulse[index].setValue(1);
        animationsRef.current.glow[index].stopAnimation();
        animationsRef.current.glow[index].setValue(0);
      }
    });
  }, [state.index]);

  const handlePressIn = (index: number) => {
    Animated.spring(animationsRef.current.scale[index], {
      toValue: 0.88,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(animationsRef.current.scale[index], {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Background dengan gradient biru */}
      <View style={styles.background} />
      
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;
        const iconName = getIconName(route.name);
        const iconColor = isFocused ? '#1E3A8A' :'#FFD700';

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

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPressIn={() => handlePressIn(index)}
            onPressOut={() => handlePressOut(index)}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
            activeOpacity={0.8}
          >
            <Animated.View 
              style={[
                styles.tabContent,
                {
                  transform: [
                    { scale: animationsRef.current.scale[index] },
                    { translateY: animationsRef.current.bounce[index] }
                  ]
                }
              ]}
            >
              {/* Gold Glow Effect */}
              {isFocused && (
                <Animated.View 
                  style={[
                    styles.glowEffect,
                    {
                      opacity: animationsRef.current.glow[index],
                      transform: [{ scale: animationsRef.current.pulse[index] }]
                    }
                  ]} 
                />
              )}
              
              {/* Icon Container dengan background biru */}
              <Animated.View style={[
                styles.iconContainer,
                isFocused && styles.iconContainerActive,
                {
                  transform: [{ scale: animationsRef.current.iconScale[index] }]
                }
              ]}>
                <FontAwesome6 
                  name={iconName as any} 
                  size={22}
                  color={iconColor}
                  iconStyle='solid'// Gunakan properti solid untuk icon style
                />
              </Animated.View>
              
              {/* Label */}
              <Text style={[
                styles.tabText,
                isFocused && styles.tabTextFocused
              ]}>
                {label}
              </Text>

              {/* Active Indicator emas */}
              {isFocused && (
                <Animated.View 
                  style={[
                    styles.activeIndicator,
                    {
                      opacity: animationsRef.current.glow[index],
                      transform: [{ scale: animationsRef.current.pulse[index] }]
                    }
                  ]} 
                />
              )}
            </Animated.View>

            {/* Gold Particle Effects */}
            {isFocused && (
              <Animated.View 
                style={[
                  styles.particle,
                  {
                    opacity: animationsRef.current.glow[index],
                    transform: [
                      { 
                        translateY: animationsRef.current.glow[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -6]
                        })
                      }
                    ]
                  }
                ]} 
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1E3A8A',
    borderTopWidth: 3,
    borderTopColor: '#FFD700',
    paddingHorizontal: 2,
    paddingBottom: 2,
    paddingTop: 2,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    borderLeftWidth: 2,
    borderLeftColor: '#3B82F6',
    borderRightWidth: 2,
    borderRightColor: '#3B82F6',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E3A8A',
    opacity: 0.95,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -12,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFD700',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#93C5FD',
    marginTop: 4,
    textAlign: 'center',
  },
  tabTextFocused: {
    color: '#FFD700',
    fontWeight: '900',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFD700',
    bottom: 2,
    left: '50%',
    marginLeft: -2,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
});

export default BottomTabBar;