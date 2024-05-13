function PreviewDomHandler () {
    this.preview =  document.getElementById('preview')
    this.previewContentElem = document.getElementById('previewContent')
    this.trashIconLayer = document.getElementById('trash-icon-layer')
    this.trashIcon = document.getElementById('trash-icon')
    this.fileInput =  document.getElementById('image')
}

PreviewDomHandler.prototype.getPreview = function (wrap=false) {
    return wrap ? this._wrapDomElement(this.preview) : this.preview;
};

PreviewDomHandler.prototype.getPreviewContentElem = function (wrap=false) {
    return wrap ? this._wrapDomElement(this.previewContentElem) : this.previewContentElem;
};

PreviewDomHandler.prototype.getTrashIconLayer = function (wrap=false) {
    return wrap ? this._wrapDomElement(this.trashIconLayer) : this.trashIconLayer;
};

PreviewDomHandler.prototype.getTrashIcon = function (wrap=false) {
    return wrap ? this._wrapDomElement(this.trashIcon) : this.trashIcon;
};

PreviewDomHandler.prototype.getFileInput = function (wrap=false) {
    return wrap ? this._wrapDomElement(this.fileInput) : this.fileInput;
};

PreviewDomHandler.prototype._wrapDomElement = function (domElement) {
    const element = Object.create(domElement)
        element.setStyle = (prop, value, important=false) => {
            domElement.style.setProperty(prop, value, important ? 'important' : '')
            return element
        }
        element.get = () => {
            return domElement
        }
        return element
}

export const previewDomHandler = new PreviewDomHandler()
