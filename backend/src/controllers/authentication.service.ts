import GetTokenRequest from '../interfaces/getTokenRequest';
import GetTokenResponse, {
  GetTokenResponseFailure,
  GetTokenResponseSuccess,
} from '../interfaces/getTokenResponse';
import JwtAccessTokenPayload from '../interfaces/jwtAccessTokenPayload';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import jwt from 'jsonwebtoken';
import axios, { ResponseType } from 'axios';

async function doesWalletOwnNft(
  web3: Web3,
  deployedContractAbi: AbiItem[],
  deployedContractAddress: string,
  walletPublicAddress: string,
  nftContractAddress: string,
  nftId: string
): Promise<boolean> {
  const contractInstance = new web3.eth.Contract(
    deployedContractAbi,
    deployedContractAddress
  );
  const res = (await contractInstance.methods
    .walletHoldsToken(walletPublicAddress, nftContractAddress, nftId)
    .call()) as boolean;
  return res;
}

async function doesWalletOwnEnoughMatic({walletPublicAddress}:{walletPublicAddress: string}): Promise<boolean> {
  // https://api.covalenthq.com/v1/80001/address/0x5d905Cd5734A457139bc04c77CAAf3DFCBf0bA33/balances_v2/
  // ?quote-currency=USD
  // &format=JSON
  // &nft=false
  // &no-nft-fetch=false
  // &key=ckey_76f55185b2c74744a2b87c39e93
  const resp = await axios({
    method: 'get',
    url: `https://api.covalenthq.com/v1/80001/address/${walletPublicAddress}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=${process.env.COVALENT_API_KEY}`,
    headers: { 
      'Content-Type': 'application/json'
    },
  });
  const items = resp.data.data.items as any[];
  if (items && items?.length > 0) {
    // Check if the wallet has at least 15 MATIC.
    // MATIC contract address: 0x0000000000000000000000000000000000001010
    const criterion1 = items.filter(i => i.contract_address === "0x0000000000000000000000000000000000001010" && Number(i.balance) >= 15000000000000000000)?.length > 0
    
    // Check if the wallet has the correct NFT
    // Correct NFT contract address: 0x8437ee943b49945a7270109277942defe30fac25
    const criterion2 = items.filter(i => i.contract_address === "0x8437ee943b49945a7270109277942defe30fac25" && Number(i.balance) >= 1)?.length > 0
    console.log('cri1', criterion1);
    console.log('cri2', criterion2);
    // If either of the criteria is true, return true otherwise false.
    return criterion1 || criterion2;
  }
  return false;
}

function createToken(secret: string, getTokenRequest: GetTokenRequest): string {
  const expiresIn = '1h';
  const { walletPublicAddress, nftContractAddress, nftId } = getTokenRequest;
  const jwtAccessTokenPayload: JwtAccessTokenPayload = {
    walletPublicAddress,
    nftContractAddress,
    nftId,
  };
  return jwt.sign(jwtAccessTokenPayload, secret, { expiresIn });
}

export { GetTokenResponseSuccess, GetTokenResponseFailure, GetTokenResponse };
export { JwtAccessTokenPayload };
export default function AuthNft() {
  let _secret: string;
  let _web3: Web3;
  let _deployedContractAddress: string;
  let _deployedContractAbi: AbiItem[];

  return {
    init: function ({
      secret,
      networkEndpoint,
      deployedContractAddress,
      deployedContractAbi,
    }: {
      secret: string;
      networkEndpoint: string;
      deployedContractAddress: string;
      deployedContractAbi: AbiItem[];
    }) {
      _secret = secret;
      _deployedContractAddress = deployedContractAddress;
      _deployedContractAbi = deployedContractAbi;
      _web3 = new Web3(networkEndpoint);
    },
    getDeployedContractAddress: function () {
      return _deployedContractAddress;
    },
    getDeployedContractAbi: function () {
      return _deployedContractAbi;
    },
    getToken: async function (
      getTokenRequest: GetTokenRequest
    ): Promise<GetTokenResponse> {
      const {
        nonce,
        signature,
        walletPublicAddress,
        nftContractAddress,
        nftId,
      } = getTokenRequest;
      try {
        // Verify the signature.
        const signerAddr = ethers.utils.verifyMessage(nonce, signature);
        if (signerAddr !== walletPublicAddress) {
          return {
            data: {
              errorMessage: 'Invalid signature',
              errorCode: 'invalid_signature',
            },
            code: 400,
          };
        }
        // Check if the wallet owns the NFT.
        if (
          // !(await doesWalletOwnNft(
          //   _web3,
          //   _deployedContractAbi,
          //   _deployedContractAddress,
          //   walletPublicAddress,
          //   nftContractAddress,
          //   nftId
          // ))
          !(await doesWalletOwnEnoughMatic({walletPublicAddress}))
        ) {
          return {
            data: {
              errorMessage: 'Invalid NFT',
              errorCode: 'invalid_nft',
            },
            code: 400,
          };
        }
        return {
          data: {
            accessToken: createToken(_secret, getTokenRequest),
            walletPublicAddress,
            nftContractAddress,
            nftId,
            iat: Date.now(),
            exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
          },
          code: 200,
        };
      } catch (err) {
        console.log(err);
        return {
          data: {
            errorMessage: 'Unknown error',
            errorCode: 'unknown_error',
          },
          code: 500,
        };
      }
    },
    verifyToken: function (token: string): boolean {
      try {
        jwt.verify(token, _secret) as JwtAccessTokenPayload;
        return true;
      } catch (err) {
        return false;
      }
    },
  };
}
