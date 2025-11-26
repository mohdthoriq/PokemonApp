import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Container from '../../components/layout/Container';
import PokemonCard from '../../components/common/PokemonCard';
import Loading from '../../components/common/Loading';
import ErrorScreen from '../../components/common/ErrorScreen';
import Button from '../../components/common/Button';
import { Theme } from '../../styles/themes';
import { useFavorites } from '../../hooks/useFavorites';
import { usePokemon } from '../../hooks/usePokemon';
import { Pokemon, PokemonListItem } from '../../types/pokemon';
import { RootStackParamList } from '../../types/navigation';
import { capitalizeFirst } from '../../utils/helpers';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Favorites: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const isFocused = useIsFocused();
  
  const { favorites, isLoading: favoritesLoading, clearFavorites } = useFavorites();
  const { fetchPokemonDetail } = usePokemon();
  
  const [favoritePokemon, setFavoritePokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bounceValue = new Animated.Value(0);

  useEffect(() => {
    if (isFocused) {
      loadFavoritePokemon();
      startBounceAnimation();
    }
  }, [favorites, isFocused]);

  const startBounceAnimation = () => {
    bounceValue.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const bounce = bounceValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const loadFavoritePokemon = async () => {
    try {
      setLoading(true);
      setError(null);

      if (favorites.length === 0) {
        setFavoritePokemon([]);
        setLoading(false);
        return;
      }

      const pokemonDetails = await Promise.all(
        favorites.map(id => fetchPokemonDetail(id))
      );

      const validPokemon = pokemonDetails.filter(
        (pokemon): pokemon is Pokemon => pokemon !== null
      );

      setFavoritePokemon(validPokemon);
    } catch (err) {
      setError('Failed to load favorite Pokémon');
      console.error('Error loading favorite Pokémon:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePokemonPress = (pokemon: Pokemon) => {
    navigation.navigate('PokemonDetail', {
      pokemonId: pokemon.id,
      pokemonName: pokemon.name,
    });
  };

  const handleClearFavorites = async () => {
    const success = await clearFavorites();
    if (success) {
      setFavoritePokemon([]);
    }
  };

  const handleRetry = () => {
    loadFavoritePokemon();
  };

  const convertToPokemonListItem = (pokemon: Pokemon): PokemonListItem => ({
    name: pokemon.name,
    url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
    id: pokemon.id,
  });

  // Render loading animation dengan emoji atau ActivityIndicator
  const renderLoadingAnimation = () => (
    <Animated.View style={{ transform: [{ translateY: bounce }] }}>
      <Text style={styles.loadingIcon}>⭐</Text>
    </Animated.View>
  );

  if (favoritesLoading || loading) {
    return (
      <Container>
        <View style={styles.loadingContainer}>
          {renderLoadingAnimation()}
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorScreen
          title="Error Loading Favorites"
          message={error}
          onRetry={handleRetry}
          retryButtonText="Try Again"
        />
      </Container>
    );
  }

  if (favoritePokemon.length === 0) {
    return (
      <Container>
        <View style={styles.emptyContainer}>
          <Animated.View style={{ transform: [{ translateY: bounce }] }}>
            <Text style={styles.emptyIcon}>💔</Text>
          </Animated.View>
          <Text style={styles.emptyTitle}>No Favorite Pokémon</Text>
          <Text style={styles.emptyMessage}>
            Start adding Pokémon to your favorites by tapping the heart icon on their detail page.
          </Text>
          <Button
            title="Explore Pokémon"
            onPress={() => navigation.navigate('Main')}
            variant="primary"
            style={styles.exploreButton}
          />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.title}>Favorite Pokémon</Text>
        <Text style={styles.subtitle}>
          {favoritePokemon.length} {favoritePokemon.length === 1 ? 'Pokémon' : 'Pokémon'} saved
        </Text>
        
        <Button
          title="Clear All Favorites"
          onPress={handleClearFavorites}
          variant="outline"
          size="small"
          style={styles.clearButton}
        />
      </View>

      <FlatList
        data={favoritePokemon}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={convertToPokemonListItem(item)}
            pokemonId={item.id}
            types={item.types.map(type => type.type.name)}
            onPress={() => handlePokemonPress(item)}
          />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  loadingIcon: {
    fontSize: 60,
    marginBottom: Theme.spacing.lg,
  },
  loadingText: {
    fontSize: Theme.typography.size.lg,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: Theme.spacing.lg,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: Theme.typography.size.xl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    lineHeight: Theme.typography.lineHeight.md,
  },
  exploreButton: {
    minWidth: 200,
  },
  header: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
  },
  title: {
    fontSize: Theme.typography.size.xxl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.white,
    opacity: 0.9,
    marginBottom: Theme.spacing.lg,
  },
  clearButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  listContainer: {
    padding: Theme.spacing.sm,
  },
});

export default Favorites;