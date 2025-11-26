import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { PokemonListItem } from '../../types/pokemon';
import { Theme } from '../../styles/themes';
import { capitalizeFirst, formatNumber, getTypeColor } from '../../utils/helpers';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onPress: (pokemon: PokemonListItem) => void;
  pokemonId: number;
  types?: string[];
}

const PokemonCard: React.FC<PokemonCardProps> = ({ 
  pokemon, 
  onPress, 
  pokemonId,
  types = [] 
}) => {
  // Use the official artwork from PokeAPI
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  const handlePress = () => {
    onPress(pokemon);
  };

  // Fallback image if the official artwork doesn't exist
  const handleImageError = (e: any) => {
    e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.card}>
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
                  <Text style={styles.typeText}>{capitalizeFirst(type)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: Theme.spacing.sm,
    maxWidth: '50%',
  },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borders.radius.large,
    padding: Theme.spacing.md,
    ...Theme.shadows.medium,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.sm,
    backgroundColor: Theme.colors.gray[50],
    borderRadius: Theme.borders.radius.medium,
    padding: Theme.spacing.sm,
  },
  image: {
    width: 80,
    height: 80,
  },
  infoContainer: {
    alignItems: 'center',
  },
  number: {
    fontSize: Theme.typography.size.xs,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.xs,
  },
  name: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borders.radius.small,
    margin: Theme.spacing.xs,
  },
  typeText: {
    fontSize: Theme.typography.size.xs,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.white,
  },
});

export default PokemonCard;