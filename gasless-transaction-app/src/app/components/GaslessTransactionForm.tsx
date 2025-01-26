'use client';
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { ForwarderService, TransactionType } from './forwarderService';
import styles from './GaslessTransactionForm.module.css';

const ForwarderContractABI: any[] = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "ECDSAInvalidSignature",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "length",
          "type": "uint256"
        }
      ],
      "name": "ECDSAInvalidSignatureLength",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "ECDSAInvalidSignatureS",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "tokenContract",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum GaslessTransactionForwarder.TransactionType",
          "name": "txType",
          "type": "uint8"
        }
      ],
      "name": "GaslessTransactionExecuted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "DOMAIN_SEPARATOR",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "tokenContract",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            },
            {
              "internalType": "enum GaslessTransactionForwarder.TransactionType",
              "name": "transactionType",
              "type": "uint8"
            }
          ],
          "internalType": "struct GaslessTransactionForwarder.ForwardRequest",
          "name": "req",
          "type": "tuple"
        }
      ],
      "name": "executeGaslessERC20Transfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "tokenContract",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nonce",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "signature",
              "type": "bytes"
            },
            {
              "internalType": "enum GaslessTransactionForwarder.TransactionType",
              "name": "transactionType",
              "type": "uint8"
            }
          ],
          "internalType": "struct GaslessTransactionForwarder.ForwardRequest",
          "name": "req",
          "type": "tuple"
        }
      ],
      "name": "executeGaslessERC721Transfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getNonce",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "recoverERC20",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenContract",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "recoverERC721",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "usedNonces",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

export const GaslessTransactionForm: React.FC = () => {
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.ERC20_TRANSFER);
  const [tokenContract, setTokenContract] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Initialize the provider with Ethers v6
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request user account access
      await provider.send('eth_requestAccounts', []);

      // Get signer
      const signer = await provider.getSigner();

      // Initialize ForwarderService with the provider and signer
    //   console.log("envvvvvv");
    //   console.log(process.env.REACT_APP_FORWARDER_CONTRACT_ADDRESS);
      const forwarderService = new ForwarderService(
        "0xF792403E95C2F4A22f46e258d93D8E19A04e8c12",
        ForwarderContractABI,
        provider,
      );

      // Create and send gasless transaction
      await forwarderService.initialize();
      const result = await forwarderService.createGaslessTransaction(
        transactionType,
        tokenContract,
        recipient,
        amount,
        transactionType === TransactionType.ERC721_TRANSFER ? tokenId : undefined
      );

      console.log('Transaction submitted:', result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="transactionType" className={styles.label}>Transaction Type</label>
      <select
        id="transactionType"
        className={styles.select}
        value={transactionType}
        onChange={(e) => setTransactionType(e.target.value as unknown as TransactionType)}
      >
        <option value={TransactionType.ERC20_TRANSFER}>ERC20 Transfer</option>
        <option value={TransactionType.ERC721_TRANSFER}>ERC721 Transfer</option>
      </select>

      <label htmlFor="tokenContract" className={styles.label}>Token Contract Address</label>
      <input
        id="tokenContract"
        className={styles.input}
        type="text"
        placeholder="Token Contract Address"
        value={tokenContract}
        onChange={(e) => setTokenContract(e.target.value)}
        required
      />

      <label htmlFor="recipient" className={styles.label}>Recipient Address</label>
      <input
        id="recipient"
        className={styles.input}
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        required
      />

      {transactionType === TransactionType.ERC20_TRANSFER ? (
        <>
          <label htmlFor="amount" className={styles.label}>Amount</label>
          <input
            id="amount"
            className={styles.input}
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </>
      ) : (
        <>
          <label htmlFor="tokenId" className={styles.label}>Token ID</label>
          <input
            id="tokenId"
            className={styles.input}
            type="text"
            placeholder="Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            required
          />
        </>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.button}>Submit Gasless Transaction</button>
    </form>
  );
};
