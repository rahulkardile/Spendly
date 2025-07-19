// react custom hook

import { useCallback, useState } from "react"
import { Alert } from "react-native";

const API_URL = "http://localhost:5001/api"

export const useTransactions = ( userId: string ) =>{
    const [ transactions, setTransaction ] = useState([]);
    const [ summery, setSummery ] = useState({
        balance: 0,
        income: 0,
        expeses: 0
    });
    const [ isLoading, setLoading ] = useState(true);

    const fetchTransactions = useCallback(async ()=> {
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            const data = await response.json();
            setTransaction(data);
        } catch (error) {
            console.error(JSON.stringify(error));
        }
    }, [userId])

    const fetchSummury = useCallback(async ()=> {
        try {
            const response = await fetch(`${API_URL}/summury/${userId}`);
            const data = await response.json();
            setTransaction(data);
        } catch (error) {
            console.error(JSON.stringify(error));
        }
    }, [userId])

    const loadData = useCallback(async()=>{
        if(!userId) return;
        setLoading(true);
        try {
            // can run on parallel
            await Promise.all([fetchTransactions(), fetchSummury()])
        } catch (error) {
            console.log("Error loading data : ", error);            
        }finally {
            setLoading(false);
        }
    }, [userId]);

    const deleteTransaction = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/transactions/api/${id}`, { method: "DELETE" });
            if(!response.ok) throw new Error("Failed to fetch transaction");
            loadData();
            Alert.alert("Success", "Transaction deleted successfully");
        } catch (error: any) {
            console.log("Error in deleting the transaction : ", error);
            Alert.alert("Error", error.message)
        }
    }
}