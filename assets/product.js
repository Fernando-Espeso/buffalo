class ProductVariants extends HTMLElement {
  constructor() {
    super()
    this.section = this.closest('[data-product-section]')
    this.productForm = this.section.querySelector('form')
    if (!this.productForm) {
      throw new Error('Product form not found')
      return
    }
    this.querySelectorAll('input').forEach((input) => {
      input.addEventListener('change', this.onVariantChange.bind(this))
    })

    this.onVariantChange(false)
  }

  onVariantChange(event) {
    this.updateOptions()
    this.updateMasterId()
    this.updateAddToCartButton()
    this.removeErrorMessage()
    this.updateURL()
    this.updateVariantInput()
    if (event) this.renderProductInfo()
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'))
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked)?.value
    })

    this.querySelectorAll('input:not(checked)').forEach((radio) => {
      const elementoToDeselect = radio.parentElement
      if (elementoToDeselect) {
        elementoToDeselect.removeAttribute('open')
      }
    })
    this.querySelectorAll('input:checked').forEach((radio) => {
      const elementoToSelect = radio.parentElement
      if (elementoToSelect) {
        elementoToSelect.setAttribute('open', 'true')
      }
    })
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option
        })
        .includes(false)
    })

    // console.log('variants', this.getVariantData())
    // console.log('current', this.currentVariant)
  }

  updateURL() {
    if (!this.currentVariant) return
    window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`)
  }

  updateVariantInput() {
    const input = this.productForm.querySelector('input[name="id"]')
    if (!this.currentVariant) return
    input.value = this.currentVariant.id
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }

  removeErrorMessage() {
    // TODO
  }

  updateAddToCartButton() {
    const addButton = this.productForm.querySelector('[data-add-to-cart]')
    const addButtonText = this.productForm.querySelector('[data-add-to-cart-text]')

    if (!addButton || !addButtonText) return

    if (!this.currentVariant) {
      addButton.setAttribute('disabled', 'disabled')
      addButtonText.textContent = 'UNAVAILABLE'
    }

    if (!this.currentVariant.available) {
      addButton.setAttribute('disabled', 'disabled')
      addButtonText.textContent = 'SOLD OUT'
    } else {
      addButton.removeAttribute('disabled')
      addButtonText.textContent = 'ADD TO BAG'
    }
  }

  getSectionsToRender() {
    return [
      {
        id: '[data-add-to-cart]',
        section: this.section.dataset.sectionId,
        selector: '[data-add-to-cart]',
        attributes: true,
      },
    ]
  }

  renderProductInfo() {
    let url = window.location.href
    if (url.indexOf('?') !== -1) {
      url += '&'
    } else {
      url += '?'
    }
    url += `section_id=${this.section.dataset.sectionId}`

    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        this.render(this.getSectionsToRender(), html)
      })
      .catch((e) => {
        console.error(e)
      })
  }

  render(sectionsToRender, state) {
    sectionsToRender.forEach((section) => {
      const elementToReplace = document.querySelector(section.id)

      if (elementToReplace) {
        const html = state.sections
          ? state.sections[section.section]
          : state[section.section]
            ? state[section.section]
            : state

        const newElement = new DOMParser().parseFromString(html, 'text/html').querySelector(section.selector)

        if (newElement) {
          elementToReplace.innerHTML = newElement.innerHTML

          if (section.selector === section.id || section.attributes) {
            const numberAttributesElementToReplace = elementToReplace.attributes.length
            for (let i = 0; i < numberAttributesElementToReplace; i++) {
              const attribute = elementToReplace.attributes[0]
              if (attribute) elementToReplace.removeAttribute(attribute.name)
            }
            for (let i = 0; i < newElement.attributes.length; i++) {
              const attribute = newElement.attributes[i]
              if (attribute) elementToReplace.setAttribute(attribute.name, attribute.value)
            }
          }
        }
      }
    })
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent)
    return this.variantData
  }
}
customElements.define('product-variants', ProductVariants)
