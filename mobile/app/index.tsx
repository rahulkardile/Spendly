import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text style={{
        color: "red"
      }}>Making sure everything works well</Text>

      <Link href={"/about"}> About </Link>

      {/* <Image 
        source={{
          uri: "https://avatars.githubusercontent.com/u/122984037?v=4"
        }}

        style={{
          width: 100, 
          height: 100
        }}
      /> */}

      <Image
        source={require("@/assets/images/react-logo.png")}
        style={{
          width: 100,
          height: 100
        }}
      />

      <View>

        <Text> Hello Native </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
  }
})