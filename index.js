const crypto = require("crypto");
global.crypto = {
	getRandomValues: crypto.randomBytes,
	randomBytes: crypto.randomBytes
}

const ethereumjsWallet = require("./lib/ethereumjs-wallet");

function Wallet(keystore, passphrase) {
	var account;
	if (!keystore) {
		account = ethereumjsWallet.Wallet.generate();
	} else {
		account = ethereumjsWallet.Wallet.fromV3(keystore, passphrase);
	}

	return account;
}

function Tx(privateKey, txParams) {
	/* 所有交易的参数是16进制
	var txParams = {
		nonce: 0, //每个地址单独的，防重放：'0x0'
		gasPrice: 0.000000028,//单位是eth,需要传成16进制的wei
		gasLimit: 90000,//需要转成16进制的工
		from: "0xd169860229b152750981fd1bd8a30cea3a201fa0",
		to: "0xc4bc0d6776f9b6ab553f2d33c18615ecbe4db1e3",
		value: 0.001,//单位是eth,需要转成16进制的wei
		chainId: 3 //mainNet 1 testNet 3（网络）
	}
	*/

	var r = ["nonce", "gasLimit", "gasPrice", "value"].every(function(k) {
		var v = txParams[k];
		return v && /^0x/.test(v);
	});

	if (!r) throw new Error("Tx txParams must be 0x(16)");

	var pKey = Buffer.from(privateKey.substr(2), 'hex')
	var tx = new ethereumjsWallet.Tx(txParams)
	tx.sign(pKey);
	var serializedTx = tx.serialize();
	return '0x' + serializedTx.toString("hex");
}

module.exports = {
	Wallet: Wallet,
	Tx: Tx
};