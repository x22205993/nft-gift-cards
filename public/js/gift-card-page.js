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

// async function displayUserTokens() {
//     try {
//         const tokenInfoList = await getAllTokenInfo();
//         const tokenIds = tokenInfoList.map((info, index) => String(index + 1));
//         const addressList = tokenInfoList.map(() => walletAddress);

//         const balances = await contract.methods.balanceOfBatch(addressList, tokenIds).call();
//         const userTokens = [];

//         for (let i = 0; i < tokenIds.length; i++) {
//             const balance = web3.utils.toNumber(balances[i]);
//             if (balance > 0) {
//                 const tokenInfo = tokenInfoList[i];
//                 console.log(tokenInfo.ipfsId)
//                 const metadata = await fetchMetadataFromIPFS(tokenInfo.ipfsId);
//                 const imageUrl = await fetchImageFromIPFS(metadata.image.replace('ipfs://', ''));
//                 console.log(imageUrl)
//                 userTokens.push({
//                     tokenId: tokenIds[i],
//                     ipfsId: tokenInfo.ipfsId,
//                     name: metadata.name,
//                     description: metadata.description,
//                     quantity: tokenInfo.quantity,
//                     balance: balance,
//                     value: tokenInfo.value,
//                     imageUrl: imageUrl
//                 });
//             }
//         }
//         displayNFTCards(userTokens)
//         console.log(userTokens);
//     } catch (error) {
//         console.error('Error displaying user tokens:', error);
//     }
// }


// function displayNFTCards(userTokens) {
//     const nftCardsContainer = document.getElementById('nftCards');
//     nftCardsContainer.innerHTML = '';
   
//     userTokens.forEach(token => {
//         let giftCardElem =  document.getElementById('gift-card-elem').content.cloneNode(true)
//         let _get = (id) => giftCardElem.getElementById(id)
//         _get('token-image').src = token.imageUrl
//         _get('token-image').alt = token.name
//         _get('token-name').innerText = token.name
//         _get('token-description').innerText = token.description
//         _get('token-balance').innerText = `${token.balance}/${token.quantity}`
//         _get('token-value').innerHTML = `${token.value} Gwei`
//         _get('redeem-modal-btn').addEventListener('click', () => {
//             redeemModal.dataset.id = token.tokenId
//             redeemModal.dataset.balance = token.balance 
//             redeemModal.dataset.value = token.value 
             
//         })
//         nftCardsContainer.appendChild(giftCardElem);
//     })
// }

// let redeemModal = document.getElementById('redeemModal')
// let redeemButton = redeemModal.querySelector('#redeemButton')
// let redeemableAmountField = document.getElementById('redeemableAmount')
// let quantityInput = document.getElementById('quantityInput')


// document.getElementById('increaseQty')
// .addEventListener('click', () => {
//     quantityInput.value = isNaN(quantityInput.value) || !quantityInput.value ? 0 : parseInt(quantityInput.value) + 1
//     validateRedeemInput()
// })

// document.getElementById('decreaseQty')
// .addEventListener('click', () => {
//     quantityInput.value = parseInt(quantityInput.value) - 1 < 0 || isNaN(quantityInput.value) || !quantityInput.value ? 0 : parseInt(quantityInput.value) - 1 
//     validateRedeemInput()
// })


// quantityInput.addEventListener('input', () => {
//     validateRedeemInput()
// })

// function validateRedeemInput() {
//     let quantity = parseInt(quantityInput.value)
//     let balance = redeemModal.dataset.balance
//     if(isNaN(quantity)) {
//         redeemButton.disabled = true
//         return
//     }
//     if(quantity === 0 || quantity > balance) {
//         redeemButton.disabled = true
//         updateRedeemAmount()
//         return
//     }
//     updateRedeemAmount()
//     redeemButton.disabled = false
// }

// function updateRedeemAmount() {
//     redeemableAmountField.innerText = `${parseInt(quantityInput.value) * redeemModal.dataset.value} Gwei`
// }

// redeemButton.addEventListener('click', async () => {
//     console.log(redeemModal.dataset.id, parseInt(quantityInput.value))
//     const resp = await contract.methods.redeem(redeemModal.dataset.id, parseInt(quantityInput.value))
//     .send({
//         from: walletAddress
//     })
//     .then((response) => {
//         console.log(response);
//         alert("Transaction successful");
//         window.location.reload()
//     })
//     .catch((error) => {
//         console.error(error);
//         alert("Error occurred during transaction");
//     }); 
//     console.log(resp)
// })


// async function getGIFS(searchTerm) {
//     let gifUrls = []
//     let gifs = ""
//     if (!searchTerm) {
//         gifs = await giphyService.getTrendingGifs(100) 
//     } else {
//         gifs = await giphyService.searchGifs(searchTerm, 100)
//     }
//     gifs.data.map((gif) => gifUrls.push(gif.images.original.url))
//     return gifUrls
// }

// let gifCardTemplate = document.getElementById('gif-card')
// let gifList = document.getElementById('gif-list')


// document.getElementById('open-gif-bar-btn').addEventListener('click', async () => {
//     let gifs = await getGIFS()
//     gifs.map(gif => displayGif(gif))
// })

// const myModal = new bootstrap.Modal('#exampleModal')

// function displayGif(gif) {
//     let gifCard = gifCardTemplate.content.cloneNode(true)
//     gifCard.getElementById('gif-img').src = gif
//     gifCard.querySelector('div').addEventListener('click', () => { 
//         setPreview(gif)
//         myModal.hide()
//     })
//     gifList.appendChild(gifCard)
// }

// let gifSearchInput = document.getElementById('gif-search-input')

// gifSearchInput.addEventListener('keypress', async (event) => {
//     if (event.key !== "Enter") return;
//     let gifs = await getGIFS(gifSearchInput.value)
//     gifList.innerHTML = ""
//     gifs.map(gif => displayGif(gif))
// })

// let previewElem = document.getElementById('preview')
// let previewContentElem = document.getElementById('previewContent')
// const gifUpdatedEvent = new CustomEvent('gif-updated')

// function setPreview(url) {
//     previewContentElem.style = "display:none !important;"
//     preview.style.background = `url(${url})`
//     preview.style.backgroundRepeat = 'no-repeat'
//     preview.style.backgroundSize = '100% 100%'
//     trashIconLayer.style = "display:block;"
//     preview.dispatchEvent(gifUpdatedEvent)

// }

// let gifCards = document.getElementsByClassName('gif-card')
// let trashIconLayer = document.getElementById('trash-icon-layer')
// let trashIcon = document.getElementById('trash-icon')

// trashIcon.addEventListener('click', () => {
//     trashIconLayer.style = "display:none;"
//     previewContentElem.style = "display:flex !important;"
//     preview.style.background = ''
// })

// let fileInput = document.getElementById('image')

// document.getElementById('browse-files-link').addEventListener('click', () => {
//     console.log("Called")
//     fileInput.click()
// })

// fileInput.addEventListener('change', (event) => {
// 	const file = event.target.files[0];
// 	const url = URL.createObjectURL(file);	
//     setPreview(url)
// })