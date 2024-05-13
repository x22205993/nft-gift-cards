import { WalletConnectError } from "./errors.js"
import { messageModal } from "./message-modal.js"
import { spinnerService } from "./spinner.js"
function WalletService() {
    this.collectButton = document.getElementById('connectButton')
    this.walletAddress = ""
    this.collectButton.addEventListener('click', async () => {
        try {
            spinnerService.showSpinner()
            await this.connectWallet()
            spinnerService.hideSpinner()
        } catch (e) {
            spinnerService.hideSpinner()
            messageModal.showMessage('Wallet Connect Problem', 'Unable to connect to wallet.')
        }
    })
}

WalletService.prototype.connectWallet = async function () {
    if(!window.ethereum ) {
        throw new WalletConnectError("Ethereum Provider not found. Can't connect wallet")
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    // const accounts = await web3.eth.getAccounts();
    this.walletAddress = accounts[0]
    console.log(accounts[0])
    let balance = await web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), "ether")
    document.getElementById('balance').innerText = parseFloat(balance).toFixed(4) + " ETH"
    document.getElementById('balance-item').style.display = "flex"
    this.collectButton.style.display = "none"
}

WalletService.prototype.getWalletAddress = function () {
    return this.walletAddress
}

WalletService.prototype.isWalletConnected = function () {
    if (!this.walletAddress) {
        throw new WalletConnectError("Wallet address not found. Please ensure wallet is connected")
    }
}

export const walletService = new WalletService()
