
import { StyleSheet, View } from "react-native"
import { use, useEffect, useState } from "react"
import { TextInput, useTheme, Text } from "react-native-paper"
import LetterAvatar from "../components/Avatar"
import currencyapi from '@everapi/currencyapi-js'
import Dropdown from "../components/DropDown"


export default function PedometerScreen() {
    const CURRENCY_API_KEY = process.env.EXPO_PUBLIC_CURRENCY_API_KEY

    const theme = useTheme()

    const [Valuutta] = useState(["USD", "GBP", "JPY", "AUD", "CAD", "EUR"])
    const [selectedValuuttaFrom, setSelectedValuuttaFrom] = useState("EUR")
    const [selectedValuuttaTo, setSelectedValuuttaTo] = useState("USD")

    const [fromAmount, setFromAmount] = useState("")
    const [toAmount, setToAmount] = useState("")
    const [Rates, setRates] = useState({})

    useEffect(() => {
        if (selectedValuuttaFrom && selectedValuuttaTo && CURRENCY_API_KEY) {
            console.log("Fetching conversion rate for:", selectedValuuttaFrom, "to", selectedValuuttaTo)
            const rateKey = `${selectedValuuttaFrom}_${selectedValuuttaTo}`
            console.log("rateKey:", rateKey)
            fetchRate(rateKey)
        }
    }, [selectedValuuttaFrom, selectedValuuttaTo])

    // Haetaan kurssivaluutta jos se ei ole cachessä
    const fetchRate = (rateKey) => {
        console.log("rateKey:", rateKey, "Rates[rateKey]:", Rates[rateKey])
        if (!Rates[rateKey]) {
            console.log("Fetching conversion rate in fetchRate for:", selectedValuuttaFrom, "to", selectedValuuttaTo)
            if (!CURRENCY_API_KEY) {
                console.error("Currency API key not found. Please add it to your .env file.")
                return
            }
            const client = new currencyapi(CURRENCY_API_KEY)
            client.latest({
                base_currency: selectedValuuttaFrom,
                currencies: selectedValuuttaTo
            })
                .then((response) => {
                    console.log("response:", response)
                    const rate = response.data?.[selectedValuuttaTo]?.value
                    if (rate) {
                        setRates((prevRate) => ({
                            ...prevRate,
                            [rateKey]: rate
                        }))
                        console.log("Fetched conversion rate:", rate, "for", selectedValuuttaFrom, "to", selectedValuuttaTo)
                        convertFrom(fromAmount, rate) // Muunnetaan uudella kurssivaluutalla
                    }
                })
                .catch((error) => console.error("error in conversion rate:", error))
        } else {
            convertFrom(fromAmount, Rates[rateKey])
            console.log("Rate already in cache:", rateKey)
            console.log("Using cached rate for conversion:", Rates[rateKey], "for", selectedValuuttaFrom, "to", selectedValuuttaTo)
        }
    }

    // Konvertoidaan fromAmountista ToAmounttin 
    const convertFrom = (amount, rate) => {
        console.log(isNaN(amount))
        if (isNaN(amount) || !rate || amount === "") {
            console.log("Amount is not a number or rate is not available")
            return
        }
        const convertedAmount = parseFloat(amount) * rate
        setFromAmount(amount)
        setToAmount(convertedAmount.toFixed(2).toString())
    }

    // Konvertoidaan ToAmountinsta fromAmountiin
    const convertTo = (amount, rate) => {
        if (isNaN(amount) || !rate || amount === "") {
            console.log("Amount is not a number or rate is not available")
            return
        }
        const convertedAmount = parseFloat(amount) / rate
        setToAmount(amount)
        setFromAmount(convertedAmount.toFixed(2).toString())
    }

    //Handletään muunnokset fromAmountista ja tarkistetaan cache ennen kuin haetaan
    const handleFromAmountChange = (amount) => {
        setFromAmount(amount)
        const rateKey = `${selectedValuuttaFrom}_${selectedValuuttaTo}`
        const rate = Rates[rateKey]
        if (rate) {
            convertFrom(amount, rate) // Käytetään cachessa olevaa Ratea
        } else {
            fetchRate(rateKey)
        }
    }

    // Handletään muunnokset ToAmountista ja tarkistetaan cache ennen kuin haetaan
    const handleToAmountChange = (amount) => {
        setToAmount(amount)
        const rateKey = `${selectedValuuttaFrom}_${selectedValuuttaTo}`
        const rate = Rates[rateKey]
        if (rate) {
            convertTo(amount, rate)
        } else {
            fetchRate(rateKey)
        }
    }


    return (
        <View style={[styles.content, { backgroundColor: theme.colors.secondaryContainer }]}>
            <View style={[styles.component, { backgroundColor: theme.colors.tertiaryContainer }]}>
                {!CURRENCY_API_KEY ? (<Text style={styles.TopText}>Api key not found</Text>) : null}
                <Text
                    variant="labelMedium"
                    style={[styles.toptext, { color: theme.colors.onTertiaryContainer }]}
                >Amount to convert</Text>
                <View style={[styles.componetRow, { backgroundColor: theme.colors.tertiaryContainer }]}>
                    <LetterAvatar content={selectedValuuttaFrom.charAt(0)} />
                    <View style={styles.dropdowncontainer}>
                        <Dropdown
                            items={Valuutta.map((currency) => ({ label: currency, value: currency }))}
                            selectedValue={selectedValuuttaFrom}
                            onValueChange={(value) => setSelectedValuuttaFrom(value)}
                        />
                    </View>
                </View>
                <View style={styles.componetRow}>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.colors.surface }]}
                        value={fromAmount}
                        mode="outlined"
                        onChangeText={handleFromAmountChange}
                        label="Enter amount"
                        keyboardType="numeric"
                        height={40}
                    />
                </View>

            </View>
            <View style={[styles.component, { backgroundColor: theme.colors.tertiaryContainer }]}>
                <Text
                    variant="labelMedium"
                    style={[styles.toptext, { color: theme.colors.onTertiaryContainer }]}
                >Converted amount</Text>
                <View style={styles.componetRow}>
                    <LetterAvatar content={selectedValuuttaTo.charAt(0)} />
                    <View style={styles.dropdowncontainer}>
                        <Dropdown
                            items={Valuutta.map((currency) => ({ label: currency, value: currency }))}
                            selectedValue={selectedValuuttaTo}
                            onValueChange={(value) => setSelectedValuuttaTo(value)}
                        />
                    </View>

                </View>
                <View style={styles.componetRow}>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.colors.surface }]}
                        value={toAmount}
                        mode="outlined"
                        onChangeText={handleToAmountChange}
                        label="Converted amount"
                        keyboardType="numeric"
                        height={40}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    content: {
        flex: 1,
        justifyContent: 'top',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    component: {
        borderRadius: 10,
        width: '100%',
        marginBottom: 10,
    },
    toptext: {
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: '500',
    },
    componetRow: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-around",
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    input: {
        width: '100%',
        borderRadius: 5,
        fontSize: 12,
        height: 40,
        verticalAlign: 'center',
        marginBottom: 10,
    },
    dropdowncontainer: {
        width: '70%',
    },
})
