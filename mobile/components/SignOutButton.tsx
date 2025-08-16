import { styles } from '@/assets/styles/home.styles'
import { COLORS } from '@/constant/colors'
import { useClerk } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Alert, Text, TouchableOpacity } from 'react-native'

export const SignOutButton = () => {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { "text": "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => signOut() }
    ])
  }

  return (
    <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
      <Ionicons name='log-in-outline' size={22} color={COLORS.text} />
    </TouchableOpacity>
  )
}