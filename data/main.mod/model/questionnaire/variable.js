var ParentVariable = require("../variable").Variable;

/**
 * @class Variable
 * @extends ParentVariable
 */

/*
    TODO: Add variables
*/

exports.Variable = ParentVariable.specialize(/** @lends Variable.prototype */ {
    constructor: {
        value: function Variable() {
            this.super();
            return this;
        }
    },

    questionnaires: {
        value: undefined
    },
    questions: {
        value: undefined
    },
    respondentQuestionnaireVariableValuess: {
        value: undefined
    }
});
