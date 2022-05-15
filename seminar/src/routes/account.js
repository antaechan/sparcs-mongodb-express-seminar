const express = require('express');
const { Model } = require('mongoose');
const authMiddleware = require('../middleware/auth');
const AccountModel = require("../models/account");

const router = express.Router();

class BankDB {
    static _inst_;
    static getInst = () => {
        if ( !BankDB._inst_ ) BankDB._inst_ = new BankDB();
        return BankDB._inst_;
    }

    constructor() { console.log("[Bank-DB] DB Init Completed"); }

    getBalance = async (username, password) => {
        try {
            let document  = await AccountModel.findOne({_username: username, _password : password })
            return { success: true, data: document.account }
        } catch (e) {
            console.log(`[Bank-DB] getBalance Error: ${ e }`);
            return { success: false, data: `DB Error - ${ e }` };
        }
    }
    
    transaction = async ( username, password, amount ) => {
        try {
            let document = await AccountModel.findOne( { _username: username, _password : password } )
            await AccountModel.updateOne( 
                { _username: username, _password : password },
                { $set : {account: (parseInt(account_left) + amount)  } }
            )
            return { success: true, data: (account_left + amount) }
        } catch (e) {
            console.log(`[Bank-DB] transaction Error: ${ e }`);
            return { success: false, data: `DB Error - ${ e }` };
        }
    }
}

//I set unique attribute, 서버 2번 돌리면 mongodb에 ATC 두번 들어가서 crash 나고 있습니다.
const bankDBInst = BankDB.getInst();
Docu = new AccountModel({
    _username: "ATC",
    _password: "0000",
    account: 0
})
Docu.save();

router.post('/getInfo', authMiddleware, async (req, res) => {
    try {
        const { credential, password } = req.body;
        const { success, data } = await bankDBInst.getBalance(credential, password);
        if (success) return res.status(200).json({ balance: data });
        else return res.status(500).json({ error: data });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/transaction', authMiddleware, async (req, res) => {
    try {
        const { credential, password, amount } = req.body;
        const { success, data } = await bankDBInst.transaction( credential, password, parseInt(amount) );
        if (success) res.status(200).json({ success: true, balance: data, msg: "Transaction success" });
        else res.status(500).json({ error: data })
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

module.exports = router;