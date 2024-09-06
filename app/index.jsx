import { View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, Text, Button } from 'react-native-paper';
import * as Location from 'expo-location';

let locationSub = null

export default function Index() {
  const [location, setLocation] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [foregroundUpdatesStatus, setForegroundUpdatesStatus] = useState("stopped");

  const theme = useTheme();

  useEffect(() => {
    let locationInterval;

    async () => {
      let { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        setErrorMsg('Permission to access foreground location was denied');
        return;
      }

      let { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        setErrorMsg('Permission to access background location was denied');
      }

      try {
        const backgroundCheck = await Location.isBackgroundLocationAvailableAsync();
        console.log('Background location available:', backgroundCheck);
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  async function startForegroundUpdates() {
    setForegroundUpdatesStatus("started");
    locationSub = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      },
      location => {
        setLocation([location.coords.latitude, location.coords.longitude]);
      }
    );
  }

  async function stopForegroundUpdates() {
    setForegroundUpdatesStatus("stopped");
    locationSub = null;
    setLocation([]);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Text style={styles.servicesStatus}>Services {foregroundUpdatesStatus}</Text>
      <View style={styles.buttonBox}>
        <Button style={styles.button} labelStyle={styles.buttonLabel} onPress={() => startForegroundUpdates()} mode="contained-tonal">Start Onloc</Button>
        <Button style={styles.button} labelStyle={styles.buttonLabel} onPress={() => stopForegroundUpdates()} mode="outlined">Stop Onloc</Button>
      </View>
      <Text style={styles.location}>{location[0]}, {location[1]}</Text>
      {errorMsg ? <Text>{errorMsg}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonBox: {
    flexDirection: "row",
  },
  button: {
    margin: 10,
  },
  buttonLabel: {
    fontFamily: "Outfit-Regular",
  },
  servicesStatus: {
    marginBottom: 10,
    fontSize: 20,
    fontFamily: "Outfit-Medium",
  },
  location: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Outfit-Regular",
  }
});