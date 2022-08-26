import { ReactNode, useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../services/api'

export interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

export interface CreateTransactionInput {
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
}
export interface TransactionContextType {
  transactions: Transaction[]
  fetchTransactions(query?: string): Promise<void>
  createTransaction(data: CreateTransactionInput): Promise<void>
}

interface TransactionsProviderProps {
  children: ReactNode
}

export const TransactionContext = createContext({} as TransactionContextType)

export function TransactionProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('/transactions', {
      params: {
        q: query,
      },
    })

    setTransactions(response.data)
  }, [])

  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      const { description, category, type, price } = data

      const response = await api.post('/transactions', {
        description,
        category,
        type,
        price,
        createdAt: new Date().toISOString(),
      })
      updateTransactions(response.data)
    },
    [],
  )

  function updateTransactions(transaction: Transaction) {
    setTransactions((state) => [...state, transaction])
  }
  useEffect(() => {
    fetchTransactions()
  }, [])
  return (
    <TransactionContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
