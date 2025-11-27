import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { enableScreens } from 'react-native-screens';
import BottomTabNavigator from './BottomTabNavigator';
import Settings from '../screens/settings/Settings';
import BiometricSettings from '../screens/settings/BiometricSettings';
import LocationSettings from '../screens/settings/LocationSettings';
import { DrawerParamList } from '../types/navigation';
import DrawerContent from '../components/layout/DrawerContent';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

enableScreens();

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // Header dihilangkan
        drawerStyle: {
          width: 280,
        },
        drawerActiveTintColor: '#1E3A8A', // Biru
        drawerInactiveTintColor: '#333',
        drawerActiveBackgroundColor: 'rgba(30, 58, 138, 0.1)', // Biru transparan
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={BottomTabNavigator}
        options={{ 
          title: 'Pokémon',
          drawerIcon: ({ color, size }) => (
            <FontAwesome6 name="dragon" size={size} color={color} iconStyle='solid' />
          )
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={Settings}
        options={{ 
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <FontAwesome6 name="gear" size={size} color={color} iconStyle='solid' />
          )
        }}
      />
      <Drawer.Screen 
        name="BiometricSettings" 
        component={BiometricSettings}
        options={{ 
          title: 'Biometric',
          drawerIcon: ({ color, size }) => (
            <FontAwesome6 name="fingerprint" size={size} color={color} iconStyle='solid' />
          )
        }}
      />
      <Drawer.Screen 
        name="LocationSettings" 
        component={LocationSettings}
        options={{ 
          title: 'Location',
          drawerIcon: ({ color, size }) => (
            <FontAwesome6 name="location-dot" size={size} color={color} iconStyle='solid' />
          )
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;