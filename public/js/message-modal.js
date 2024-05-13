function MessageModal() {
    this.messageModalDiv = document.getElementById('exampleModal2')
    this.messageModal = new bootstrap.Modal('#exampleModal2')
    this.messageBody = document.getElementById('message-body')
    this.messageTitle = document.getElementById('message-title')
    this.messageOkBtn = document.getElementById('message-ok-btn')
    this.modalCloseCallback = () => {}   

    this.messageOkBtn.addEventListener('click', () => {
       this.messageModal.hide()
    })
    
    this.messageModalDiv.addEventListener('hidden.bs.modal', () => {
        this.modalCloseCallback()
    })
    
}

MessageModal.prototype.showMessage = function (title, message, callback) {
    this.messageBody.innerText = message
    this.messageTitle.innerText = title
    this.messageModal.show()
    this.modalCloseCallback = callback || (() => {})
}

export const messageModal = new MessageModal()