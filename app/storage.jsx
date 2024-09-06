import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getSetting(key) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? value : "";
  } catch (error) {
    console.error("Error:", error);
    return "";
  }
}

export async function storeSetting(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error("Error:", error);
  }
}