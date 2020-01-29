import { LionFieldset } from '@lion/fieldset';

export class LionCheckboxGroup extends LionFieldset {
  addFormElement(child) {
    this.__delegateNameAttribute(child);
    super.addFormElement(child);
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
    if (child.tagName === 'LION-CHECKBOX' && (!child.name || child.name === this.name)) {
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
  _isEmpty(modelValues) {
    const keys = Object.keys(modelValues);
    for (let i = 0; i < keys.length; i += 1) {
      const modelValue = modelValues[keys[i]];
      if (Array.isArray(modelValue)) {
        // grouped via myName[]
        return !modelValue.some(node => node.checked);
      }
      return !modelValue.checked;
    }
    return true;
  }
}
