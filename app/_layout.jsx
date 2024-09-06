import { Stack } from "expo-router";
import { View } from "react-native";
import { MD3DarkTheme, PaperProvider, ActivityIndicator } from "react-native-paper";
import { useFonts } from "expo-font";

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: 'white',
    background: '#333',
    header: '#444',
  },
  version: 3,
};

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    'Outfit-Black': require('../assets/fonts/Outfit-Black.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
    'Outfit-ExtraBold': require('../assets/fonts/Outfit-ExtraBold.ttf'),
    'Outfit-ExtraLight': require('../assets/fonts/Outfit-ExtraLight.ttf'),
    'Outfit-Light': require('../assets/fonts/Outfit-Light.ttf'),
    'Outfit-Medium': require('../assets/fonts/Outfit-Medium.ttf'),
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-SemiBold': require('../assets/fonts/Outfit-SemiBold.ttf'),
    'Outfit-Thin': require('../assets/fonts/Outfit-Thin.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
        <ActivityIndicator style={{ flex: 1 }} animating={true} size="large" color="white" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen
          name="index"
          initialParams={{
            currentChatId: 1,
          }}
          options={{
            title: "Onloc",
            headerTitleAlign: "center",
            statusBarColor: theme.colors.background,
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTitleStyle: {
              color: theme.colors.primary,
              fontFamily: "Outfit-SemiBold"
            },
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
