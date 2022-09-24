import { ethers } from 'ethers';

export const connectWallet = async () => {
  // e.preventDefault();
  try {
    const message = "message";
    console.log({ message });
    if (!window.ethereum)
      throw new Error('No crypto wallet found. Please install it.');
    await window.ethereum.send('eth_requestAccounts');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    return {
      message,
      signature,
      address,
    };
  } catch (err) {
    return (err.message);
  }
}

export const signPayload = async () => {
  
}