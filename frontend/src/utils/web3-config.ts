import { ethers } from 'ethers';

const web3Config = {
  
  disableEval: true,
  
  staticProviders: true,
  
  safeMode: true
};

export const createSafeProvider = (rpcUrl?: string) => {
  try {
    if (rpcUrl) {
      
      return new ethers.JsonRpcProvider(rpcUrl);
    }

    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    
    throw new Error('No Web3 provider available');
  } catch (error) {
    console.error('Provider creation error:', error);
    throw new Error('Failed to create Web3 provider');
  }
};

export const createSafeSigner = (provider: ethers.Provider, privateKey?: string) => {
  try {
    if (privateKey) {
      
      return new ethers.Wallet(privateKey, provider);
    }

    if (provider instanceof ethers.BrowserProvider) {
      return provider.getSigner();
    }
    
    throw new Error('Cannot create signer without private key or browser provider');
  } catch (error) {
    console.error('Signer creation error:', error);
    throw new Error('Failed to create Web3 signer');
  }
};

export const createSafeContract = (
  address: string,
  abi: any[],
  signerOrProvider: ethers.Signer | ethers.Provider
) => {
  try {
    
    return new ethers.Contract(address, abi, signerOrProvider);
  } catch (error) {
    console.error('Contract creation error:', error);
    throw new Error('Failed to create contract instance');
  }
};

export const createSafeTransaction = (to: string, value: string, data?: string) => {
  try {
    const transaction: any = {
      to,
      value: ethers.parseEther(value)
    };
    
    if (data) {
      transaction.data = data;
    }
    
    return transaction;
  } catch (error) {
    console.error('Transaction creation error:', error);
    throw new Error('Failed to create transaction');
  }
};

export const validateAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    console.error('Address validation error:', error);
    return false;
  }
};

export const getSafeBalance = async (
  provider: ethers.Provider,
  address: string
): Promise<string> => {
  try {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Balance check error:', error);
    throw new Error('Failed to get balance');
  }
};

export const detectNetwork = async (provider: ethers.Provider) => {
  try {
    const network = await provider.getNetwork();
    return {
      chainId: Number(network.chainId),
      name: network.name
    };
  } catch (error) {
    console.error('Network detection error:', error);
    throw new Error('Failed to detect network');
  }
};

export const signSafeMessage = async (
  signer: ethers.Signer,
  message: string
): Promise<string> => {
  try {
    return await signer.signMessage(message);
  } catch (error) {
    console.error('Message signing error:', error);
    throw new Error('Failed to sign message');
  }
};

export const verifySafeSignature = (
  message: string,
  signature: string,
  address: string
): boolean => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

export const estimateSafeGas = async (
  provider: ethers.Provider,
  transaction: any
): Promise<string> => {
  try {
    const gasEstimate = await provider.estimateGas(transaction);
    return gasEstimate.toString();
  } catch (error) {
    console.error('Gas estimation error:', error);
    throw new Error('Failed to estimate gas');
  }
};

export const sendSafeTransaction = async (
  signer: ethers.Signer,
  transaction: any
): Promise<string> => {
  try {
    const tx = await signer.sendTransaction(transaction);
    return tx.hash;
  } catch (error) {
    console.error('Transaction sending error:', error);
    throw new Error('Failed to send transaction');
  }
};

export const NETWORKS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https:
    blockExplorer: 'https:
  },
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https:
    blockExplorer: 'https:
  },
  bsc: {
    chainId: 56,
    name: 'BSC Mainnet',
    rpcUrl: 'https:
    blockExplorer: 'https:
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https:
    blockExplorer: 'https:
  }
};

export const Web3Utils = {
  createProvider: createSafeProvider,
  createSigner: createSafeSigner,
  createContract: createSafeContract,
  createTransaction: createSafeTransaction,
  validateAddress,
  getBalance: getSafeBalance,
  detectNetwork,
  signMessage: signSafeMessage,
  verifySignature: verifySafeSignature,
  estimateGas: estimateSafeGas,
  sendTransaction: sendSafeTransaction
};

export { ethers };
export default Web3Utils;
