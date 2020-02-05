export const ChoiceGroupMixin = superclass =>
  // eslint-disable-next-line
  class ChoiceGroupMixin extends superclass {
    get modelValue() {
      const elems = this._getCheckedElements();
      if (this.multipleChoice) {
        return elems.map(el => el.modelValue.value);
      }
      return elems ? elems.modelValue.value : '';
    }

    set modelValue(value) {
      this._setCheckedElements(value, (el, val) => el.modelValue.value === val);
    }

    get serializedValue() {
      const elems = this._getCheckedElements();
      if (this.multipleChoice) {
        return this.modelValue;
      }
      return elems ? elems.serializedValue : '';
    }

    set serializedValue(value) {
      this._setCheckedElements(value, (el, val) => el.serializedValue === val);
    }

    constructor() {
      super();
      this.multipleChoice = false;
    }

    connectedCallback() {
      super.connectedCallback();
      if (!this.multipleChoice) {
        this.addEventListener('model-value-changed', this._checkSingleChoiceElements);
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      if (!this.multipleChoice) {
        this.removeEventListener('model-value-changed', this._checkSingleChoiceElements);
      }
    }

    /**
     * @override from FormRegistrarMixin
     */
    addFormElement(child) {
      this._throwWhenInvalidChildModelValue(child);
      this.__delegateNameAttribute(child);
      super.addFormElement(child);
    }

    /**
     * @override from LionFieldset
     */
    // eslint-disable-next-line class-methods-use-this
    get _childrenCanHaveSameName() {
      return true;
    }

    /**
     * @override from LionFieldset
     */
    // eslint-disable-next-line class-methods-use-this
    get _childNamesCanBeDuplicate() {
      return true;
    }

    _throwWhenInvalidChildModelValue(child) {
      if (
        typeof child.modelValue.checked !== 'boolean' ||
        !Object.prototype.hasOwnProperty.call(child.modelValue, 'value')
      ) {
        throw new Error(
          `The ${this.tagName.toLowerCase()} name="${
            this.name
          }" does not allow to register ${child.tagName.toLowerCase()} with .modelValue="${
            child.modelValue
          }" - The modelValue should represent an Object { value: "foo", checked: false }`,
        );
      }
    }

    _isEmpty() {
      const value = this.modelValue;
      if (this.multipleChoice) {
        return this.modelValue.length === 0;
      }

      if (typeof value === 'string' && value === '') {
        return true;
      }
      if (value === undefined || value === null) {
        return true;
      }
      return false;
    }

    _checkSingleChoiceElements(ev) {
      const { target } = ev;
      if (target.checked === false) return;

      const groupName = target.name;
      this.formElementsArray
        .filter(i => i.name === groupName)
        .forEach(choice => {
          if (choice !== target) {
            choice.checked = false; // eslint-disable-line no-param-reassign
          }
        });
      this.__triggerCheckedValueChanged();
    }

    _getCheckedElements() {
      const filtered = this.formElementsArray.filter(el => el.checked === true);

      if (this.multipleChoice) {
        return filtered;
      }
      return filtered.length > 0 ? filtered[0] : undefined;
    }

    async _setCheckedElements(value, check) {
      if (!this.__readyForRegistration) {
        await this.registrationReady;
      }

      for (let i = 0; i < this.formElementsArray.length; i += 1) {
        let currentElIsCheckedEl = false;
        if (this.multipleChoice) {
          currentElIsCheckedEl = value.includes(this.formElementsArray[i].value);
        } else {
          // Allows checking against custom values e.g. formattedValue or serializedValue
          currentElIsCheckedEl = check(this.formElementsArray[i], value);
        }

        if (currentElIsCheckedEl) {
          this.formElementsArray[i].checked = true;
          if (!this.multipleChoice) {
            return;
          }
        }
      }
    }

    __triggerCheckedValueChanged() {
      const value = this.modelValue;
      if (value != null && value !== this.__previousCheckedValue) {
        this.touched = true;
        this.__previousCheckedValue = value;
      }
    }

    __delegateNameAttribute(child) {
      if (!child.name || child.name === this.name) {
        // eslint-disable-next-line no-param-reassign
        child.name = this.name;
      } else {
        throw new Error(
          `The ${this.tagName.toLowerCase()} name="${
            this.name
          }" does not allow to register ${child.tagName.toLowerCase()} with custom names (name="${
            child.name
          }" given)`,
        );
      }
    }
  };
