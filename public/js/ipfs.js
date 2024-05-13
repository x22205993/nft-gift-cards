
function IPFSService() {
    this.apiUrl = "https://ipfs.io/ipfs"

}

IPFSService.prototype.fetchMetadataFromIPFS = async function (ipfsId) {
        const response = await fetch(`${this.apiUrl}/${ipfsId}`);
        const metadata = await response.json();
        return metadata;
}

IPFSService.prototype.fetchImageFromIPFS = async function (ipfsId) {
        const response = await fetch(`${this.apiUrl}/${ipfsId}`);
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        return imageUrl;
}

IPFSService.prototype.uploadFileToIPFS = async function(imageFile) {
    const formData = new FormData();
	console.log(imageFile)
    formData.append('image', imageFile);

    try {
        const response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return data.ipfsId;
    } catch (error) {
        console.error('Error uploading image to IPFS:', error);
        throw error;
    }
}

IPFSService.prototype.uploadJSONToIPFS = async function(json) {
    try {
        const response = await fetch('/api/upload/json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        });
        const data = await response.json();
        return data.ipfsId;
    } catch (error) {
        console.error('Error uploading JSON to IPFS:', error);
        throw error;
    }
}


export const ipfsService = new IPFSService()