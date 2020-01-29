import { LionFieldset } from '@lion/fieldset';

/**
 * LionRadioGroup: extends the lion-fieldset
 *
 * <lion-radio-group name="radios">
 *   <label slot="label">My Radio</label>
 *   <lion-radio>
 *     <label slot="label">Male</label>
 *   </lion-radio>
 *   <lion-radio>
 *     <label slot="label">Female</label>
 *   </lion-radio>
 * </lion-radio-group>
 *
 * You can preselect an option by setting marking an lion-radio checked.
 *   Example:
 *   <lion-radio checked></lion-radio>
 *
 * It extends LionFieldset so it inherits it's features.
 *
 *
 * @customElement lion-radio-group
 * @extends {LionFieldset}
 */

export class LionRadioGroup extends LionFieldset {
  get modelValue() {
    const el = this._getCheckedRadioElement();
    return el ? el.modelValue.value : '';
  }

  set modelValue(value) {
    this._setCheckedRadioElement(value, (el, val) => el.modelValue.value === val);
  }

  get serializedValue() {
    const el = this._getCheckedRadioElement();
    return el ? el.serializedValue : '';
  }

  set serializedValue(value) {
    this._setCheckedRadioElement(value, (el, val) => el.serializedValue === val);
  }

  get formattedValue() {
    const el = this._getCheckedRadioElement();
    return el ? el.formattedValue : '';
  }

  set formattedValue(value) {
    this._setCheckedRadioElement(value, (el, val) => el.formattedValue === val);
  }

  addFormElement(child) {
    if (
      typeof child.modelValue.checked !== 'boolean' ||
      !Object.prototype.hasOwnProperty.call(child.modelValue, 'value')
    ) {
      throw new Error(
        `The lion-radio-group name="${
          this.name
        }" does not allow to register ${child.tagName.toLowerCase()} with .modelValue="${
          child.modelValue
        }" - The modelValue should represent a type radio with { value: "foo", checked: false }`,
      );
    }
    this.__delegateNameAttribute(child);
    super.addFormElement(child);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('model-value-changed', this._checkRadioElements);
    this._setRole('radiogroup');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('model-value-changed', this._checkRadioElements);
  }

  _checkRadioElements(ev) {
    const { target } = ev;
    if (target.type !== 'radio' || target.checked === false) return;

    const groupName = target.name;
    this.formElementsArray
      .filter(i => i.name === groupName)
      .forEach(radio => {
        if (radio !== target) {
          radio.checked = false; // eslint-disable-line no-param-reassign
        }
      });
    this.__triggerCheckedValueChanged();
  }

  _getCheckedRadioElement() {
    const filtered = this.formElementsArray.filter(el => el.checked === true);
    return filtered.length > 0 ? filtered[0] : undefined;
  }

  async _setCheckedRadioElement(value, check) {
    if (!this.__readyForRegistration) {
      await this.registrationReady;
    }

    for (let i = 0; i < this.formElementsArray.length; i += 1) {
      if (check(this.formElementsArray[i], value)) {
        this.formElementsArray[i].checked = true;
        return;
      }
    }
  }

  _onFocusOut() {
    this.touched = true;
    this.focused = false;
  }

  __triggerCheckedValueChanged() {
    const value = this.modelValue;
    if (value != null && value !== this.__previousCheckedValue) {
      this.touched = true;
      this.__previousCheckedValue = value;
    }
  }

  _isEmpty() {
    const value = this.modelValue;
    if (typeof value === 'string' && value === '') {
      return true;
    }
    if (value === undefined || value === null) {
      return true;
    }
    return false;
  }

  /**
   * @override from LionFieldset
   */
  // eslint-disable-next-line class-methods-use-this
  get _childrenMayHaveSameName() {
    return true;
  }

  /**
   * @override from LionFieldset
   */
  // eslint-disable-next-line class-methods-use-this
  get _childNamesMayBeDuplicate() {
    return true;
  }

  __delegateNameAttribute(child) {
    if (!child.name || child.name === this.name) {
      // eslint-disable-next-line no-param-reassign
      child.name = this.name;
    } else {
      throw new Error(
        `The lion-radio-group name="${
          this.name
        }" does not allow to register ${child.tagName.toLowerCase()} with custom names (name="${
          child.name
        }" given)`,
      );
    }
  }
}
