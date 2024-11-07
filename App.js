import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons'
import Home from './components/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import Weather from './components/Weather'
import useTheme from './hooks/Theme'

export default function App() {

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const theme = useTheme(isDarkTheme);

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.safeArea}>




          <Stack.Navigator initialRouteName='Home' screenOptions={{
            headerStyle: { height: 70 },
            headerTitleAlign: 'center',
            headerTitleStyle: { color: theme.colors.tertiary, flex: 1 },
          }}>
            <Stack.Screen style={styles.screen} name="Home" component={Home}/>
            <Stack.Screen style={styles.screen} name="Weather" component={Weather}/>
          </Stack.Navigator>


          <Footer style={styles.footer} />

        </SafeAreaView>
      </PaperProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
    marginBottom: 40,
  },
  footer: {
    height: 50,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    backgroundColor:'#fffff'
  }
});
