import React, { useEffect, useState } from 'react'
import { addItemToList, deleteItem, firestore } from '../firestore/config'
import { onSnapshot, collection } from "firebase/firestore"
import { useTheme, TextInput, Button } from 'react-native-paper'


import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'


export default function ItemScreen({ route }) {
  const { userId, listId, listMetaData } = route.params
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')

  const theme = useTheme()


  useEffect(() => {
    const itemsRef = collection(firestore, 'users', userId, 'lists', listId, 'items')
    const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setItems(fetchedItems)
    })

    return () => unsubscribe()
  }, [userId, listId])

  const addItem = async () => {
    if (newItem.trim()) {
      const itemData = {
        name: newItem,
        timestamp: new Date(),
      }
      await addItemToList(userId, listId, itemData)
      setNewItem('')
    }
  }

  const removeItem = async (itemId) => {
    await deleteItem(userId, listId, itemId)
  }

  return (

    <View style={[styles.itemContent, { backgroundColor: theme.colors.secondaryContainer }]}>
      <Text style={styles.listText}>Listan {listMetaData.name} tavarat</Text>
      <Text style={styles.listDetail}>Tyyppi: {listMetaData.matkaLuokka}</Text>
      <Text style={styles.listDetail}>Kohde: {listMetaData.matkanKohde}</Text>
      <Text style={styles.listDetail}>{listMetaData.range.startDate.toDate().toLocaleDateString()} - {listMetaData.range.endDate.toDate().toLocaleDateString()} </Text>
      <TextInput
        style={[styles.itemInput, { backgroundColor: theme.colors.surface }]}
        mode="outlined"
        label="Lisää uusi tavara"
        value={newItem}
        onChangeText={setNewItem}
      />
      <Button theme={{ colors: { primary: theme.colors.primary } }}
        mode='elevated'
        onPress={addItem}>
        Lisää tavara
      </Button>
      <FlatList style={[styles.tertiaryContainer, { backgroundColor: theme.colors.tertiaryContainer }]}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Ionicons name="trash-outline" size={24} style={{ color: theme.colors.onErrorContainer }}  />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  itemContent: {
    flex: 1,
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
  itemInput: {
    width: '100%',

  },

  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 7,
    borderBottomWidth: 0.5,
  },

  itemText: {
    fontSize: 16
  },

  listText: {
    fontSize: 18
  },

  listDetail: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  itemInput: {
    marginBottom: 10,
    width: '100%',
    borderRadius: 10,
  },
  tertiaryContainer: {
    width: '100%',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
})
