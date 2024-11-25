import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import useTheme from './hooks/Theme'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Footer from './components/Footer'
//import Homescreen from './screens/HomeScreen'
//import WeatherScreen from './screens/WeatherScreen'
//import ListScreen from './screens/ListScreen'
//import ItemScreen from './screens/ChosenListScreen'
//import CurrencyCalculator from './screens/CalculatorScreen'
//import CheckCredentials from './screens/CheckCredentials'
import { navigatorStyles, appStyles as styles } from './styles/Styles'


const Stack = createStackNavigator()

export default function App() {

  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [logged, setLogged] = useState(false)
  const theme = useTheme(isDarkTheme)

  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => !prevTheme)
  }

  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <SafeAreaView style={styles.safeArea}>
          <Footer style={styles.footer} />
        </SafeAreaView>
      </PaperProvider>
    </NavigationContainer>
  )
}

