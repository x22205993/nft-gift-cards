import { previewDomHandler } from "./preview-dom-handler.js"

export function setMintFormValidation() {
    let validationFns = validateForm('giftCardSubmitBtn', customValidation)
    let validate = validationFns.basicValidation
    let customValidate = validationFns.customValidation
    validate('name', false, /^[0-9a-zA-Z-_ ]+$/, `Invalid character only 0-9 A-Z a-z - _ are allowed`)
    validate('message', false)
    validate('quantity', true, /^[0-9]+$/, 'Invalid character only numbers are allowed')
    validate('tokenAmount', true, /^[0-9]+$/, 'Invalid character only numbers are allowed')
    customValidate()

    function customValidation(args) {
        previewDomHandler.getTrashIcon().addEventListener('click', () => {
            args.validFields[args.fieldIdx] = false
            args._updateFormValidation()
        })
        previewDomHandler.getPreview().addEventListener('image-uploaded', () => {
            args.validFields[args.fieldIdx] = true
            args._updateFormValidation()
        })
    }

    function validateForm(submitBtnId, customValidation) {
        let validFields = []
        let formSubmitBtn = document.getElementById(submitBtnId)
        formSubmitBtn.disabled = true

        function _updateFormValidation() {
            formSubmitBtn.disabled = true
            for (let validField of validFields) {
                if (!validField) return;
            }
            formSubmitBtn.disabled = false
        }
        function _customValidationWrapper() {
            validFields.push(false)
            let fieldIdx = validFields.length - 1
            customValidation(...arguments, {validFields, fieldIdx,  _updateFormValidation})
        }

        function _validate(fieldName, checkZero, regex, regexErrMsg) {
            let field = document.getElementById(fieldName)
            let fieldValidationDiv  = document.getElementById(`${fieldName}-field-validation-div`)
            validFields.push(false)
            let fieldIdx = validFields.length - 1
            field.addEventListener('input', (e) => {
                if (field.value === "") {
                    field.classList.add('is-invalid')
                    fieldValidationDiv.innerText = `${fieldName} is required`
                    validFields[fieldIdx] = false
                    _updateFormValidation()
                    return
                } 

                if( checkZero && field.value == "0") {
                    field.classList.add('is-invalid')
                    fieldValidationDiv.innerText = `${fieldName} is required`
                    validFields[fieldIdx] = false
                    _updateFormValidation()
                    return                
                }

                if (regex && !regex.test(field.value)) {
                    field.classList.add('is-invalid')
                    fieldValidationDiv.innerText = regexErrMsg
                    validFields[fieldIdx] = false
                    _updateFormValidation()
                    return
                }

                field.classList.remove('is-invalid')
                fieldValidationDiv.innerText = ""
                validFields[fieldIdx] = true
                _updateFormValidation()
                return
            })
        }
        return {"basicValidation": _validate, "customValidation": _customValidationWrapper}
    }
}