import AsyncStorage from '@react-native-async-storage/async-storage'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firestore/config'

const createUser = async (setLoadingMessage, retry = 0) => {
    // jos käyttäjän luominen epäonnistuu, yritetään uudelleen max 3 kertaa
    if (retry > 3) {
        console.error('Too many retries')
        return false
    }
    
    setLoadingMessage('Creating new user, CreateUser.js')
    console.log('Creating new user, CreateUser.js')

    const email = `jartauri+projekti_${Math.random().toString(36).substring(2)}@gmail.com` // kaksi ensimmäistä randomia merkkiä ovat aina nolla
    const password = Math.random().toString(36).substring(2, 12) // kaksi ekaa pois ja 11 merkkiä salasanaksi

    console.log('email:', email)
    console.log('password:', password)

    await AsyncStorage.setItem('userEmail', email)
    await AsyncStorage.setItem('userPassword', password)

    try {
        console.log('Trying to create user')
        if (!auth) {
            console.log('Auth not found')
            setLoadingMessage('Error creating user, auth not found')
            await AsyncStorage.removeItem('userEmail')
            await AsyncStorage.removeItem('userPassword')
            return false
        }
        await createUserWithEmailAndPassword(auth, email, password)
        console.log('User created')
        return true
    } catch (error) {
        // virhetilanteenssa poista vialliset kirjautumistiedot (sama käyttäjätunnus?)
        console.error('Error creating user:', error)
        await AsyncStorage.removeItem('userEmail')
        await AsyncStorage.removeItem('userPassword')
        if (error.code === 'auth/email-already-in-use') {
            return createUser(retry + 1)
        }
        console.error('Error creating user:', error)
        setLoadingMessage('Error creating user')
        return false
    }
}

export default createUser
