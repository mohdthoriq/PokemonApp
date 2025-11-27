import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Animated,
  Easing,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
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
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();
  };

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
        <Loading size="small" text="Loading more Pokémon..." type="dots" />
      </View>
    );
  };

  const renderHeader = () => (
    <Animated.View 
      style={[
        styles.header,
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          <FontAwesome6 name="dragon" size={40} color="#FFD700" solid />
          <Text style={styles.title}>Pokédex</Text>
        </View>
        <Text style={styles.subtitle}>
          Discover and explore all Pokémon creatures
        </Text>
        
        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome6 name="circle" size={16} color="#FFD700" solid />
            <Text style={styles.statNumber}>{pokemonList.length}</Text>
            <Text style={styles.statLabel}>Loaded</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <FontAwesome6 name="infinity" size={16} color="#FFD700" solid />
            <Text style={styles.statNumber}>∞</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <FontAwesome6 name="bolt" size={16} color="#FFD700" solid />
            <Text style={styles.statNumber}>1025</Text>
            <Text style={styles.statLabel}>Species</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderPokemonCard = ({ item }: { item: PokemonListItem }) => {
    const pokemonId = (item as any).id || parseInt(item.url.split('/').slice(-2, -1)[0], 10);
    return (
      <PokemonCard
        pokemon={item}
        pokemonId={pokemonId}
        onPress={handlePokemonPress}
      />
    );
  };

  if (isLoading && pokemonList.length === 0) {
    return (
      <Container>
        <Loading text="Loading Pokémon..." type="pokeball" />
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
          icon="triangle-exclamation"
        />
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={pokemonList}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={renderPokemonCard}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1E3A8A']}
            tintColor={'#1E3A8A'}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyState}>
              <FontAwesome6 name="dragon" size={80} color="#1E3A8A" iconStyle='solid'/>
              <Text style={styles.emptyText}>No Pokémon found</Text>
              <Text style={styles.emptySubtext}>Pull to refresh or check your connection</Text>
            </View>
          )
        }
      />

      {/* Floating Action Button */}
      {pokemonList.length > 0 && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={handleRefresh}
        >
          <FontAwesome6 name="rotate" size={20} color="#FFFFFF" iconStyle='solid' />
        </TouchableOpacity>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  header: {
    backgroundColor: 'rgba(30, 58, 138, 0.15)',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFD700',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    overflow: 'hidden',
    borderLeftWidth: 8,
    borderLeftColor: '#1E3A8A',
    borderRightWidth: 8,
    borderRightColor: '#1E3A8A',
  },
  headerContent: {
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(30, 58, 138, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  title: {
    fontSize: 32,
    fontFamily: 'System',
    fontWeight: '900',
    color: '#FFD700',
    marginLeft: 12,
    textShadowColor: '#1E3A8A',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '600',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 138, 0.9)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'System',
    fontWeight: '800',
    color: '#FFD700',
    marginVertical: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statDivider: {
    width: 2,
    height: 40,
    backgroundColor: '#FFD700',
    borderRadius: 1,
    opacity: 0.6,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E3A8A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#1E3A8A',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E3A8A',
    borderWidth: 3,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 12,  
  },
});

export default PokemonList;