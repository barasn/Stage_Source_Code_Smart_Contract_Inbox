const assert = require('assert');
const ganache = require('ganache-cli');
const ethereumJs = require('web3');
const provider = ganache.provider();

const demo = require('../compile');
const web3 = new ethereumJs(provider);
//const web3 = new ethereumJs('http://localhost:8545');


const InboxInterface = JSON.parse(demo.interface);
const InboxBytecode = demo.bytecode;

let accounts;
let inbox;

beforeEach(async () => {
  //Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(InboxInterface)
    .deploy( {data: InboxBytecode, arguments: ['Hi bara']})
    .send( {from: accounts[0], gas: '1000000'});

    //
    inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message',  async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Hi bara');
  });
  it('Can change the message', async () => {
    await inbox.methods.setMessage('Naka ga deff').send({from: accounts[0]});
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Naka ga deff');
    console.log(message);
  });
});
