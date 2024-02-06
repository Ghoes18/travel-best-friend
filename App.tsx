import { useState } from "react";
import Slider from "@react-native-community/slider";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Platform,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";

import { OPENAI_KEY } from "@env";

const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight : 0;

export default function App() {
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [travelData, setTravelData] = useState("");
  const [days, setDays] = useState(15);

  const handleGenerate = () => {
    if (!destination) {
      Alert.alert("Please enter a destination");
      return;
    }

    setTravelData("");
    setLoading(true);
    Keyboard.dismiss();

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-16k-0613",
        messages: [
          {
            role: "user",
            content: `Create an itinerary for an exact ${days}-day trip in the city of ${destination}, search for tourist spots, most visited places, be precise in the provided stay days, and limit the itinerary only within the provided city. Provide it only in bullet points with the name of the place to go each day.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTravelData(data.choices[0].message.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <Text style={styles.header}>Travel Best Friend</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Destination</Text>
        <TextInput
          placeholder="Ex: New York, Lisbon, Tokyo"
          style={styles.input}
          value={destination}
          onChangeText={setDestination}
        />
        <Text style={styles.label}>
          I want to stay at least<Text style={styles.days}> {days} </Text>days
        </Text>
        <Slider
          minimumValue={1}
          maximumValue={30}
          step={1}
          minimumTrackTintColor="#00a8ff"
          maximumTrackTintColor="#bdc3c7"
          value={days}
          onValueChange={setDays}
        />
      </View>
      <Pressable style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {loading && (
          <View style={styles.content}>
            <Text style={styles.contentTitle}>Loading...</Text>
            <ActivityIndicator size="large" color="#00a8ff" />
          </View>
        )}
        {!!travelData && (
          <View style={styles.content}>
            <Text style={styles.contentTitle}>Content 👇</Text>
            <Text>{travelData}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 0,
  },
  form: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  label: {
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "lightgray",
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 20,
  },
  days: {
    color: "#00a8ff",
  },
  button: {
    backgroundColor: "#00a8ff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  scroll: {
    width: "90%",
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: "white",
    width: "100%",
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 14,
  },
});
