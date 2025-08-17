import { useUser } from '@clerk/clerk-expo'
import { router } from 'expo-router'
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '@/hooks/useTransactions';
import { useEffect, useState } from 'react';
import PageLoader from '@/components/PageLoader';
import { styles } from '@/assets/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import BalanceCard from '@/components/BalanceCard';
import { TransactionItem } from '@/components/TransactionItem';
import NoTransactionsFound from '@/components/NoTransactionsFound';
import { RefreshControl } from 'react-native-gesture-handler';

export default function Page() {
  const { user } = useUser();
  const { transactions, deleteTransaction, isLoading, loadData } = useTransactions(user!.id);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = (id: string) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (isLoading) return <PageLoader />

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}

        <View style={styles.header}>
          {/* Left */}
          <View style={styles.headerLeft}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode='contain'
            />

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>{user?.emailAddresses[0]?.emailAddress.split("@")[0]}</Text>
            </View>
          </View>

          {/* Right */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/")}>
              <Ionicons name='add' size={20} color={"#fff"} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <SignOutButton />
        </View>

        <BalanceCard summary={{ balance: 32987343, income: 7029, expenses: 8473 }} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  )
}