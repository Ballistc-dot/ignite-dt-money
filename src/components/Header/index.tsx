import { HeaderContainer, HeaderContent, NewTrasactionButton } from './styles'
import logoImg from '../../assets/Logo.svg'
import * as Dialog from '@radix-ui/react-dialog'
import { NewTransactionModal } from '../NewTransactionModal'
import { useState } from 'react'

export function Header() {
  const [open, setOpen] = useState(false)

  function closeModal(state: boolean) {
    setOpen(state)
  }
  return (
    <HeaderContainer>
      <HeaderContent>
        <img src={logoImg} alt="" />

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <NewTrasactionButton>Nova transação</NewTrasactionButton>
          </Dialog.Trigger>
          <Dialog.Portal>
            <NewTransactionModal onClose={closeModal} />
          </Dialog.Portal>
        </Dialog.Root>
      </HeaderContent>
    </HeaderContainer>
  )
}
