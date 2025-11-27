import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Easing 
} from 'react-native';
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { PokemonListItem } from '../../types/pokemon';
import { Theme } from '../../styles/themes';
import { capitalizeFirst, formatNumber, getTypeColor } from '../../utils/helpers';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onPress: (pokemon: PokemonListItem) => void;
  pokemonId: number;
  types?: string[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ 
  pokemon, 
  onPress, 
  pokemonId,
  types = [],
  isFavorite = false,
  onToggleFavorite
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const favoriteAnim = useRef(new Animated.Value(isFavorite ? 1 : 0)).current;

  // Use the official artwork from PokeAPI
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  useEffect(() => {
    // Subtle floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Favorite animation
    Animated.spring(favoriteAnim, {
      toValue: isFavorite ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [isFavorite]);

  const handlePress = () => {
    // Press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
    ]).start();

    onPress(pokemon);
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();

    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleFavoritePress = () => {
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-5deg'],
  });

  const translateY = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  const favoriteScale = favoriteAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const primaryType = types[0] || 'normal';
  const cardColor = getTypeColor(primaryType);

  // Fallback image if the official artwork doesn't exist
  const handleImageError = (e: any) => {
    e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          transform: [
            { scale: scaleAnim },
            { rotate },
            { translateY }
          ]
        }
      ]}
    >
      <TouchableOpacity 
        style={[
          styles.card,
          { backgroundColor: 'rgba(255, 215, 0, 0.15)', borderColor: cardColor, shadowColor: cardColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8, }
        ]} 
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {/* Favorite Button */}
        {onToggleFavorite && (
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Animated.View style={{ transform: [{ scale: favoriteScale }] }}>
              <FontAwesome6 
                name={isFavorite ? 'heart' : 'heart-circle-plus'} 
                size={20} 
                color={isFavorite ? '#FF4757' : Theme.colors.white}
                iconStyle='solid'
              />
            </Animated.View>
          </TouchableOpacity>
        )}

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
            onError={handleImageError}
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.number}>{formatNumber(pokemonId)}</Text>
          <Text style={styles.name}>{capitalizeFirst(pokemon.name)}</Text>
          
          {types.length > 0 && (
            <View style={styles.typesContainer}>
              {types.map((type, index) => (
                <View
                  key={index}
                  style={[
                    styles.typeBadge,
                    { backgroundColor: getTypeColor(type) },
                  ]}
                >
                  <FontAwesome6 
                    name="diamond" 
                    size={8} 
                    color={Theme.colors.white}
                    style={styles.typeIcon}
                    iconStyle='solid'
                  />
                  <Text style={styles.typeText}>{capitalizeFirst(type)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Card Glow Effect */}
        <Animated.View 
          style={[
            styles.cardGlow,
            { backgroundColor: cardColor, opacity: glowAnim }
          ]} 
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    borderRadius: 20,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 3,
    borderStyle: 'solid',
    minHeight: 180,
    overflow: 'hidden',
    position: 'relative',
    // Gradient effect background
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
    zIndex: 2,
  },
  image: {
    width: 100,
    height: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  infoContainer: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  number: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '800',
    color: '#8B7500',
    backgroundColor: 'rgba(255, 215, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  name: {
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '900',
    color: '#4B3F00',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
    minWidth: 70,
    justifyContent: 'center',
  },
  typeIcon: {
    marginRight: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  typeText: {
    fontSize: 11,
    fontFamily: 'System',
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.3,
  },
  cardGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 40,
    opacity: 0.1,
    zIndex: 1,
  },
});

export default PokemonCard;