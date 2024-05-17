import { giphyService } from "./giphy.js"
import { setPreview } from "./mint-form.js"

export function createGifModal() {
    let gifCardTemplate = document.getElementById('gif-card')
    let gifList = document.getElementById('gif-list') 
    let myModal = new bootstrap.Modal('#exampleModal')
    let modal = document.getElementById('exampleModal')
    let gifSearchInput = document.getElementById('gif-search-input')

    gifSearchInput.addEventListener('keypress', async (event) => {
        if (event.key !== "Enter") return;
        let gifs = await _getGifs(gifSearchInput.value)
        gifList.innerHTML = ""
        gifs.map(gif => _displayGif(gif))
    })

    document.getElementById('open-gif-bar-btn').addEventListener('click', async () => {
        let gifs = await _getGifs()
        gifs.map(gif => _displayGif(gif))
    })

    modal.addEventListener('hide.bs.modal', event => {
        gifSearchInput.value = ""
        gifList.innerHTML = ""
    })

    async function _getGifs (searchTerm) {
        let gifUrls = []
        let gifs = ""
        if (!searchTerm) {
            gifs = await giphyService.getTrendingGifs(100) 
        } else {
            gifs = await giphyService.searchGifs(searchTerm, 100)
        }
        gifs.data.map((gif) => gifUrls.push(gif.images.original.url))
        return gifUrls
    }

    function _displayGif(gif) {
        let gifCard = gifCardTemplate.content.cloneNode(true)
        gifCard.getElementById('gif-img').src = gif
        gifCard.querySelector('div').addEventListener('click', () => { 
            setPreview(gif)
            myModal.hide()
        })
        gifList.appendChild(gifCard)
    }

}

export async function getGifImageFile(url) {
    let imageData = await fetch(url)
    imageData = await imageData.blob()  
    const imageBuffer = await imageData.arrayBuffer();
    return new File([imageBuffer], 'gift_card_image.gif', { type: 'image/gif' }); 
}
