import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function SimplePedometer() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const pedometerSubscription = useRef(null);

  useEffect(() => {
    // Request permission for Pedometer on mount
    Pedometer.requestPermissionsAsync();
  }, []);

  const startCounting = async () => {
    // Reset step count to zero before starting
    setCurrentStepCount(0);

    // Check if the device supports pedometer
    const available = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(available));

    if (available) {
      // Subscribe to pedometer updates; each update adds to current step count
      pedometerSubscription.current = Pedometer.watchStepCount(result => {
        setCurrentStepCount(prevCount => prevCount + result.steps);
      });
    }
  };

  const stopCounting = () => {
    // Unsubscribe from the Pedometer
    if (pedometerSubscription.current) {
      pedometerSubscription.current.remove();
      pedometerSubscription.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>
        Pedometer is available: {isPedometerAvailable}
      </Text>
      <Text style={styles.stepCount}>
        Steps: {currentStepCount}
      </Text>

      <View style={styles.buttonRow}>
        <Button title="Start" onPress={startCounting} />
        <Button title="Stop" onPress={stopCounting} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
  },
  stepCount: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
  },
});
