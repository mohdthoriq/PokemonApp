import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Container from '../../components/layout/Container';
import Loading from '../../components/common/Loading';
import ErrorScreen from '../../components/common/ErrorScreen';
import Button from '../../components/common/Button';
import { Theme } from '../../styles/themes';
import { usePokemon } from '../../hooks/usePokemon';
import { useFavorites } from '../../hooks/useFavorites';
import { RootStackParamList } from '../../types/navigation';
import { capitalizeFirst, formatNumber, formatHeight, formatWeight, getTypeColor } from '../../utils/helpers';

type PokemonDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PokemonDetail'>;
type PokemonDetailScreenRouteProp = RouteProp<RootStackParamList, 'PokemonDetail'>;

const PokemonDetail: React.FC = () => {
  const navigation = useNavigation<PokemonDetailScreenNavigationProp>();
  const route = useRoute<PokemonDetailScreenRouteProp>();
  const { pokemonId, pokemonName } = route.params;
  
  const { fetchPokemonDetail, selectedPokemon, isLoading, error } = usePokemon();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [favorite, setFavorite] = useState(false);
  const spinValue = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    loadPokemonDetail();
    checkFavoriteStatus();
  }, [pokemonId]);

  useEffect(() => {
    if (selectedPokemon) {
      startAnimations();
    }
  }, [selectedPokemon]);

  const startAnimations = () => {
    // Spin animation for pokeball
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const getImageUrl = () => {
    if (!selectedPokemon) return '';
    
    // Prefer official artwork, fallback to default sprite
    return selectedPokemon.sprites.other['official-artwork'].front_default ||
           selectedPokemon.sprites.front_default ||
           `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemon.id}.png`;
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loadPokemonDetail = async () => {
    await fetchPokemonDetail(pokemonId);
  };

  const checkFavoriteStatus = async () => {
    const favoriteStatus = await isFavorite(pokemonId);
    setFavorite(favoriteStatus);
  };

  const handleToggleFavorite = async () => {
    const success = await toggleFavorite(pokemonId);
    if (success) {
      setFavorite(!favorite);
    }
  };

  const handleRetry = () => {
    loadPokemonDetail();
  };

  if (isLoading && !selectedPokemon) {
    return (
      <Container>
        <View style={styles.loadingContainer}>
          <Animated.Image
            style={[styles.loadingIcon, { transform: [{ rotate: spin }] }]}
          />
          <Text style={styles.loadingText}>Loading {capitalizeFirst(pokemonName)}...</Text>
        </View>
      </Container>
    );
  }

  if (error && !selectedPokemon) {
    return (
      <Container>
        <ErrorScreen
          title="Pokémon Not Found"
          message={error}
          onRetry={handleRetry}
          retryButtonText="Try Again"
        />
      </Container>
    );
  }

  if (!selectedPokemon) {
    return null;
  }

  const primaryType = selectedPokemon.types[0]?.type.name || 'normal';
  const primaryColor = getTypeColor(primaryType);

  return (
    <Container>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header Section */}
          <View style={[styles.header, { backgroundColor: primaryColor }]}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.number}>
                  {formatNumber(selectedPokemon.id)}
                </Text>
                <Text style={styles.name}>
                  {capitalizeFirst(selectedPokemon.name)}
                </Text>
                <View style={styles.typesContainer}>
                  {selectedPokemon.types.map((typeInfo, index) => (
                    <View
                      key={index}
                      style={[
                        styles.typeBadge,
                        { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                      ]}
                    >
                      <Text style={styles.typeText}>
                        {capitalizeFirst(typeInfo.type.name)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={handleToggleFavorite}
              >
                <Animated.Image
                  style={[styles.favoriteIcon, { transform: [{ rotate: spin }] }]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Image Section */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: getImageUrl() }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Stats Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Base Stats</Text>
            <View style={styles.statsContainer}>
              {selectedPokemon.stats.map((stat, index) => (
                <View key={index} style={styles.statRow}>
                  <Text style={styles.statName}>
                    {capitalizeFirst(stat.stat.name.replace('-', ' '))}
                  </Text>
                  <View style={styles.statBarContainer}>
                    <View
                      style={[
                        styles.statBar,
                        {
                          width: `${(stat.base_stat / 255) * 100}%`,
                          backgroundColor: primaryColor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.statValue}>{stat.base_stat}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Height</Text>
                <Text style={styles.infoValue}>
                  {formatHeight(selectedPokemon.height)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Weight</Text>
                <Text style={styles.infoValue}>
                  {formatWeight(selectedPokemon.weight)}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Base Exp</Text>
                <Text style={styles.infoValue}>
                  {selectedPokemon.base_experience}
                </Text>
              </View>
            </View>
          </View>

          {/* Abilities Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Abilities</Text>
            <View style={styles.abilitiesContainer}>
              {selectedPokemon.abilities.map((ability, index) => (
                <View
                  key={index}
                  style={[
                    styles.abilityBadge,
                    { backgroundColor: primaryColor },
                  ]}
                >
                  <Text style={styles.abilityText}>
                    {capitalizeFirst(ability.ability.name.replace('-', ' '))}
                    {ability.is_hidden && ' (Hidden)'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  loadingIcon: {
    width: 60,
    height: 60,
    marginBottom: Theme.spacing.lg,
  },
  loadingText: {
    fontSize: Theme.typography.size.lg,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.secondary,
  },
  header: {
    padding: Theme.spacing.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Theme.shadows.medium,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  number: {
    fontSize: Theme.typography.size.lg,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.white,
    opacity: 0.8,
  },
  name: {
    fontSize: Theme.typography.size.xxxl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.white,
    marginVertical: Theme.spacing.sm,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borders.radius.small,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  typeText: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.white,
  },
  favoriteButton: {
    padding: Theme.spacing.sm,
  },
  favoriteIcon: {
    width: 40,
    height: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: -80,
    marginBottom: Theme.spacing.lg,
  },
  image: {
    width: 200,
    height: 200,
    ...Theme.shadows.large,
  },
  section: {
    padding: Theme.spacing.lg,
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borders.radius.large,
    ...Theme.shadows.small,
  },
  sectionTitle: {
    fontSize: Theme.typography.size.xl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.lg,
  },
  statsContainer: {
    gap: Theme.spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statName: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.primary,
    width: 100,
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Theme.colors.gray[200],
    borderRadius: Theme.borders.radius.small,
    marginHorizontal: Theme.spacing.md,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    borderRadius: Theme.borders.radius.small,
  },
  statValue: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    width: 30,
    textAlign: 'right',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.xs,
  },
  infoValue: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  abilityBadge: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borders.radius.medium,
  },
  abilityText: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.white,
  },
});

export default PokemonDetail;