import { View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, Text, Button, TextInput } from 'react-native-paper';
import * as Location from 'expo-location';
import { getSetting, storeSetting } from './storage';

export default function Index() {
  const [location, setLocation] = useState([]);
  const [locationSub, setLocationSub] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [foregroundUpdatesStatus, setForegroundUpdatesStatus] = useState("stopped");
  const [serverIp, setServerIp] = useState("");

  const theme = useTheme();

  useEffect(() => {
    const init = async () => {
      let { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        setErrorMsg("Permission to access foreground location was denied");
        return;
      }
  
      let { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== "granted") {
        setErrorMsg("Permission to access background location was denied");
      }
  
      try {
        const backgroundCheck = await Location.isBackgroundLocationAvailableAsync();
        console.log("Background location available:", backgroundCheck);
      } catch (error) {
        console.error(error);
      }
  
      if (locationSub !== null && foregroundUpdatesStatus === "started") {
        await locationSub.remove();
      }
  
      async function fetchSettings() {
        const savedIp = await getSetting("ip");
        setServerIp(savedIp);
      }
      fetchSettings();
    };
  
    init();
  }, []);
  

  async function startForegroundUpdates() {
    setForegroundUpdatesStatus("started");
    setLocationSub(await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      },
      location => {
        setLocation([location.coords.latitude, location.coords.longitude]);
        sendLocationToServer(serverIp, location);
      }
    ));
  }

  async function stopForegroundUpdates() {
    setForegroundUpdatesStatus("stopped");
    await locationSub.remove();
    setErrorMsg(null);
    setLocation([]);
  }

  async function sendLocationToServer(ip, location) {
    const path = "/api/location";
    ip = ip + path;

    try {
      const response = await fetch(ip, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      });

      if (!response.ok) {
        throw new Error("Connection failed");
      }

    } catch (error) {
      setErrorMsg(error.message);
      console.error(error);
    }
  }

  function changeIp(ip) {
    setServerIp(ip);
    storeSetting("ip", ip);
  }

  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <TextInput
        style={styles.serverIp}
        mode="outlined"
        disabled={foregroundUpdatesStatus === "started"}
        label={<Text style={styles.serverIpLabel}>Onloc server's IP</Text>}
        value={serverIp}
        onChangeText={(value) => changeIp(value)}
        contentStyle={styles.serverIpLabel}
      ></TextInput>
      <View style={{ alignItems: "center", marginTop: 50 }}>
        <Text style={styles.servicesStatus}>Services {foregroundUpdatesStatus}</Text>
        <View style={styles.buttonBox}>
          <Button style={styles.button} labelStyle={styles.buttonLabel} disabled={foregroundUpdatesStatus === "started"} onPress={() => startForegroundUpdates()} mode="contained-tonal">Start Onloc</Button>
          <Button style={styles.button} labelStyle={styles.buttonLabel} disabled={foregroundUpdatesStatus === "stopped"} onPress={() => stopForegroundUpdates()} mode="outlined">Stop Onloc</Button>
        </View>
        <Text style={styles.location}>{location[0]}, {location[1]}</Text>
        {errorMsg ? <Text style={{ color: "red" }}>{errorMsg}</Text> : null}
      </View>
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
  },
  serverIp: {
    width: "60%",
  },
  serverIpLabel: {
    fontFamily: "Outfit-Regular",
  }
});