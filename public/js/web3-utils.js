export function convertGweiToEther(value) {
    return  web3.utils.fromWei(web3.utils.toWei(value.toString(), 'gwei'), 'ether')    
} 
