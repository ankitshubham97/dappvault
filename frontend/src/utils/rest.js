import axios from "axios";
import { API_BASE_URL, PACKED_NONCE } from '../constants';

export const getAccessToken = async ({signature, walletPublicAddress}) => {
  try{
    const res = await axios.post(
      `${API_BASE_URL}/token`, 
      {
        nonce: 'message',
        signature,
        walletPublicAddress,
        nftContractAddress: '0x8437ee943b49945a7270109277942defe30fac25',
        nftId: '0',
      },
      {
        withCredentials: true,
      }
    );
    console.log(res.data);
    return { accessToken: res.data.accessToken, error: null };
  } catch (error) {
    return { accessToken: null, error };
  }
};

export const removeAccessToken = async () => {
  const res = await axios.delete(
    `${API_BASE_URL}/token`, {
      withCredentials: true,
    }
  );
  console.log(res.data);
  return res.data;
}

export const getContent = async (filename) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/download`,
      {
        // "filename": "rick-roll-rick-ashley.gif"
        "filename": filename
      },
      {
        responseType: 'blob',
        withCredentials: true
      }
    );
    return {uri: URL.createObjectURL(res.data), error: null};
  } catch (err) {
    return {uri: null, error: err};
  }
}

export const listContents = async () => {
  const res = await axios.post(
    `${API_BASE_URL}/list`,
    {
      withCredentials: true
    }
  );
  return res.data;
}
