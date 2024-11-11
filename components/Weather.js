import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'react-native-paper'

export default function Weather({ navigation }) {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const city = "oulu"
  const apiKey = "1a700f2f57ea434dce8dbc44b902c797"
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

  const theme = useTheme()

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Verkkovirhe: ' + response.status)
        }
        const data = await response.json()
        setWeatherData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [url])

  if (loading) {
    return (
      <View style={styles.weatherContent}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.weatherContent}>
        <Text>Error: {error}</Text>
      </View>
    )
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`

  return (
    <View style={[styles.weatherContent, { backgroundColor: theme.colors.primary }]}>
      <Text style={[{ color: theme.colors.tertiary }]}>{weatherData.name}</Text>
      <Text style={[{ color: theme.colors.tertiary }]}>{weatherData.main.temp}°C</Text>
      <Text style={[{ color: theme.colors.tertiary }]}>{weatherData.weather[0].description}</Text>
      <Image source={{ uri: iconUrl }} style={styles.weatherIcon} />
    </View>
  )
}

const styles = StyleSheet.create({
  weatherContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
})