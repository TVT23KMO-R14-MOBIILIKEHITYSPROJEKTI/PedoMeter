import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { auth, signInWithEmailAndPassword } from '../firestore/config'
import { Text } from 'react-native'
import createUser from '../components/CreateUser'

const CheckCredentials = ({ setLogged }) => {
    const [loadingMessage, setLoadingMessage] = useState('Checking credentials')

    //voisikohan tässä käyttää useReduceria?
    
    useEffect(() => {
        const checkCredentials = async () => {
            console.log('Checking credentials')

            try {
                let email = await AsyncStorage.getItem('userEmail')
                let password = await AsyncStorage.getItem('userPassword')
                console.log('email1:', email)
                console.log('password1:', password)
                if (!email || !password) {
                    console.log('Creating new user, CheckCredentials.js')
                    const result = await createUser(setLoadingMessage)
                    if (result) {
                        email = await AsyncStorage.getItem('userEmail')
                        password = await AsyncStorage.getItem('userPassword')
                        await signInWithEmailAndPassword(auth, email, password)
                        setLogged(true)
                    } else {
                        setLoadingMessage('Error creating user')
                    }
                } else {
                    console.log('Signing in')
                    await signInWithEmailAndPassword(auth, email, password)
                    setLogged(true)
                }
            } catch (error) {

                console.log('Error during authentication:', error)
                if (error.code === 'auth/invalid-credential') {
                    await AsyncStorage.removeItem('userEmail')
                    await AsyncStorage.removeItem('userPassword')
                    setLoadingMessage('Invalid credentials, creating new user')
                    
                    try {
                        const result = await createUser(setLoadingMessage)
                        if (result) {
                            const email = await AsyncStorage.getItem('userEmail')
                            const password = await AsyncStorage.getItem('userPassword')
                            await signInWithEmailAndPassword(auth, email, password)
                            setLogged(true)
                        } else {
                            setLoadingMessage('Error creating user after invalid credentials')
                        }
                    } catch (createUserError) {
                        console.error('Error creating user:', createUserError)
                        setLoadingMessage('Error creating user')
                    }
                } else {
                    setLoadingMessage('Error signing in', error)
                }
            }
        }

        checkCredentials()
    }, [setLogged])

    return (
            <Text>{loadingMessage}</Text>
    )
}

export default CheckCredentials
