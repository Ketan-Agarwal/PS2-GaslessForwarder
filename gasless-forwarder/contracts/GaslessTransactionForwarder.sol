// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GaslessTransactionForwarder is Ownable, ReentrancyGuard {
    constructor() Ownable(msg.sender) ReentrancyGuard() {
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("GaslessTransactionForwarder")),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }
    
    using ECDSA for bytes32;

    // Struct to define transaction details
    struct ForwardRequest {
        address from;
        address to;
        address tokenContract;
        uint256 tokenId;
        uint256 amount;
        uint256 nonce;
        uint256 deadline;
        bytes signature;
        TransactionType transactionType;
    }

    // Supported transaction types
    enum TransactionType {
        ERC20_TRANSFER,
        ERC721_TRANSFER
    }

    // Mapping to track used nonces
    mapping(address => mapping(uint256 => bool)) public usedNonces;

    // Domain separator for EIP-712 signature verification
    bytes32 public DOMAIN_SEPARATOR;

    // Constructor to set up domain separator

    // Event for successful gasless transaction
    event GaslessTransactionExecuted(
        address indexed from, 
        address indexed to, 
        address tokenContract, 
        uint256 amount, 
        TransactionType txType
    );

    // Get nonce for an address
    function getNonce(address user) public view returns (uint256) {
        uint256 nonce = 0;
        for (uint256 i = 0; i < type(uint256).max; i++) {
            if (!usedNonces[user][i]) {
                nonce = i;
                break;
            }
        }
        return nonce;
    }

    // Verify signature and transaction details
    function _verifyRequest(ForwardRequest memory req) internal view returns (bool) {
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("ForwardRequest(address from,address to,address tokenContract,uint256 tokenId,uint256 amount,uint256 nonce,uint256 deadline,uint8 transactionType)"),
                req.from,
                req.to,
                req.tokenContract,
                req.tokenId,
                req.amount,
                req.nonce,
                req.deadline,
                req.transactionType
            )
        );

        bytes32 hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", structHash));
        address signer = ECDSA.recover(hash, req.signature);

        require(signer == req.from, "Invalid signature");
        require(block.timestamp <= req.deadline, "Request expired");
        require(!usedNonces[req.from][req.nonce], "Nonce already used");

        return true;
    }

    // Execute gasless ERC20 transfer
    function executeGaslessERC20Transfer(ForwardRequest memory req) 
        external 
        nonReentrant 
    {
        require(req.transactionType == TransactionType.ERC20_TRANSFER, "Invalid transaction type");
        require(_verifyRequest(req), "Invalid request");
        
        // Mark nonce as used
        usedNonces[req.from][req.nonce] = true;

        // Perform ERC20 transfer
        bool success = IERC20(req.tokenContract).transferFrom(
            req.from, 
            req.to, 
            req.amount
        );
        require(success, "ERC20 transfer failed");

        emit GaslessTransactionExecuted(
            req.from, 
            req.to, 
            req.tokenContract, 
            req.amount, 
            TransactionType.ERC20_TRANSFER
        );
    }

    // Execute gasless ERC721 transfer
    function executeGaslessERC721Transfer(ForwardRequest memory req) 
        external 
        nonReentrant 
    {
        require(req.transactionType == TransactionType.ERC721_TRANSFER, "Invalid transaction type");
        require(_verifyRequest(req), "Invalid request");
        
        // Mark nonce as used
        usedNonces[req.from][req.nonce] = true;

        // Perform ERC721 transfer
        IERC721(req.tokenContract).safeTransferFrom(
            req.from, 
            req.to, 
            req.tokenId
        );

        emit GaslessTransactionExecuted(
            req.from, 
            req.to, 
            req.tokenContract, 
            req.tokenId, 
            TransactionType.ERC721_TRANSFER
        );
    }

    // Recover tokens sent to contract accidentally
    function recoverERC20(address tokenContract, uint256 amount) 
        external 
        onlyOwner 
    {
        IERC20(tokenContract).transfer(owner(), amount);
    }

    // Recover NFTs sent to contract accidentally
    function recoverERC721(address tokenContract, uint256 tokenId) 
        external 
        onlyOwner 
    {
        IERC721(tokenContract).safeTransferFrom(
            address(this), 
            owner(), 
            tokenId
        );
    }
}