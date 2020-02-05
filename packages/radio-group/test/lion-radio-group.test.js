import '@lion/radio/lion-radio.js';
import { expect, fixture, html, nextFrame } from '@open-wc/testing';
import '../lion-radio-group.js';

describe('<lion-radio-group>', () => {
  it('should have role = radiogroup', async () => {
    const el = await fixture(html`
      <lion-radio-group label="Gender" name="gender">
        <lion-radio label="male" value="male"></lion-radio>
        <lion-radio label="female" value="female" checked></lion-radio>
      </lion-radio-group>
    `);
    await nextFrame();
    expect(el.getAttribute('role')).to.equal('radiogroup');
  });

  it(`becomes "touched" once a single element of the group changes`, async () => {
    const el = await fixture(html`
      <lion-radio-group name="myGroup">
        <lion-radio></lion-radio>
        <lion-radio></lion-radio>
      </lion-radio-group>
    `);
    await nextFrame();

    el.children[1].focus();
    expect(el.touched).to.equal(false, 'initially, touched state is false');
    el.children[1].checked = true;
    expect(el.touched, `focused via a mouse click, group should be touched`).to.be.true;
  });

  it('allows selection of only one radio in a named group', async () => {
    const el = await fixture(html`
      <lion-radio-group name="gender">
        <lion-radio .modelValue="${{ value: 'male', checked: false }}"></lion-radio>
        <lion-radio .modelValue="${{ value: 'female', checked: false }}"></lion-radio>
      </lion-radio-group>
    `);
    await nextFrame();
    const male = el.formElementsArray[0];
    const maleInput = male.querySelector('input');
    const female = el.formElementsArray[1];
    const femaleInput = female.querySelector('input');

    expect(male.checked).to.equal(false);
    expect(female.checked).to.equal(false);

    maleInput.focus();
    maleInput.click();
    expect(male.checked).to.equal(true);
    expect(female.checked).to.equal(false);

    femaleInput.focus();
    femaleInput.click();
    expect(male.checked).to.equal(false);
    expect(female.checked).to.equal(true);
  });

  it('is accessible', async () => {
    const el = await fixture(html`
      <lion-radio-group label="My group" name="gender">
        <lion-radio label="male" value="male"></lion-radio>
        <lion-radio label="female" value="female" checked></lion-radio>
      </lion-radio-group>
    `);
    await nextFrame();
    await expect(el).to.be.accessible();
  });

  it('is accessible when the group is disabled', async () => {
    const el = await fixture(html`
      <lion-radio-group label="My group" name="gender" disabled>
        <lion-radio label="male" value="male"></lion-radio>
        <lion-radio label="female" value="female" checked></lion-radio>
      </lion-radio-group>
    `);
    await nextFrame();
    await expect(el).to.be.accessible();
  });

  it('is accessible when an option is disabled', async () => {
    const el = await fixture(html`
      <lion-radio-group label="My group" name="gender">
        <lion-radio label="male" value="male" disabled></lion-radio>
        <lion-radio label="female" value="female" checked></lion-radio>
      </lion-radio-group>
    `);
    await nextFrame();
    await expect(el).to.be.accessible();
  });
});
