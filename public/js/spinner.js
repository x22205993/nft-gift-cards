function SpinnerService() {
    this.spinner = document.getElementById('spinner')
}

SpinnerService.prototype.showSpinner = function () {
    this.spinner.style.display = "block"
}

SpinnerService.prototype.hideSpinner = function () {
    this.spinner.style.display = "none"
}

export const spinnerService = new SpinnerService()
