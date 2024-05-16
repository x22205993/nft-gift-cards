import { walletService } from "./wallet.js";
import { contractHandler } from "./contract.js";
import { initMintTokenForm } from "./mint-form.js";
import { createRedeemModal } from "./redeem-modal.js";
import { createGifModal } from "./gif-handler.js";
import { displayUserTokens } from "./gift-card-page.js";
import { messageModal } from "./message-modal.js";

window.web3 = new Web3(window.ethereum);

( async function () {
    try {
        await walletService.connectWallet()
    } catch (e) {
        console.error("failure while connecting to wallet automatically can be tried manually")
    }
    try {
        await contractHandler.connectContract()
    } catch (e) {
        messageModal.showMessage("Server Error", "It seems like we are facing some issues. Please refresh the page or try again later", ()=> {window.location.reload()})
    }
    console.log("Contract Connected", contractHandler.contract)
    initMintTokenForm()
    createRedeemModal()
    createGifModal()

    let homePage = document.getElementById('home-page')
    let giftCardsPage = document.getElementById('gift-cards-page')
    document.getElementById('home-page-link').addEventListener('click', () => {
        homePage.style.display = "block"
        giftCardsPage.style.display = "none"
    })
    document.getElementById('gift-cards-page-link').addEventListener('click', async () => {
        homePage.style.display = "none"
        giftCardsPage.style.display = "block"
        await displayUserTokens();
    })
})()