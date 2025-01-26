# Gasless Transaction Forwarder

This project implements a Gasless Transaction Forwarder that allows users to send ERC-20 and ERC-721 transactions without holding ETH. It includes a Solidity smart contract and a simple frontend interface to interact with it.
## Features

1.  Forwarder Smart Contract:
    - Accepts user transactions and forwards them on-chain.
    - Supports ERC-20 and ERC-721 tokens.
    - Validates user signatures for security.

2. Frontend Interface:
    - Simple UI for entering transaction details and sending gasless transfers.
    - Displays transaction status.

3. Local Blockchain:
    - Uses Ganache for testing on a local blockchain environment.

## Prerequisites

Make sure you have the following installed:

- Node.js (v16 or higher)
- Ganache
- Hardhat

## Installation

### Install Dependencies:

Install both frontend and contract dependencies from npm install in both directories.

```bash
npm install
```

### Start Ganache:

Open Ganache and create a new workspace.
Use the default RPC URL: http://127.0.0.1:7545.

### Compile the Smart Contract:

```bash
npx hardhat compile
```

### Deploy the Contract: 
Deploy the smart contract to the local Ganache blockchain:

```bash 
npx hardhat run scripts/deploy.js --network localhost
```

Note the deployed contract address from the terminal output.

### Start the Frontend:

Go to the frontend directory:

```bash 
npm start
```
The frontend should load at http://localhost:3000.

## Usage
### Sending a Gasless Transaction

1. Obtain the Deployed Contract Address:
2. Copy the deployed contract address from the terminal.

3. Interact with the Frontend:
    ```Enter the following details in the frontend:
        From: Sender's address (Ganache test account).
        To: Receiver's address.
        Token Address: Address of the ERC-20 or ERC-721 token.
        Amount/Token ID: Amount to transfer (for ERC-20) or token ID (for ERC-721).
        Signature: Sign the transaction using your private key (the UI or backend should help you generate the signature).
    Click "Submit".

4. Verify the Transaction:
    - Use Ganache or a block explorer (like Hardhat's console) to verify the transaction has been forwarded successfully.
