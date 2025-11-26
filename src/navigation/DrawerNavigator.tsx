import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { enableScreens } from 'react-native-screens';
import BottomTabNavigator from './BottomTabNavigator';
import Settings from '../screens/settings/Settings';
import BiometricSettings from '../screens/settings/BiometricSettings';
import LocationSettings from '../screens/settings/LocationSettings';
import { DrawerParamList } from '../types/navigation';
import DrawerContent from '../components/layout/DrawerContent';

enableScreens();

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#DC0A2D',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          width: 280,
        },
        drawerActiveTintColor: '#DC0A2D',
        drawerInactiveTintColor: '#333',
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={BottomTabNavigator}
        options={{ 
          title: 'Pokémon List',
          headerTitle: 'Pokédex'
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={Settings}
        options={{ title: 'Settings' }}
      />
      <Drawer.Screen 
        name="BiometricSettings" 
        component={BiometricSettings}
        options={{ title: 'Biometric Settings' }}
      />
      <Drawer.Screen 
        name="LocationSettings" 
        component={LocationSettings}
        options={{ title: 'Location Settings' }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;