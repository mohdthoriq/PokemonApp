import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Container from '../../components/layout/Container';
import PokemonCard from '../../components/common/PokemonCard';
import Loading from '../../components/common/Loading';
import ErrorScreen from '../../components/common/ErrorScreen';
import { Theme } from '../../styles/themes';
import { usePokemon } from '../../hooks/usePokemon';
import { PokemonListItem } from '../../types/pokemon';
import { RootStackParamList } from '../../types/navigation';

type PokemonListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PokemonList: React.FC = () => {
  const navigation = useNavigation<PokemonListScreenNavigationProp>();
  const { pokemonList, isLoading, error, hasMore, fetchPokemonList, refreshList } = usePokemon();
  
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    startLoadingAnimation();
  }, []);

  const startLoadingAnimation = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handlePokemonPress = (pokemon: PokemonListItem) => {
    const pokemonId = (pokemon as any).id || parseInt(pokemon.url.split('/').slice(-2, -1)[0], 10);
    navigation.navigate('PokemonDetail', {
      pokemonId,
      pokemonName: pokemon.name,
    });
  };

  const handleLoadMore = async () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      await fetchPokemonList();
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshList();
    setRefreshing(false);
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footer}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Text style={styles.loadingIcon}>🌀</Text>
        </Animated.View>
        <Text style={styles.footerText}>Loading more Pokémon...</Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Pokédex</Text>
      <Text style={styles.subtitle}>
        Discover and explore all Pokémon creatures
      </Text>
    </View>
  );

  if (isLoading && pokemonList.length === 0) {
    return (
      <Container>
        <View style={styles.loadingContainer}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Text style={styles.loadingIconLarge}>🌀</Text>
          </Animated.View>
          <Text style={styles.loadingText}>Loading Pokémon...</Text>
        </View>
      </Container>
    );
  }

  if (error && pokemonList.length === 0) {
    return (
      <Container>
        <ErrorScreen
          title="Oops!"
          message={error}
          onRetry={refreshList}
          retryButtonText="Try Again"
        />
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          const pokemonId = (item as any).id || parseInt(item.url.split('/').slice(-2, -1)[0], 10);
          return (
            <PokemonCard
              pokemon={item}
              pokemonId={pokemonId}
              onPress={handlePokemonPress}
            />
          );
        }}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Theme.colors.primary]}
            tintColor={Theme.colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: Theme.spacing.sm,
  },
  header: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borders.radius.large,
    margin: Theme.spacing.sm,
    ...Theme.shadows.medium,
  },
  title: {
    fontSize: Theme.typography.size.xxxl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.white,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  loadingIconLarge: {
    fontSize: 60,
    marginBottom: Theme.spacing.lg,
  },
  loadingIcon: {
    fontSize: 30,
    marginRight: Theme.spacing.sm,
  },
  loadingText: {
    fontSize: Theme.typography.size.lg,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.secondary,
    marginTop: Theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  footerText: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
  },
});

export default PokemonList;