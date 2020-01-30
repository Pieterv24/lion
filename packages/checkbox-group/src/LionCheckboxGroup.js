import { LionFieldset } from '@lion/fieldset';

export class LionCheckboxGroup extends LionFieldset {
  get modelValue() {
    const elems = this._getCheckedCheckboxElements();
    return elems.map(el => el.modelValue.value);
  }

  set modelValue(value) {
    this._setCheckedCheckboxElements(value);
  }

  addFormElement(child) {
    if (
      typeof child.modelValue.checked !== 'boolean' ||
      !Object.prototype.hasOwnProperty.call(child.modelValue, 'value')
    ) {
      throw new Error(
        `The lion-checkbox-group name="${
          this.name
        }" does not allow to register ${child.tagName.toLowerCase()} with .modelValue="${
          child.modelValue
        }" - The modelValue should represent a type checkbox with { value: "foo", checked: false }`,
      );
    }
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

  _getCheckedCheckboxElements() {
    return this.formElementsArray.filter(el => el.checked === true);
  }

  async _setCheckedCheckboxElements(values) {
    if (!this.__readyForRegistration) {
      await this.registrationReady;
    }

    for (let i = 0; i < this.formElementsArray.length; i += 1) {
      if (values.includes(this.formElementsArray[i].value)) {
        this.formElementsArray[i].checked = true;
      }
    }
  }

  __delegateNameAttribute(child) {
    if (!child.name || child.name === this.name) {
      // eslint-disable-next-line no-param-reassign
      child.name = this.name;
    } else {
      throw new Error(
        `The lion-checkbox-group name="${
          this.name
        }" does not allow to register ${child.tagName.toLowerCase()} with custom names (name="${
          child.name
        }" given)`,
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _isEmpty() {
    return this.modelValue.length === 0;
  }
}
