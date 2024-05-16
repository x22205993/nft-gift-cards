import { ipfsService } from "./ipfs.js";
import { contractHandler } from "./contract.js";
export function UserTokensService() {}

UserTokensService.prototype.getUserTokens = async function () {
    const tokenInfoList = await this.getTokensMetadata();
    const tokenIds = tokenInfoList.map((_, index) => String(index + 1));
    const balances = await contractHandler.balanceOfBatch(tokenIds);
    const userTokens = [];
    for (let i = 0; i < tokenIds.length; i++) {
        const balance = web3.utils.toNumber(balances[i]);
        if (balance > 0) {
            const tokenInfo = tokenInfoList[i];
            console.log(tokenInfo.ipfsId)
            const metadata = await ipfsService.fetchMetadataFromIPFS(tokenInfo.ipfsId);
            const imageUrl = await ipfsService.fetchImageFromIPFS(metadata.image.replace('ipfs://', ''));
            console.log(imageUrl)
            userTokens.push({
                tokenId: tokenIds[i],
                ipfsId: tokenInfo.ipfsId,
                name: metadata.name,
                description: metadata.description,
                quantity: tokenInfo.quantity,
                balance: balance,
                value: web3.utils.fromWei(tokenInfo.value, 'gwei'),
                imageUrl: imageUrl
            });
        }
    }
    return userTokens
}

UserTokensService.prototype.getTokensMetadata = async function () {
    return await contractHandler.getTokenInfoList()
}

UserTokensService.prototype.redeemToken = async function (tokenId, quantity) {
    const resp = await contractHandler.redeem(tokenId, quantity)
    console.log(resp)
}

UserTokensService.prototype.mintToken = async function (tokenName, tokenMessage, quantity, tokenAmount, tokenImage) {
    const ipfsImageId = await ipfsService.uploadFileToIPFS(tokenImage);
    console.log(ipfsImageId)
    const metadata = {
        name: tokenName,
        description: tokenMessage,
        image: 'ipfs://' + ipfsImageId
    };
    const ipfsMetadata = await ipfsService.uploadJSONToIPFS(metadata);
    await contractHandler.mint(quantity, tokenAmount, ipfsMetadata.IpfsHash)
}

export const userTokensService = new UserTokensService()