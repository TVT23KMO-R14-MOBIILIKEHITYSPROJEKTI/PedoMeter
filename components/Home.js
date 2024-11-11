import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';


export default function Homescreen({ toggleTheme }) {

  const theme = useTheme();
  
  return (
      
        <View style={[styles.content, { backgroundColor: theme.colors.primary }]}>
        <Text>Open up App.js to start working on your app!</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Icon name="dark-mode" size={30} color={theme.colors.toggleButtonColor} />
        </TouchableOpacity>
      </View>
      
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});