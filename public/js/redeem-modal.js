import { WalletConnectError } from "./errors.js"
import { messageModal } from "./message-modal.js"
import { spinnerService } from "./spinner.js"
import { userTokensService } from "./user-tokens.js"
import { walletService } from "./wallet.js"

export function createRedeemModal() {
    const redeemModal = document.getElementById('redeemModal')
    const redeemButton = redeemModal.querySelector('#redeemButton')
    const redeemableAmountField = document.getElementById('redeemableAmount')
    const quantityInput = document.getElementById('quantityInput')
    const modal = new bootstrap.Modal('#redeemModal')
    const giftCardNavItem = document.getElementById('gift-cards-page-link')

    document.getElementById('increaseQty')
    .addEventListener('click', () => {
        quantityInput.value =  !isNaN(quantityInput.value) ? parseInt(quantityInput.value) + 1 : 0
        quantityInput.value = (_validateRedeemInput() && quantityInput.value) || 0
        _updateRedeemAmount()
    })

    document.getElementById('decreaseQty')
    .addEventListener('click', () => {
        console.log(quantityInput.value)
        quantityInput.value = !isNaN(quantityInput.value) ? parseInt(quantityInput.value) - 1  : 0
        console.log(quantityInput.value)
        quantityInput.value = (_validateRedeemInput() && quantityInput.value) || 0
        _updateRedeemAmount()
      
    })

    redeemButton.addEventListener('click', async () => {
        console.log(redeemModal.dataset.id, parseInt(quantityInput.value))
        spinnerService.showSpinner()
        try {
            walletService.isWalletConnected()
            await userTokensService.redeemToken(redeemModal.dataset.id, parseInt(quantityInput.value))
            spinnerService.hideSpinner()
            messageModal.showMessage('Amount Redeemed', 'Amount Redeemed Successfully', () => { 
                modal.hide()
                giftCardNavItem.click()
                walletService.connectWallet()
            })
        } catch(e) {
            spinnerService.hideSpinner()
            console.log(e)
            if (e instanceof WalletConnectError) {
                messageModal.showMessage('Wallet Connect Problem', e.message)   
            } else {
                messageModal.showMessage('Something went wrong', 'Please try again later', () => { window.location.reload() })   
            }
        }
    })

    quantityInput.addEventListener('input', () => {
        _validateRedeemInput()
    })

    redeemModal.addEventListener('hide.bs.modal', event => {
        quantityInput.value = 0
        redeemableAmountField.innerText = '0 Gwei'
        redeemButton.disabled = true
    })


    function _validateRedeemInput() {
        let quantity = quantityInput.value
        let balance = redeemModal.dataset.balance
        if(isNaN(quantity)) {
            redeemButton.disabled = true
            return false
        }
        
        if( parseInt(quantity) === 0 || parseInt(quantity) > balance || parseInt(quantity) < 0 ) {
            redeemButton.disabled = true
            _updateRedeemAmount()
            return false
        }
        _updateRedeemAmount()
        redeemButton.disabled = false
        return true
    }

    function _updateRedeemAmount() {
        redeemableAmountField.innerText = `${parseInt(quantityInput.value) * redeemModal.dataset.value} Gwei`   
    }
}