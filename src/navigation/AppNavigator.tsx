import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import PokemonDetail from '../screens/main/PokemonDetail';
import NotFound from '../screens/main/NotFound';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import BiometricSetupScreen from '../screens/main/BiometricSetupScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading text="Checking authentication..." />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={DrawerNavigator} />
          <Stack.Screen
            name="PokemonDetail"
            component={PokemonDetail}
            options={{
              headerShown: true,
              title: 'Pokémon Detail',
              headerStyle: {
                backgroundColor: '#DC0A2D',
              },
              headerTintColor: '#FFFFFF',
            }}
          />
        </>
      )}
      <Stack.Screen
        name="NotFound"
        component={NotFound}
        options={{ title: 'Not Found' }}
      />
      <Stack.Screen
        name="BiometricSetup"
        component={BiometricSetupScreen}
        options={{
          title: 'Setup Biometric',
          headerBackTitle: 'Back'
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;