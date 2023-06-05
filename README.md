# Telegram Wallet Bot

Telegram Wallet Bot is a Telegram bot that allows users to interact with an Ethereum wallet. It provides features such as checking wallet balance, sending Ether to another address, importing wallets using private keys, and more.
Supported network are, Ether mainnet, sepolia, goerli, BSC, Matic, 

## Setup

To set up the Telegram Wallet Bot, follow these steps:

1. Install the required packages:
   ```
   npm install node-telegram-bot-api web3 dotenv
   ```

2. Create a Telegram bot and obtain an API token. Refer to the Telegram Bot API documentation for more details.

3. Create a new file named `.env` in the project directory and add the following environment variables:
   ```
   TELEGRAM_BOT_TOKEN=<your-telegram-bot-token>
   ETHEREUM_NETWORK_PROVIDER=<ethereum-network-provider-url>
   SEPOLIA_NETWORK_PROVIDER=<sepolia-network-provider-url>
   BSC_NETWORK_PROVIDER=<bsc-network-provider-url>
   MATIC_NETWORK_PROVIDER=<matic-network-provider-url>
   GOERLI_NETWORK_PROVIDER=<goerli-network-provider-url>
   ```

## Usage

1. Start the bot by running the following command:
   ```
   node <your-file-name>.js
   ```

2. Interact with the bot in a Telegram chat:
   - Use the `/start` command to begin the wallet interaction.
   - Select a network provider by typing the corresponding number.
   - Use the `/balance` command to check the wallet balance.
   - Use the `/send` command to send Ether to another address.
   - Use the `/import` command to import a wallet using a private key.
   - Use the `/delete` command to delete the imported wallet.
   - Use the `/help` command to view available commands.

## Dependencies

The Telegram Wallet Bot has the following dependencies:

- [node-telegram-bot-api](https://www.npmjs.com/package/node-telegram-bot-api): A library for interacting with the Telegram Bot API.
- [web3](https://www.npmjs.com/package/web3): A library for interacting with the Ethereum network.
- [dotenv](https://www.npmjs.com/package/dotenv): A module for loading environment variables from a .env file.

## License

This project is licensed under the [MIT License](LICENSE).
