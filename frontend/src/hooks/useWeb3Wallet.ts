import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { toast } from 'react-hot-toast';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

interface UseWeb3WalletReturn extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (to: string, value: string) => Promise<string>;
  isMetaMaskInstalled: boolean;
}

// Enhanced supported networks with more options
export const SUPPORTED_NETWORKS = {
  ETHEREUM_MAINNET: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io',
    currency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  ETHEREUM_SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    blockExplorer: 'https://sepolia.etherscan.io',
    currency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 }
  },
  POLYGON_MAINNET: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    currency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
  },
  POLYGON_MUMBAI: {
    chainId: 80001,
    name: 'Polygon Mumbai',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com',
    currency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
  },
  BSC_MAINNET: {
    chainId: 56,
    name: 'Binance Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    blockExplorer: 'https://bscscan.com',
    currency: { name: 'BNB', symbol: 'BNB', decimals: 18 }
  },
  ARBITRUM_ONE: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    currency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  }
};

// Helper function to get network name
const getNetworkName = (chainId: number): string => {
  const network = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === chainId);
  return network ? network.name : `Unknown Network (${chainId})`;
};

export const useWeb3Wallet = (): UseWeb3WalletReturn => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    chainId: null,
    provider: null,
    signer: null
  });

  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = async () => {
      const provider = await detectEthereumProvider();
      setIsMetaMaskInstalled(!!provider);
    };
    checkMetaMask();
  }, []);

  // Update balance
  const updateBalance = useCallback(async (provider: ethers.BrowserProvider, address: string) => {
    try {
      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      setWalletState(prev => ({ ...prev, balance: balanceInEth }));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, []);

  // Enhanced wallet connection with better UX
  const connectWallet = useCallback(async () => {
    try {
      const ethereum = await detectEthereumProvider();

      if (!ethereum) {
        toast.error('MetaMask not detected. Please install MetaMask to continue.', {
          duration: 5000,
          style: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
          },
        });
        // Open MetaMask installation page
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      // Show connecting toast
      const connectingToast = toast.loading('Connecting to MetaMask...', {
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
      });

      // Request account access with enhanced error handling
      const accounts = await (ethereum as any).request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        toast.dismiss(connectingToast);
        toast.error('No accounts found. Please unlock MetaMask and try again.');
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum as any);
      const signer = await provider.getSigner();
      const address = accounts[0];
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Get network name for better UX
      const networkName = getNetworkName(chainId);

      setWalletState({
        isConnected: true,
        address,
        balance: null,
        chainId,
        provider,
        signer
      });

      // Update balance
      await updateBalance(provider, address);

      toast.dismiss(connectingToast);
      toast.success(`🎉 Connected to ${address.slice(0, 6)}...${address.slice(-4)} on ${networkName}`, {
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #10ac84 0%, #1dd1a1 100%)',
          color: 'white',
        },
      });

      // Store enhanced connection state
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', address);
      localStorage.setItem('walletChainId', chainId.toString());
      localStorage.setItem('walletConnectedAt', Date.now().toString());

    } catch (error: any) {
      console.error('Error connecting wallet:', error);

      // Enhanced error handling
      let errorMessage = 'Failed to connect wallet';
      if (error.code === 4001) {
        errorMessage = 'Connection rejected. Please approve the connection in MetaMask.';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request pending. Please check MetaMask.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        duration: 5000,
        style: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: 'white',
        },
      });
    }
  }, [updateBalance]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      balance: null,
      chainId: null,
      provider: null,
      signer: null
    });

    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
    
    toast.success('Wallet disconnected');
  }, []);

  // Switch network
  const switchNetwork = useCallback(async (targetChainId: number) => {
    try {
      const ethereum = await detectEthereumProvider();
      if (!ethereum) return;

      const chainIdHex = `0x${targetChainId.toString(16)}`;
      
      await (ethereum as any).request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }]
      });

      toast.success('Network switched successfully');
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        const network = Object.values(SUPPORTED_NETWORKS).find(n => n.chainId === targetChainId);
        if (network) {
          try {
            await (ethereum as any).request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: network.name,
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorer],
                nativeCurrency: network.currency
              }]
            });
          } catch (addError) {
            toast.error('Failed to add network');
          }
        }
      } else {
        toast.error('Failed to switch network');
      }
    }
  }, []);

  // Sign message
  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!walletState.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await walletState.signer.signMessage(message);
      toast.success('Message signed successfully');
      return signature;
    } catch (error: any) {
      toast.error('Failed to sign message');
      throw error;
    }
  }, [walletState.signer]);

  // Send transaction
  const sendTransaction = useCallback(async (to: string, value: string): Promise<string> => {
    if (!walletState.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await walletState.signer.sendTransaction({
        to,
        value: ethers.parseEther(value)
      });

      toast.success(`Transaction sent: ${tx.hash}`);
      return tx.hash;
    } catch (error: any) {
      toast.error('Transaction failed');
      throw error;
    }
  }, [walletState.signer]);

  // Listen for account and network changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== walletState.address) {
        // Account changed, reconnect
        connectWallet();
      }
    };

    const handleChainChanged = (chainId: string) => {
      const newChainId = parseInt(chainId, 16);
      setWalletState(prev => ({ ...prev, chainId: newChainId }));
      
      // Update balance for new network
      if (walletState.provider && walletState.address) {
        updateBalance(walletState.provider, walletState.address);
      }
    };

    const setupEventListeners = async () => {
      const ethereum = await detectEthereumProvider();
      if (ethereum) {
        (ethereum as any).on('accountsChanged', handleAccountsChanged);
        (ethereum as any).on('chainChanged', handleChainChanged);
      }
    };

    setupEventListeners();

    return () => {
      const cleanup = async () => {
        const ethereum = await detectEthereumProvider();
        if (ethereum) {
          (ethereum as any).removeListener('accountsChanged', handleAccountsChanged);
          (ethereum as any).removeListener('chainChanged', handleChainChanged);
        }
      };
      cleanup();
    };
  }, [walletState.address, walletState.provider, connectWallet, disconnectWallet, updateBalance]);

  // Auto-connect on page load if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      const wasConnected = localStorage.getItem('walletConnected');
      if (wasConnected === 'true') {
        await connectWallet();
      }
    };

    if (isMetaMaskInstalled) {
      autoConnect();
    }
  }, [isMetaMaskInstalled, connectWallet]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    signMessage,
    sendTransaction,
    isMetaMaskInstalled
  };
};
