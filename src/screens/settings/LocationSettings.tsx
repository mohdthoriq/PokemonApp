import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import Container from '../../components/layout/Container';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { Theme } from '../../styles/themes';
import { useLocation } from '../../hooks/useLocation';

const LocationSettings: React.FC = () => {
  const { 
    currentLocation, 
    currentAddress, 
    isLoading, 
    error, 
    getCurrentLocation, 
    clearLocation 
  } = useLocation();
  
  const [updatingLocation, setUpdatingLocation] = useState(false);
  const pulseValue = new Animated.Value(1);

  useEffect(() => {
    if (currentLocation) {
      startPulseAnimation();
    }
  }, [currentLocation]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleGetLocation = async () => {
    setUpdatingLocation(true);
    try {
      const location = await getCurrentLocation();
      
      if (!location) {
        Alert.alert(
          'Location Error',
          'Failed to get your current location. Please check your location settings and try again.'
        );
      }
    } catch (err) {
      Alert.alert(
        'Location Error',
        'An error occurred while getting your location.'
      );
    } finally {
      setUpdatingLocation(false);
    }
  };

  const handleClearLocation = () => {
    Alert.alert(
      'Clear Location',
      'Are you sure you want to clear your location data?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearLocation,
        },
      ]
    );
  };

  const formatCoordinate = (coord: number): string => {
    return coord.toFixed(6);
  };

  const formatAccuracy = (accuracy: number): string => {
    return `±${accuracy.toFixed(1)} meters`;
  };

  if (isLoading && !currentLocation) {
    return (
      <Container>
        <Loading text="Loading location settings..." />
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView style={styles.container}>
        {/* Location Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Status</Text>
          <View style={styles.card}>
            <Animated.View 
              style={[
                styles.statusIcon,
                { 
                  transform: [{ scale: pulseValue }],
                  backgroundColor: currentLocation 
                    ? Theme.colors.success 
                    : Theme.colors.warning
                }
              ]}
            >
              <Text style={styles.icon}>
                {currentLocation ? '📍' : '❓'}
              </Text>
            </Animated.View>
            
            <Text style={styles.statusTitle}>
              {currentLocation ? 'Location Available' : 'No Location Data'}
            </Text>
            
            <Text style={styles.statusDescription}>
              {currentLocation
                ? 'Your current location has been successfully retrieved.'
                : 'Get your current location to see your coordinates and address.'}
            </Text>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>
        </View>

        {/* Location Data Section */}
        {currentLocation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Location</Text>
            <View style={styles.card}>
              <View style={styles.coordinates}>
                <View style={styles.coordinateItem}>
                  <Text style={styles.coordinateLabel}>Latitude</Text>
                  <Text style={styles.coordinateValue}>
                    {formatCoordinate(currentLocation.latitude)}
                  </Text>
                </View>
                
                <View style={styles.coordinateItem}>
                  <Text style={styles.coordinateLabel}>Longitude</Text>
                  <Text style={styles.coordinateValue}>
                    {formatCoordinate(currentLocation.longitude)}
                  </Text>
                </View>
                
                <View style={styles.coordinateItem}>
                  <Text style={styles.coordinateLabel}>Accuracy</Text>
                  <Text style={styles.coordinateValue}>
                    {formatAccuracy(currentLocation.accuracy)}
                  </Text>
                </View>
              </View>

              {currentAddress && (
                <View style={styles.addressSection}>
                  <Text style={styles.addressLabel}>Approximate Address</Text>
                  <Text style={styles.addressValue}>{currentAddress}</Text>
                </View>
              )}

              <View style={styles.mapPreview}>
                <Text style={styles.mapPlaceholder}>
                  🗺️ Map Preview
                </Text>
                <Text style={styles.mapDescription}>
                  Latitude: {formatCoordinate(currentLocation.latitude)}
                  {'\n'}
                  Longitude: {formatCoordinate(currentLocation.longitude)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.card}>
            <Button
              title={currentLocation ? "Update Location" : "Get Current Location"}
              onPress={handleGetLocation}
              loading={updatingLocation}
              disabled={updatingLocation}
              variant="primary"
              size="large"
              style={styles.actionButton}
            />
            
            {currentLocation && (
              <Button
                title="Clear Location"
                onPress={handleClearLocation}
                variant="outline"
                size="large"
                style={styles.actionButton}
              />
            )}
          </View>
        </View>

        {/* Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>
          <View style={styles.card}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Location Access</Text>
              <Text style={styles.infoValue}>
                {currentLocation ? 'Granted' : 'Not Granted'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>
                {currentLocation?.timestamp 
                  ? new Date(currentLocation.timestamp).toLocaleString()
                  : 'Never'
                }
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Data Usage</Text>
              <Text style={styles.infoValue}>Minimal</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Privacy</Text>
              <Text style={styles.infoValue}>Local Only</Text>
            </View>
          </View>
        </View>

        {/* Help Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help</Text>
          <View style={styles.card}>
            <Text style={styles.helpText}>
              Location services help us provide you with better experience:{'\n\n'}
              • Your location data is stored locally on your device{'\n'}
              • We never share your location with third parties{'\n'}
              • Location access can be managed in your device settings{'\n'}
              • You can clear location data at any time{'\n\n'}
              To enable location services:{'\n'}
              1. Go to your device Settings{'\n'}
              2. Find "Pokedex App" in the app list{'\n'}
              3. Enable "Location" permission{'\n'}
              4. Choose "While Using the App"{'\n'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.spacing.lg,
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.typography.size.xl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.md,
  },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borders.radius.large,
    padding: Theme.spacing.xl,
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  icon: {
    fontSize: 40,
  },
  statusTitle: {
    fontSize: Theme.typography.size.xl,
    fontFamily: Theme.typography.family.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.sm,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
    lineHeight: Theme.typography.lineHeight.md,
  },
  errorText: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.error,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
  coordinates: {
    width: '100%',
    marginBottom: Theme.spacing.lg,
  },
  coordinateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.borderLight,
  },
  coordinateLabel: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.primary,
  },
  coordinateValue: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
  },
  addressSection: {
    width: '100%',
    marginBottom: Theme.spacing.lg,
  },
  addressLabel: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.sm,
  },
  addressValue: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
    lineHeight: Theme.typography.lineHeight.md,
  },
  mapPreview: {
    width: '100%',
    height: 120,
    backgroundColor: Theme.colors.gray[100],
    borderRadius: Theme.borders.radius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  mapPlaceholder: {
    fontSize: Theme.typography.size.lg,
    marginBottom: Theme.spacing.sm,
  },
  mapDescription: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: Theme.typography.lineHeight.sm,
  },
  actionButton: {
    width: '100%',
    marginBottom: Theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.borderLight,
    width: '100%',
  },
  infoLabel: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.medium,
    color: Theme.colors.text.primary,
  },
  infoValue: {
    fontSize: Theme.typography.size.md,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
  },
  helpText: {
    fontSize: Theme.typography.size.sm,
    fontFamily: Theme.typography.family.regular,
    color: Theme.colors.text.secondary,
    lineHeight: Theme.typography.lineHeight.md,
  },
});

export default LocationSettings;