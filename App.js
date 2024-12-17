import React, { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper'
import useTheme from './hooks/Theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MathScreen from './screens/MathScreen'
import PedometerScreen from './screens/PedometerScreen'
import SettingsScreen from './screens/SettingsScreen'
import ListScreen from './screens/ListScreen'
import ItemScreen from './screens/ItemScreen'
import CheckCredentials from './screens/CheckCredentials'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import Credits
 from './screens/Credits'



const Tab = createBottomTabNavigator()

export default function App() {

  const [logged, setLogged] = useState(false)  
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const theme = useTheme(isDarkTheme)

  const toggleTheme = () => setIsDarkTheme((prev) => !prev)

  //https://m3.material.io/styles/color/static/baseline

  const ListStack = () => {
    const Stack = createStackNavigator()
    return (
      <Stack.Navigator initialRouteName='Lists' screenOptions={({ route }) => ({
                  
        headerStyle: {
          backgroundColor: theme.colors.secondaryContainer,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
        >
        <Stack.Screen name="Lists" component={ListScreen} />
        <Stack.Screen name="Items" component={ItemScreen} />
      </Stack.Navigator>
    )
  }

  const SettingsStack = ({ toggleTheme, isDarkTheme }) =>{
    const Stack = createStackNavigator();
    return(
      <Stack.Navigator
      screenOptions={{
        headerTintColor: theme.colors.onSecondaryContainer,
      }}>
      <Stack.Screen name="SettingsSubmenu"
      options={{ headerShown: false }}
      >
        {(props) => (
          <SettingsScreen
            {...props}
            toggleTheme={toggleTheme}
            isDarkTheme={isDarkTheme}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Credits" component={Credits}/>
    </Stack.Navigator>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.secondaryContainer}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer theme={theme}>
            <Tab.Navigator
              initialRouteName="Pedometer"
              screenOptions={({ route }) => ({
                headerStyle: {
                  backgroundColor: theme.colors.secondaryContainer,
                },
                headerTintColor: theme.colors.onSurface,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                tabBarStyle: {
                  backgroundColor: theme.colors.secondaryContainer, 
                },
                tabBarActiveTintColor: theme.colors.tertiary,
                tabBarInactiveTintColor: theme.colors.onSecondaryContainer,
                tabBarIcon: ({ color, size }) => {
                  let iconName
                  switch (route.name) {
                    case 'Pedometer':
                      iconName = 'shoe-print'
                      break
                    case 'Math':
                      iconName = 'calculator'
                      break
                    case 'Settings':
                      iconName = 'cog'
                      break
                    default:
                      iconName = 'question'
                  }
                  return <Icon name={iconName} color={color} size={size} />
                },
              })}
            >
              <Tab.Screen name="Pedometer" component={PedometerScreen} />
              <Tab.Screen name="Math" component={MathScreen} />
              <Tab.Screen name="Settings">
              {(props) => (
                <SettingsStack
                  {...props}
                  toggleTheme={toggleTheme}
                  isDarkTheme={isDarkTheme}
                />
              )}
            </Tab.Screen>
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  )
}
