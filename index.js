const TelegramBot = require('node-telegram-bot-api');
const Web3 = require('web3');
const dotenv = require('dotenv');

dotenv.config();

// Load environment variables
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const ethereumProvider = process.env.ETHEREUM_NETWORK_PROVIDER;
const sepoliaProvider = process.env.SEPOLIA_NETWORK_PROVIDER;
const bscProvider = process.env.BSC_NETWORK_PROVIDER;
const maticProvider = process.env.MATIC_NETWORK_PROVIDER;
const goerliProvider = process.env.GOERLI_NETWORK_PROVIDER;

// Set up Telegram bot
const bot = new TelegramBot(botToken, { polling: true });

// Set up Ethereum network providers
const sepoliaWeb3 = new Web3(sepoliaProvider);
const ethereumWeb3 = new Web3(ethereumProvider);
const bscWeb3 = new Web3(bscProvider);
const maticWeb3 = new Web3(maticProvider);
const goerliWeb3 = new Web3(goerliProvider);

// Map to store user wallet address
const userWallets = new Map();

// Start listening to incoming messages and commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  if (!userWallets.has(chatId)) {
    bot.sendMessage(chatId, 'Welcome to the Ethereum wallet bot!');
    bot.sendMessage(chatId, 'Please select a network provider:\n' +
      '1. Sepolia\n' +
      '2. Ethereum Mainnet\n' +
      '3. BSC\n' +
      '4. Matic\n' +
      '5. Goerli\n\n' +
      'Type the corresponding number to select a network provider.'
    );
  } else {
    bot.sendMessage(chatId, 'You have already imported your private key. You can now use other commands. Type /help to see the available commands.');
  }
});

// Handle user selection for network provider
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const providerSelection = msg.text.trim();

  switch (providerSelection) {
    case '1':
      web3 = sepoliaWeb3;
      bot.sendMessage(chatId, 'You have selected Sepolia network provider.');
      break;
    case '2':
      web3 = ethereumWeb3;
      bot.sendMessage(chatId, 'You have selected Ethereum Mainnet network provider.');
      break;
    case '3':
      web3 = bscWeb3;
      bot.sendMessage(chatId, 'You have selected BSC network provider.');
      break;
    case '4':
      web3 = maticWeb3;
      bot.sendMessage(chatId, 'You have selected Matic network provider.');
      break;
    case '5':
      web3 = goerliWeb3;
      bot.sendMessage(chatId, 'You have selected Goerli network provider.');
      break;
    default:
      bot.sendMessage(chatId, 'Invalid selection. Please type the corresponding number to select a network provider.');
      break;
  }
});

bot.onText(/\/balance/, async (msg) => {
  const chatId = msg.chat.id;
  const walletAddress = userWallets.get(chatId);

  if (walletAddress) {
    try {
      const balance = await web3.eth.getBalance(walletAddress);
      bot.sendMessage(chatId, `Your wallet balance is: ${web3.utils.fromWei(balance)} ETH `);
    } catch (error) {
      bot.sendMessage(chatId, 'Failed to retrieve wallet balance.');
    }
  } else {
    bot.sendMessage(chatId, 'Please import your private key using the /import command first.');
  }
});

bot.onText(/\/send/, (msg) => {
  const chatId = msg.chat.id;
  const walletAddress = userWallets.get(chatId);

  if (walletAddress) {
    bot.sendMessage(chatId, 'Please enter the recipient address:');
    bot.once('message', async (recipientAddressMsg) => {
      const recipientAddress = recipientAddressMsg.text.trim();

      if (!web3.utils.isAddress(recipientAddress)) {
        bot.sendMessage(chatId, 'Invalid recipient address format. Please make sure to enter a valid Ethereum address. use /send command again');
        return;
      }

      bot.sendMessage(chatId, 'Please enter the amount to send (in Ether):');
      bot.once('message', async (amountMsg) => {
        const amount = amountMsg.text.trim();

        try {
          const nonce = await web3.eth.getTransactionCount(walletAddress);
          const gasPrice = await web3.eth.getGasPrice();

          const txParams = {
            nonce: web3.utils.toHex(nonce),
            to: recipientAddress,
            value: web3.utils.toHex(web3.utils.toWei(amount)),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(gasPrice),
          };

          const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
          const signedTx = await wallet.signTransaction(txParams);
          const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
          bot.sendMessage(chatId, `Transaction sent. Transaction hash: ${txHash}`);
        } catch (error) {
          bot.sendMessage(chatId, 'Failed to send transaction.');
        }
      });
    });
  } else {
    bot.sendMessage(chatId, 'Please import your private key using the /import command first.');
  }
});

bot.onText(/\/delete/, (msg) => {
  const chatId = msg.chat.id;

  if (userWallets.has(chatId)) {
    userWallets.delete(chatId);
    bot.sendMessage(chatId, 'Your imported wallet has been deleted. You can now import a new wallet using the /import command.');
  } else {
    bot.sendMessage(chatId, 'No wallet is currently imported. Please import your private key using the /import command first.');
  }
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = 'Available commands:\n' +
    '/start - Start using the wallet bot\n' +
    '/balance - Check wallet balance\n' +
    '/send - Send Ether to another address\n' +
    '/delete - Delete the imported wallet\n' +
    '/import - Import wallet using private key\n' +
    '/help - View available commands';
  bot.sendMessage(chatId, helpMessage);
});

bot.onText(/\/import/, (msg) => {
  const chatId = msg.chat.id;

  if (!userWallets.has(chatId)) {
    bot.sendMessage(chatId, 'Please enter your private key:');
    bot.once('message', (privateKeyMsg) => {
      const privateKey = privateKeyMsg.text.trim();

      try {
        const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
        const walletAddress = wallet.address;

        // Store wallet address for later use
        userWallets.set(chatId, walletAddress);

        bot.sendMessage(chatId, `Private key imported successfully. Your wallet address is: ${walletAddress} \n Now you can check your /balance or /send`);
      } catch (error) {
        bot.sendMessage(chatId, 'Invalid private key. Please make sure your private key is 32 bytes long.');
      }
    });
  } else {
    bot.sendMessage(chatId, 'You have already imported your private key. You can now use other commands. Type /help to see the available commands.');
  }
});

// Start the bot
bot.on('polling_error', (error) => {
  console.error(error);
});

// Log that the bot has started running
console.log('Bot started running...');
