extension-data-binding
======================

Simple extension to provide one/two-way data-binding for YUI Views.

## Usage

Mix the extension into your `Y.View`s.

    var View = Y.Base.create(
            "view",
            Y.View,
            [ Y.Extensions.DataBinding ],
            { ... }
        );

All binding configuration comes from the `data-bound` element and follows a simple format.

    data-bound="<dom attribute>:<yui attribute>"
    data-bound="<dom>:<yui>;<dom>:<yui>"

The `<dom attribute>` can be any dom attribute like `class` and `style` or it can be one of a few special attributes.

- `text` will set the `innerText` of the element to the HTML-escaped value of the `<yui attribute>`.
- `html` will set the `innerHTML` of the element to the value of the `<yui attribute>`.
- `value` has some special behaviors/logic around it, but in general does what you'd expect. It'll set the `value` of the element to the value of the `<yui attribute>`.

Multiple bindings are separated with the `;` key, and there is no limit imposed beyond however many it'd take to crash/freeze the browser.

By default the views own attributes are used, but you can specify a different source for binding data by using  `this.bindingSource()`.

## Examples

    <input type="text" data-bound="value:text" />

Changes to the `value` of this input will update the `text` attribute on the View, and changes to the `text` attribute on the View will be reflected in the inputs `value`.

    <p data-bound="text:body"></p>
Changes to the `body` attribute on the View will be set as the `innerText` of this `p`.

    <div data-bound="html:child"></div>
Changes to the `child` attribute of the View will be reflected in the `innerHTML` of this `div`.

    <input type="text" data-bound="value:text;class:status" />
Changes to the `value` of this input will update the `text` attribute on the View, and changes to the `text` attribute on the View will be reflected in the inputs `value`. Changes to the `status` attribute on the View will be reflected in the `class` of the input.

## Caveats

This is never going to be a React/Angular level project. I want simple, straightforward two-way databinding without all the other flopping around. Working seamlessly within YUI is also important. You'll still have to be making good choices about when & how to use this, it won't prevent you from blowing off your feet.