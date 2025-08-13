import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { styles } from '@/assets/styles/home.styles'
import { COLORS } from '@/constant/colors'

export default function PageLoader() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={'large'} color={COLORS.primary}>PageLoader</ActivityIndicator>
    </View>
  )
}