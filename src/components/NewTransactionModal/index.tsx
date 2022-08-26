import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as zod from 'zod'
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react'
import {
  Overlay,
  Content,
  CloseButton,
  TransactionType,
  TransactionTypeButton,
} from './styles'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContextSelector } from 'use-context-selector'
import { TransactionContext } from '../../contexts/TransactionsContext'

const newTransactionSchema = zod.object({
  description: zod.string(),
  price: zod.number(),
  category: zod.string(),
  type: zod.enum(['income', 'outcome']),
})

type NewTransactionInput = zod.infer<typeof newTransactionSchema>

interface NewTransactionModalProps {
  onClose(state: boolean): void
}

export function NewTransactionModal({ onClose }: NewTransactionModalProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NewTransactionInput>({
    resolver: zodResolver(newTransactionSchema),
    defaultValues: {
      type: 'income',
    },
  })

  const createTransaction = useContextSelector(
    TransactionContext,
    (context) => {
      return context.createTransaction
    },
  )

  async function handleCreateNewTransaction(data: NewTransactionInput) {
    await createTransaction(data)
    onClose(false)
  }
  return (
    <Dialog.Portal>
      <Overlay />
      <Content>
        <CloseButton>
          <X size={24} />
        </CloseButton>
        <Dialog.Title>Nova transação</Dialog.Title>
        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input
            type="text"
            placeholder="Descrição"
            required
            {...register('description')}
          />
          <input
            type="number"
            placeholder="Preço"
            required
            {...register('price', { valueAsNumber: true })}
          />
          <input
            type="text"
            placeholder="Categoria"
            required
            {...register('category')}
          />
          <Controller
            control={control}
            name="type"
            render={({ field }) => {
              return (
                <TransactionType
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <TransactionTypeButton value="income" variant="income">
                    <ArrowCircleUp size={24} /> Entrada
                  </TransactionTypeButton>
                  <TransactionTypeButton value="outcome" variant="outcome">
                    <ArrowCircleDown size={24} /> Saída
                  </TransactionTypeButton>
                </TransactionType>
              )
            }}
          />

          <button type="submit" disabled={isSubmitting}>
            Cadastrar
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}
