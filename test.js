var test = require('test');
test.setup();

var index = require("./index");
var Wallet = index.Wallet;
var Tx = index.Tx;

describe('fib-ethereum-wallet', function() {
	var account,
		address,
		privateKey,
		publicKey,
		keystore1,
		keystore2;

	it("签名", function() {
		/* 
			详细看看gasPrice以及gasLimit以及value的作用，方能成功
		 */
		var txParams = {
			nonce: 0, //每个地址单独的，防重放：'0x0'
			gasPrice: 0.000000028, //单位是eth,需要传成16进制的wei
			gasLimit: 90000, //需要转成16进制的工
			from: "0xd169860229b152750981fd1bd8a30cea3a201fa0",
			to: "0xc4bc0d6776f9b6ab553f2d33c18615ecbe4db1e3",
			value: 0.001, //单位是eth,需要转成16进制的wei
			chainId: 3 //mainNet 1 testNet 3（网络）
		}

		var pkey = '0x5ec4df327becc55e27f2efa74afe94dd12c12d7dd9b370c29c7b544108d02e24';
		var signData = Tx(pkey, txParams);
		console.warn(signData);
	});

	it("新建一个钱包", function() {
		//0xda6da58eeb291aebccdb03d2660a0428e84c78f3
		account = new Wallet();
		address = account.getAddressString();
		assert.ok(address.indexOf('0x') !== -1);
	});

	it("获取私钥", function() {
		//0xdc7cf1bb6d0ed81bdb0517423d872e6d84c6b5ab4bf2c199dca8db09dfeb2e8a
		privateKey = account.getPrivateKeyString();
		assert.ok(privateKey.indexOf('0x') !== -1);
	});

	it("获取公钥", function() {
		//0xc66c834081c6219e605237af2bc36b394bcf2c691333d0c06dc5db3cd0bca67b7fad37d90e67a504e2a67b717a6c05248a62a18e39f3b88495a1219f1221d8f5
		publicKey = account.getPublicKeyString();
		assert.ok(publicKey.indexOf("0x" !== -1));
	});

	it("获取保存文件", function() {
		//UTC--2018-03-15T05-38-58.865Z--75987289b92bbea10a5b09d53a3089bf72911585
		var f1 = account.getV3Filename();
		assert.ok(f1.indexOf(address.substr(2)) !== -1);

		//多次获取名字效果,随着时间变化

		var f2 = account.getV3Filename();
		assert.ok(f2.indexOf(address.substr(2)) !== -1);
		assert.notEqual(f1, f2);
	});

	it("输出keystore", function() {
		//2次输出keystore 不一致,时间太长了，需要优化
		// keystore1 = account.toV3("123456");
		// keystore2 = account.toV3("123456");
		// console.error(keystore1, keystore2, privateKey);
		// assert.notDeepEqual(keystore1, keystore2);
	});

	it("加载keystore", function() {
		var key1 = {
			"version": 3,
			"id": "459f9698-e23f-4338-88db-c4a37e393331",
			"address": "16f08992b5f3f01242c9839219814ea4d8de24c4",
			"crypto": {
				"ciphertext": "d0121766fd919e802b31dc07e8cb9e3e972022d09dcbbf7ea706c7160dfb456e",
				"cipherparams": {
					"iv": "37e686df4fe2d4cba300825592b89db8"
				},
				"cipher": "aes-128-ctr",
				"kdf": "scrypt",
				"kdfparams": {
					"dklen": 32,
					"salt": "49280fb48b81b59ce366e0aa218df9a87e65e80c2de7e1d50dc1cd3a403f601b",
					"n": 262144,
					"r": 8,
					"p": 1
				},
				"mac": "46b5a0f3170f05c75c2651a1a7b4379fe424cae26d6b11f74902c55eebd0ef2f"
			}
		};

		var key2 = {
			"version": 3,
			"id": "7ab7fcd7-5540-4e03-8ca3-68cad4be943c",
			"address": "16f08992b5f3f01242c9839219814ea4d8de24c4",
			"crypto": {
				"ciphertext": "fcf6c66b13474bd16905193a119689847a21fab34fe3fb1701b6d670b8fe1bf2",
				"cipherparams": {
					"iv": "a2004272f761316e2286da5965f393b6"
				},
				"cipher": "aes-128-ctr",
				"kdf": "scrypt",
				"kdfparams": {
					"dklen": 32,
					"salt": "e2f04f5deab93e5689232920e7a1edb1f34a7a8711763f66c5a71637503725e0",
					"n": 262144,
					"r": 8,
					"p": 1
				},
				"mac": "5442d499f0c1abc742cc6876da1f8c925e1594f6972d56181c7c0d839e528642"
			}
		};

		var pkey = '0x242f47e8ae00fe42b2ee4cc5d15a1e9f4fc4e2a72605debe7a09be37520bb5ea';

		/*错误的密码
			throw new Error('Key derivation failed - possibly wrong passphrase')
		*/
		assert.throws(function() {
			acount2 = new Wallet(JSON.stringify(key1), "654321");
		});

		//2次不同时间的keystore 加载出的私钥一致
		var acount2 = new Wallet(JSON.stringify(key1), "123456");
		console.warn("privateKey:", pkey);
		assert.equal(acount2.getPrivateKeyString(), pkey);

		var acount3 = new Wallet(JSON.stringify(key2), "123456");
		assert.equal(acount3.getPrivateKeyString(), pkey);
	});
});

test.run();