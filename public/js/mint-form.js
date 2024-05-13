import { WalletConnectError } from "./errors.js";
import { getGifImageFile } from "./gif-handler.js";
import { messageModal } from "./message-modal.js";
import { setMintFormValidation } from "./mint-form-validator.js";
import { previewDomHandler } from "./preview-dom-handler.js";
import { spinnerService } from "./spinner.js";
import { userTokensService } from "./user-tokens.js";
import { walletService } from "./wallet.js";
import { convertGweiToEther } from "./web3-utils.js";

export async function initMintTokenForm() {
    _setImageDisplayEvent()
    _setImageRemovalEvent()
    _setTokenAmountConversionEvent()
    await _setSubmitFormEvent()
    setMintFormValidation()
}

function _setTokenAmountConversionEvent() {
    let tokenAmountInput = document.getElementById('tokenAmount')
    let gweiToEthOutput = document.getElementById('gweiToEthOutput')
    tokenAmountInput
    .addEventListener('input', (e) => {
        console.log(tokenAmountInput.value)
        if(!tokenAmountInput.value) {
            gweiToEthOutput.innerText = ""
            return
        }
        gweiToEthOutput.innerText = convertGweiToEther(tokenAmountInput.value.toString()) + " eth"
    })
}

function _setImageDisplayEvent() {
    let fileInput = document.getElementById('image')

    document.getElementById('browse-files-link').addEventListener('click', () => {
        console.log("Called")
        fileInput.click()
    })

    previewDomHandler.getFileInput()
    .addEventListener('change', (event) => {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);	
        setPreview(url)
    })
}



export function setPreview(url) {
    previewDomHandler.getTrashIconLayer(true).setStyle('display', 'block')
    previewDomHandler.getPreviewContentElem(true).setStyle('display', 'none', true)
    previewDomHandler.getPreview(true)
    .setStyle('background', `url(${url})`)
    .setStyle('background-repeat', 'no-repeat')
    .setStyle('background-size', '100% 100%')
    .get()
    .dispatchEvent(new CustomEvent('image-uploaded'))
}

function _setImageRemovalEvent() {
    previewDomHandler.getTrashIcon()
    .addEventListener('click', () => {
        previewDomHandler.getTrashIconLayer(true).setStyle('display', 'none')
        previewDomHandler.getPreviewContentElem(true).setStyle('display', 'flex', true)
        previewDomHandler.getPreview(true).setStyle('background', '')
        previewDomHandler.getFileInput().value = ""
    })

}

async function _setSubmitFormEvent() {
    document.getElementById('giftCardSubmitBtn').addEventListener('click', async (event) => {
        spinnerService.showSpinner()
        try {
            walletService.isWalletConnected()
            const name = document.getElementById('name').value;
            const message = document.getElementById('message').value;
            const quantity = document.getElementById('quantity').value;
            const tokenAmount = document.getElementById('tokenAmount').value;
            const image = document.getElementById('image')
            let tokenImage = ""
            if( image.files.length != 0 ) {
                tokenImage = image.files[0]
            } else {
                const imageURL = previewDomHandler.getPreview().style.background.replace('url("', "").replace('")','')
                tokenImage = await getGifImageFile(imageURL)
            }
            await userTokensService.mintToken(name, message, quantity, tokenAmount, tokenImage)
            spinnerService.hideSpinner()
            messageModal.showMessage('Success', 'Transaction sent successfully. Token ID and other details can be fetched from the gift cards page', () => { window.location.reload() })
        } catch (e) {
            spinnerService.hideSpinner()
            console.log(e)
            if (e instanceof WalletConnectError) {
                messageModal.showMessage('Wallet Connect Problem', e.message)
            } else {
                messageModal.showMessage('Something went wrong', 'Please try again later', () => { window.location.reload() })          
            }
        }
        event.preventDefault();
        return false 
    })
}
