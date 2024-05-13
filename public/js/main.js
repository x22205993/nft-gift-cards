// let account;

// const web3 = new Web3('http://localhost:7545');
// let walletAddress = ""
// const connectMetamask = async () => {
//     if(!window.ethereum ) {
//         return
//     }
//     await window.ethereum.request({ method: 'eth_requestAccounts' });
//     const accounts = await web3.eth.getAccounts();
//     walletAddress = accounts[0]
//     document.getElementById('senderAddress').value = walletAddress;
//     let balance = await web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), "ether")
//     document.getElementById('balance').innerText = parseFloat(balance).toFixed(4) + " ETH"
//     document.getElementById('balance-item').style.display = "flex"
//     document.getElementById('connectButton').style.display = "none"
// };

// document.getElementById('connectButton').addEventListener('click', connectMetamask)

import { walletService } from "./wallet.js";
import { contractHandler } from "./contract.js";
import { initMintTokenForm } from "./mint-form.js";
import { createRedeemModal } from "./redeem-modal.js";
import { createGifModal } from "./gif-handler.js";
import { displayUserTokens } from "./gift-card-page.js";



window.web3 = new Web3(window.ethereum);
    

( async function () {
    // tokenAmountInput = document.getElementById('tokenAmount')
    // tokenAmountInput
    // .addEventListener('input', (e) => {
    //     console.log(tokenAmountInput.value)
    //     if(!tokenAmountInput.value) {
    //         document.getElementById('gweiToEthOutput').innerText = ""
    //         return
    //     }
    //     let gweiToEth = web3.utils.fromWei(web3.utils.toWei(tokenAmountInput.value.toString(), 'gwei'), 'ether')
    //     document.getElementById('gweiToEthOutput').innerText = gweiToEth + " eth"
    // })

    await walletService.connectWallet()
    await contractHandler.connectContract()
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

    // document.getElementById('giftCardSubmitBtn').addEventListener('click', async (event) => {
    //     if (!walletAddress) {
    //         messageModalService.showMessage('Wallet Login', 'Please connect wallet to proceed')
    //     }
    //     spinnerService.showSpinner()
    //     const imageURL = document.getElementById('preview').style.background.replace('url("', "").replace('")','')
    //     const name = document.getElementById('name').value;
    //     const message = document.getElementById('message').value;
    //     const quantity = document.getElementById('quantity').value;
    //     const tokenAmount = document.getElementById('tokenAmount').value;
    //     const senderAddress = walletAddress
    //     console.log(imageURL)
    //     let imageData = await fetch(imageURL)
    //     imageData = await imageData.blob()
    //     let imageFile = ""
    //     if (typeof(imageData) == Blob) {
    //         const imageBuffer = await image.arrayBuffer();
    //         imageFile = new File([imageBuffer], 'gift_card_image.gif', { type: 'image/gif' });
    //     } else {
    //         imageFile = imageData
    //     }
    //     const ipfsImageId = await ipfsService.uploadFileToIPFS(imageFile);
    
    //     const metadata = {
    //         name: name,
    //         description: message,
    //         image: 'ipfs://' + ipfsImageId,
    //         collection: "Gift Cards"
    //     };
    //     const ipfsMetadata = await ipfsService.uploadJSONToIPFS(metadata);
    
    //     const tokenPriceInWei = web3.utils.toWei(tokenAmount, 'Gwei');
    //     await contract.mint(quantity, tokenPriceInWei, ipfsMetadata.IpfsHash)

    //     // contract.methods.mint(quantity, tokenPriceInWei, ipfsMetadata.IpfsHash)
    //     //     .send({
    //     //         from: senderAddress,
    //     //         value: quantity * tokenPriceInWei
    //     //     })
    //     //     .then((response) => {
    //     //         console.log(response);
    //     //         hideSpinner()
    //     //         showMessage("Success", "Transaction Sent", () => { window.location.reload() })
    //     //     })
    //     //     .catch((error) => {
    //     //         console.error(error);
    //     //         hideSpinner()
    //     //         showMessage("Error", "Error occurred during transaction", () => { window.location.reload() })
    //     //     });
    //         event.preventDefault();
    //         return false 
    // });

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
    //     const resp = await contract.redeem(redeemModal.dataset.id, parseInt(quantityInput.value))
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
    //     const file = event.target.files[0];
    //     const url = URL.createObjectURL(file);	
    //     setPreview(url)
    // })

})()


// tokenAmountInput
// .addEventListener('input', (e) => {
//     console.log(tokenAmountInput.value)
//     if(!tokenAmountInput.value) {
//         document.getElementById('gweiToEthOutput').innerText = ""
//         return
//     }
//     let gweiToEth = web3.utils.fromWei(web3.utils.toWei(tokenAmountInput.value.toString(), 'gwei'), 'ether')
//     document.getElementById('gweiToEthOutput').innerText = gweiToEth + " eth"
// })


// let homePage = document.getElementById('home-page')
// let giftCardsPage = document.getElementById('gift-cards-page')
// document.getElementById('home-page-link').addEventListener('click', () => {
//     homePage.style.display = "block"
//     giftCardsPage.style.display = "none"
// })
// document.getElementById('gift-cards-page-link').addEventListener('click', () => {
//     homePage.style.display = "none"
//     giftCardsPage.style.display = "block"
//     displayUserTokens();
// })

// let validationFns = validateForm('giftCardSubmitBtn', customValidation)
// let validate = validationFns.basicValidation
// let customValidate = validationFns.customValidation
// validate('name', false, /^[0-9a-zA-Z-_ ]+$/, `Invalid character only 0-9 A-Z a-z - _ are allowed`)
// validate('message', false)
// validate('quantity', true, /^[0-9]+$/, 'Invalid character only numbers are allowed')
// validate('tokenAmount', true, /^[0-9]+$/, 'Invalid character only numbers are allowed')
// customValidate()

// function customValidation(args) {
//     let fileField = document.getElementById('image')
//     fileField.addEventListener('change', () => {
//         if (fileField.files.length === 0 ) {
//             args.validFields[args.fieldIdx] = false
//             args._updateFormValidation()
//         }
//         args.validFields[args.fieldIdx] = true
//         args._updateFormValidation()
//     })
//     let trashIcon =  document.getElementById('trash-icon')
//     trashIcon.addEventListener('click', () => {
//         args.validFields[args.fieldIdx] = false
//         args._updateFormValidation()
//     })
//     let previewDiv = document.getElementById('preview')
//     previewDiv.addEventListener('gif-updated', () => {
//         args.validFields[args.fieldIdx] = true
//         args._updateFormValidation()
//     })
// }

// function validateForm(submitBtnId, customValidation) {
//     let validFields = []
//     let formSubmitBtn = document.getElementById(submitBtnId)
//     formSubmitBtn.disabled = true

//     function _updateFormValidation() {
//         console.log(validFields)
//         formSubmitBtn.disabled = true
//         for (let validField of validFields) {
//             if (!validField) return;
//         }
//         formSubmitBtn.disabled = false
//     }
//     function _customValidationWrapper() {
//         validFields.push(false)
//         let fieldIdx = validFields.length - 1
//         customValidation(...arguments, {validFields, fieldIdx,  _updateFormValidation})
//     }

//     function _validate(fieldName, checkZero, regex, regexErrMsg) {
//         let field = document.getElementById(fieldName)
//         let fieldValidationDiv  = document.getElementById(`${fieldName}-field-validation-div`)
//         validFields.push(false)
//         let fieldIdx = validFields.length - 1
//         field.addEventListener('input', (e) => {
//             if (field.value === "") {
//                 field.classList.add('is-invalid')
//                 fieldValidationDiv.innerText = `${fieldName} is required`
//                 validFields[fieldIdx] = false
//                 _updateFormValidation()
//                 return
//             } 

//             if( checkZero && field.value == "0") {
//                 field.classList.add('is-invalid')
//                 fieldValidationDiv.innerText = `${fieldName} is required`
//                 validFields[fieldIdx] = false
//                 _updateFormValidation()
//                 return                
//             }

//             if (regex && !regex.test(field.value)) {
//                 field.classList.add('is-invalid')
//                 fieldValidationDiv.innerText = regexErrMsg
//                 validFields[fieldIdx] = false
//                 _updateFormValidation()
//                 return
//             }

//             field.classList.remove('is-invalid')
//             fieldValidationDiv.innerText = ""
//             validFields[fieldIdx] = true
//             _updateFormValidation()
//             return
//         })
//     }

//     return {"basicValidation": _validate, "customValidation": _customValidationWrapper}
// }

// let spinner = document.getElementById('spinner')

// function showSpinner() {
//     spinner.style.display = "block"
// }

// function hideSpinner() {
//     spinner.style.display = "none"
// }

// const messageModalDiv = document.getElementById('exampleModal2')
// const messageModal = new bootstrap.Modal('#exampleModal2')
// const messageBody = document.getElementById('message-body')
// const messageTitle = document.getElementById('message-title')
// const messageOkBtn = document.getElementById('message-ok-btn')

// let modalCloseCallback = () => {}

// function showMessage(title, message, callback) {
//     messageBody.innerText = message
//     messageTitle.innerText = title
//     messageModal.show()
//     modalCloseCallback = callback
// }


// messageOkBtn.addEventListener('click', () => {
//     messageModal.hide()
// })

// messageModalDiv.addEventListener('hidden.bs.modal', () => {
//     modalCloseCallback()
// })
