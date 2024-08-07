/**
 * @module ui/number-input.reel
 */
var AbstractNumberField = require("mod/ui/base/abstract-number-field").AbstractNumberField;

/**
 * @class NumberInput
 * @extends Component
 */
exports.NumberInput = AbstractNumberField.specialize({
    handleInputAction: {
        value: function () {
            this._numberFieldTextFieldComponent.element.blur();
        }
    }
});
