function GiphyService() {
    this.apiUrl = "https://api.giphy.com/v1/gifs"
    this.apiKey = "yD1i1Z5AUsJlHJqW9p10nCOZ91HWIAr0"
    this.LIMIT = 25
    this.offset = 0
    this.ratings = {
        G: 'g'
    }
    this.bundles = {
        MESSAGING_NON_CLIPS: 'messaging_non_clips'
    }
    this.rating = this.ratings.G
    this.bundle = this.bundles.MESSAGING_NON_CLIPS 
}

GiphyService.prototype.getTrendingGifs = async function (limit) {
    limit = limit || LIMIT
    let gifs = await fetch(this._getURL('trending', limit))
    gifs = await gifs.json() 
    return gifs
}

GiphyService.prototype.searchGifs = async function (searchTerm, limit) {
    let gifs = await fetch(`${this._getURL('search', limit)}&q=${searchTerm}`)
    gifs = await gifs.json() 
    return gifs
}
GiphyService.prototype._getURL = function (endpoint, limit) {
    return `${this.apiUrl}/${endpoint}?api_key=${this.apiKey}&limit=${limit}&offset=${this.offset}&rating=${this.rating}&bundle=${this.bundle}`
}

export const giphyService = new GiphyService();