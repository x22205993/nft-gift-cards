// let contract = ""
// async function connectContract() {
//     contract = await new web3.eth.Contract(abi, contractAddress);
//     await connectMetamask()
// 	await getUserTokenBalances()
// }
// connectContract()

import { walletService } from "./wallet.js";
import { contractConfig } from "./contract-config.js";
import { WalletConnectError } from "./errors.js";

function ContractHandler() {
	this.contract =  ""
}

ContractHandler.prototype.connectContract = async function () {
	this.contract =  await new web3.eth.Contract(contractConfig.abi, contractConfig.contractAddress);
}

ContractHandler.prototype.mint = async function (quantity, tokenPriceInGWei, ipfsUri) {
	console.log(this._getSenderAddress(), this.contract)
	const resp =await this.contract.methods.mint(quantity, tokenPriceInGWei, ipfsUri)
	.send({
		from: this._getSenderAddress(),
		value: (quantity * (web3.utils.toWei(tokenPriceInGWei, 'gwei'))).toString()
	})
	console.log(resp)
}

ContractHandler.prototype.balanceOfBatch = async function (tokenIds) {
	const walletAddress = this._getSenderAddress()
	const addressList = tokenIds.map(() => walletAddress);
	return await this.contract.methods.balanceOfBatch(addressList, tokenIds).call();
}

ContractHandler.prototype.getTokensMetadata = async function () {
	return await this.contract.methods.getTokenInfoList().call();	
}

ContractHandler.prototype.redeem = async function (tokenId, quantity) {
	await this.contract.methods.redeem(tokenId, quantity)
    .send({
        from: this._getSenderAddress()
    })
}

ContractHandler.prototype.getTokenInfoList = async function () {
	return await this.contract.methods.getTokenInfoList().call()
}

ContractHandler.prototype._getSenderAddress = function () {
	let walletAddress = walletService.getWalletAddress()
	if (!walletAddress) {
		throw new WalletConnectError('Unable to find wallet address. Please ensure wallet is connected')
	}
	return walletAddress
}

export const contractHandler = new ContractHandler()

// document.getElementById('giftCardSubmitBtn').addEventListener('click', async (event) => {
// 	if (!walletAddress) {
// 		showMessage('Wallet Login', 'Please connect wallet to proceed')
// 	}
// 	showSpinner()
//     const imageURL = document.getElementById('preview').style.background.replace('url("', "").replace('")','')
//     const name = document.getElementById('name').value;
//     const message = document.getElementById('message').value;
//     const quantity = document.getElementById('quantity').value;
//     const tokenAmount = document.getElementById('tokenAmount').value;
//     const senderAddress = walletAddress
// 	console.log(imageURL)
// 	let imageData = await fetch(imageURL)
// 	imageData = await imageData.blob()
// 	let imageFile = ""
// 	if (typeof(imageData) == Blob) {
// 		const imageBuffer = await image.arrayBuffer();
// 		imageFile = new File([imageBuffer], 'gift_card_image.gif', { type: 'image/gif' });
// 	} else {
// 		imageFile = imageData
// 	}
//     const ipfsImageId = await uploadFileToIPFS(imageFile);

//     // Send metadata to contract
//     const metadata = {
//         name: name,
//         description: message,
//         image: 'ipfs://' + ipfsImageId,
//         collection: "Gift Cards"
//     };
//     const ipfsMetadata = await uploadJSONToIPFS(metadata);

//     // Mint tokens
//     const tokenPriceInWei = web3.utils.toWei(tokenAmount, 'Gwei');
//     contract.methods.mint(quantity, tokenPriceInWei, ipfsMetadata.IpfsHash)
//         .send({
//             from: senderAddress,
//             value: quantity * tokenPriceInWei
//         })
//         .then((response) => {
//             console.log(response);
// 			hideSpinner()
// 			showMessage("Success", "Transaction Sent", () => { window.location.reload() })
//         })
//         .catch((error) => {
//             console.error(error);
// 			hideSpinner()
// 			showMessage("Error", "Error occurred during transaction", () => { window.location.reload() })
//         });
//         event.preventDefault();
//         return false 
// });

// async function uploadFileToIPFS(imageFile) {
//     const formData = new FormData();
// 	console.log(imageFile)
//     formData.append('image', imageFile);

//     try {
//         const response = await fetch('/api/upload/image', {
//             method: 'POST',
//             body: formData
//         });
//         const data = await response.json();
//         return data.ipfsId;
//     } catch (error) {
//         console.error('Error uploading image to IPFS:', error);
//         throw error;
//     }
// }

// async function uploadJSONToIPFS(json) {
//     try {
//         const response = await fetch('/api/upload/json', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(json)
//         });
//         const data = await response.json();
//         return data.ipfsId;
//     } catch (error) {
//         console.error('Error uploading JSON to IPFS:', error);
//         throw error;
//     }
// }

// async function getUserTokenBalances() {
//     const tokenInfoList = await getAllTokenInfo();
//     const tokenIds = tokenInfoList.map((info, index) => String(index + 1));
// 	const addressList = tokenInfoList.map(() => walletAddress)
// 	console.log(tokenIds, addressList)

//     const balances = await contract.methods.balanceOfBatch(addressList, tokenIds).call();
// 	console.log(balances)
//     const userTokens = [];
//     for (let i = 0; i < tokenIds.length; i++) {
// 		const balance = web3.utils.toNumber(balances[i])
//         if (balance > 0) {
// 			console.log(balance)
//             const tokenInfo = tokenInfoList[i];
//             userTokens.push({
// 				tokenId: tokenIds[i],
//                 ipfsId: tokenInfo.ipfsId,
//                 value: web3.utils.toNumber(tokenInfo.value),
//                 quantity: balance
//             });
//         }
//     }
// 	console.log(userTokens)
// }

// async function getAllTokenInfo() {
//     const tokenInfoList = await contract.methods.getTokenInfoList().call();
// 	return tokenInfoList;
// }

// async function fetchMetadataFromIPFS(ipfsId) {
//     try {
//         const response = await fetch(`https://ipfs.io/ipfs/${ipfsId}`);
//         const metadata = await response.json();
//         return metadata;
//     } catch (error) {
//         console.error('Error fetching metadata from IPFS:', error);
//         throw error;
//     }
// }

// async function fetchImageFromIPFS(ipfsId) {
//     try {
//         const response = await fetch(`https://ipfs.io/ipfs/${ipfsId}`);
//         const blob = await response.blob();
// 		console.log(blob)
//         const imageUrl = URL.createObjectURL(blob);
//         return imageUrl;
//     } catch (error) {
//         console.error('Error fetching image from IPFS:', error);
//         throw error;
//     }
// }
