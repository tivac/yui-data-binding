extension-data-binding
======================

Simple extension to provide one/two-way data-binding for YUI Views.

## Examples

    <input type="text" data-bound="value:text" />

Changes to this `value` of this input will update the `text` attribute on the View, and changes to the `text` attribute on the View will be reflected in the inputs `value`.

    <p data-bound="text:body"></p>
Changes to the `body` attribute on the View will be set as the `innerText` of this `p`.

    <div data-bound="html:child"></div>
Changes to the `child` attribute of the View will be reflected in the `innerHTML` of this `div`.

    <input type="text" data-bound="value:text;class:status" />
You can specify multiple bindings by separating them with `;`.

Don't want to set the attributes on the view? Use `this.bindingSource()` to change it.
    