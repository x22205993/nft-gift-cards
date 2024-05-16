import { messageModal } from "./message-modal.js";
import { spinnerService } from "./spinner.js";
import { userTokensService } from "./user-tokens.js";
import { WalletConnectError } from "./errors.js";
import { walletService } from "./wallet.js";

export async function displayUserTokens() {
    try {
        spinnerService.showSpinner()
        walletService.isWalletConnected()
        const userTokens = await userTokensService.getUserTokens()
        const redeemModal = document.getElementById('redeemModal')
        const nftCardsContainer = document.getElementById('nftCards');
        nftCardsContainer.innerHTML = '';
        userTokens.forEach(token => {
            let giftCardElem =  document.getElementById('gift-card-elem').content.cloneNode(true)
            let _get = (id) => giftCardElem.getElementById(id)
            _get('token-id').innerText = `#${token.tokenId}`
            _get('token-image').src = token.imageUrl
            _get('token-image').alt = token.name
            _get('token-name').innerText = token.name
            _get('token-description').innerText = token.description
            _get('token-balance').innerText = `${token.balance}/${token.quantity}`
            _get('token-value').innerHTML = `${token.value} Gwei`
            _get('redeem-modal-btn').addEventListener('click', () => {
                redeemModal.dataset.id = token.tokenId
                redeemModal.dataset.balance = token.balance 
                redeemModal.dataset.value = token.value      
            })
            nftCardsContainer.appendChild(giftCardElem);
        })
        spinnerService.hideSpinner()
    } catch (e) {
        spinnerService.hideSpinner()
        console.log(e)
        if (e instanceof WalletConnectError) {
            messageModal.showMessage('Wallet Connect Problem', e.message,  () => { window.location.reload() })   
        } else {
            messageModal.showMessage('Something went wrong', 'Please try again later', () => {  window.location.reload() })   
        }
    }

}