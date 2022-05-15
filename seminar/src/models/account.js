const mongoose = require("mongoose");

const OSchemaDefinition = {
    
    _username: {
        type: String,
        default: "",
        unique: true
    },
    
    _password: {
        type: String,
        default: ""
    },

    account: {
        type: Number,
        default: 0
    }
};

const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const AccountModel = mongoose.model("account", schema);

module.exports = AccountModel;

