import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from 'react-native-paper'

export default function Header({ onContentPress }) {

  const theme = useTheme()

  return (
    <View style={[styles.headerContent, { backgroundColor: theme.colors.primary }]} >
      <TouchableOpacity onPress={() => onContentPress('home')}>
        <Icon name="home" size={30} style={[styles.footerIcon, { color: theme.colors.tertiary }]} />
      </TouchableOpacity>
      <Text style={[styles.headerText, { color: theme.colors.tertiary }]}>Pakkauslistat</Text>
      <Text></Text>
    </View>
  )

}

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})