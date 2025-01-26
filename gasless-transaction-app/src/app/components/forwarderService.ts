import { BrowserProvider, Contract, parseUnits, TypedDataDomain } from 'ethers';
const ERC20_ABI = [
    "function decimals() view returns (uint8)",
    // Add other methods as needed
  ];
  
  export class ForwarderService {
    private contract!: Contract;
    private signer!: any;
    private provider!: BrowserProvider;
  
    constructor(
      private contractAddress: string,
      private contractABI: any[],
      provider: BrowserProvider
    ) {
      this.provider = provider;
    }
  
    // Initialize signer and contract asynchronously
    async initialize() {
      if (!this.signer) {
        this.signer = await this.provider.getSigner();
      }
      console.log(this.contractAddress);
      console.log(this.contractABI);
      console.log(this.signer);
      this.contract = new Contract(this.contractAddress, this.contractABI, this.signer);
    }
  
    // Make sure initialization is complete before calling this function
    async createGaslessTransaction(
      transactionType: TransactionType,
      tokenContract: string,
      recipient: string,
      amount: string,
      tokenId?: string
    ) {
      if (!this.signer) {
        throw new Error('Signer is not initialized. Call initialize() first.');
      }
  
      const from = await this.signer.getAddress();
      const nonce = await this.contract.getNonce(from);
      const deadline = Math.floor(Date.now() / 1000) + 3600;
  
      const request: ForwardRequest = {
        from,
        to: recipient,
        tokenContract,
        tokenId: tokenId ? BigInt(tokenId) : BigInt(0),
        amount: await this.getTokenAmount(tokenContract, amount), // Handle dynamic decimals
        nonce,
        deadline,
        transactionType,
        signature: '',
      };
  
      const signature = await this._signRequest(request);
      request.signature = signature;
  
      return this._executeTransaction(request);
    }
  
    private async _signRequest(request: ForwardRequest): Promise<string> {
      const network = await this.provider.getNetwork();
      const domain: TypedDataDomain = {
        name: 'GaslessTransactionForwarder',
        version: '1',
        chainId: network.chainId,
        verifyingContract: String(this.contract.target), // Correct for Ethers v6
      };
  
      const types = {
        ForwardRequest: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'tokenContract', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: 'amount', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
          { name: 'transactionType', type: 'uint8' },
        ],
      };
  
      return await this.signer.signTypedData(domain, types, request);
    }
  
    private async _executeTransaction(signedRequest: ForwardRequest) {
      try {
        if (signedRequest.transactionType === TransactionType.ERC20_TRANSFER) {
          return await this.contract.executeGaslessERC20Transfer(signedRequest);
        } else if (signedRequest.transactionType === TransactionType.ERC721_TRANSFER) {
          return await this.contract.executeGaslessERC721Transfer(signedRequest);
        } else {
          throw new Error(`Unsupported transaction type: ${signedRequest.transactionType}`);
        }
      } catch (error) {
        throw new Error(`Transaction execution failed for type ${signedRequest.transactionType}: ${error}`);
      }
    }
  
    // Fetch correct token amount based on decimals
    private async getTokenAmount(tokenContract: string, amount: string): Promise<bigint> {
      const token = new Contract(tokenContract, ERC20_ABI, this.signer);
      const decimals = await token.decimals();
      return parseUnits(amount, decimals); 
    }
}

// Types definitions
export enum TransactionType {
  ERC20_TRANSFER,
  ERC721_TRANSFER,
}

export interface ForwardRequest {
  from: string;
  to: string;
  tokenContract: string;
  tokenId: bigint;
  amount: bigint;
  nonce: number;
  deadline: number;
  transactionType: TransactionType;
  signature: string;
}
