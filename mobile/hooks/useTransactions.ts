// react custom hook file

import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export const API_URL = "https://spendly-5o25.onrender.com/api";

export const useTransactions = (userId:string) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // useCallback is used for performance reasons, it will memoize the function
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }finally{
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }finally{
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // can be run in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]).then(()=>{
      console.log(`\nSummery : ${JSON.stringify(summary)} `);
      console.log(`User transaction Date - \nid : ${userId}, \ntransactions : ${JSON.stringify(transactions)} `);
      });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id:string) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete transaction");

      // Refresh data after deletion
      loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error:any) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message);
    }
  };
  
  const createTransaction = async (data:{id: string, title: string, amount: number, category: string}) => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: data!.id,
          title: data.title,
          amount: data.amount,
          category: data.category,
        }),
      });

      if (!response.ok){
        const errorData = await response.json();
        console.log(errorData);
        throw new Error("Failed to delete transaction")
      };

      // Refresh data after create
      loadData();
      Alert.alert("Success", "Transaction created successfully");
      loadData();
      router.push("/");
    } catch (error:any) {
      Alert.alert("Error", error.message || "Failed to create transaction");
      console.error("Error creating transaction:", error);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction, createTransaction };
};