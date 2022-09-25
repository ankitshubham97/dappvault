# Dappvault
_Protect your organization's sensitive files while enabling seemless-sharing with the authorized members; powered by blockchain(read 'Polygon'), cryptography & decentralized file system(read 'IPFS')_

## Problems with the current document-protection solutions?
### Dependency on centralized system & single point-of-failure
What if the service on which the organizations hosted their sensitive files goes down? What if the files get compromised because of a bug in the centralized server, or any other reason? These centralized systems serve as the single point-of-failures!
### High charges to store files
The centralized services charge a significant amount for a relatively-simpler work. They are able to do this because of the monopoly they enjoy!
### Not encrypted, prone to leaks
It is not new to hear of news that due to certain vulnerabilities in the centralized system, the files got leaked. On top of it, they rarely care to encrypt the data and then store it.

## Solution: Enters Dappvault 😎
Dappvault is a document-protection dapp which is truly decentralized yet secure. The files are tightly-encrypted & then stored on IPFS. They can only be accessed by the members which the organization has authorized to. The authorization is granted to a member only if any of the 2 conditions are met:
1. Have the correct NFT in their wallet which the organization provided.
2. Have a certain amount of governance tokens of the organization.
Think something similar to Developer DAO (You need to either have one of their genesis NFTs or 400 $CODE tokens to unlock access)

In its essence, the organization can
1. Store files on IPFS(so decentralized)
2. Remain worry-free because their files are first encrypted and then stored on IPFS
3. Token-gate their files; so only that member who possesses a certain NFT or have enough governance tokens can truly access the information (Of course, the NFT would be provided by the organization and it would be one of the guarantees of access to their private content!)
4. **With [Chainsafe](https://chainsafe.io/), 20GB data could be hosted for free!**

### High-level positive flow (A):
- Member has the correct NFT in their wallet.
- Member goes to [app][Demo App] and connects his wallet.
- Voila! He is able to access the sensitive files!

### High-level positive flow (B):
- Member has the enough governance tokens in their wallet.
- Member goes to [app][Demo App] and connects his wallet.
- Voila! He is able to access the sensitive files!

### High-level negative flow (A):
- Member goes to the app but does not connect his wallet and tries to view the sensitive data.
- Oops! He is unable to access them!

### High-level negative flow (B):
- Member has neither the correct NFT nor enough governance tokens in their wallet.
- Member goes to [app][Demo App] and connects his wallet.
- Oops! He is unable to access the sensitive data!

### Technical flow (positive)
- User has either the correct NFT or enough governance tokens in their wallet.
- User goes to [app][Demo App] and connects his wallet.
- They sign a nonce and frontend sends a payload containing the nonce, signature and wallet public address to the backend.
- Backend finds the signature to be valid. It also finds that the wallet public address does contain the correct NFT using **Covalent API**.
- It generates an access token and sends it to frontend.
- Frontend piggybacks this access token on the request to the backend server that enables the user to view the private content.
- Backend server sees that the frontend is trying to access the private content. It checks if the access token is valid and finds it to be valid.
- Backend server fetches the encrypted content from IPFS, decrypts it using its secret key and sends the decrypted content to the frontend.
- Voila! The member is able to view the sensitive files!
- (Note that the organization uploads files to IPFS via the [admin interface][Demo App Admin]. The admin interface sends the content to the backend where it is first encrypted by the backend's secret key and then the encrypted content is uploaded to IPFS.)

### Technical flow (negative)
- In any negative flow, the user won't be having a valid access token. The flow stops here itself and the content is never fetched.

## What is in this repository?
This repository contains 3 sub-projects:
1. [Backend service][Demo Backend]
2. [Frontend][Demo App] for members.
3. [A simple admin interface][Demo App Admin] for the organization to encrypt-and-upload new content to IPFS. 

The app is based on Polygon Mumbai chain and the related ERC-721 smart contract is deployed [here][Demo ERC-721 Contract] (Contract address: 0x8437ee943b49945a7270109277942defe30fac25 on Polygon Mumbai)
The smart contract is in the `smart-contracts` directory.

## [Ethonline Hackathon 2022][Ethonline Hackathon]
This project is developed as part of the [Ethonline Hackathon][Ethonline Hackathon]. If you are a panelist/judge/reviewer, please check out the following steps.

### For the panelists/judges/reviewers of Ethonline Hackathon 2022
The demo video is here: [Demo Video]

The app is deployed at https://dappvault-frontend.vercel.app/

The app uses [Chainsafe](https://chainsafe.io/) and its APIs for decentralized storage on IPFS.

The app uses [Covalent](https://www.covalenthq.com/) and its APIs for fetching account balance. This is critical to verify if a wallet holds the correct NFT or if the wallet has enough governance tokens so that accordingly, the backend would generate a valid access token.

For this project:
1. It is deployed over Polygon Mumbai chain.
2. The correct NFT is an NFT from the contract address 0x8437ee943b49945a7270109277942defe30fac25 on Polygon Mumbai chain.
3. The governance token is MATIC Mumbai tokens. The minimum amount of MATIC Mumbai tokens needed for getting access to sensitive files is kept to be 15.

<ins><b>Checking happy path:</b></ins>

If you want to interact with the app, you would need a Metamask wallet which has either [the correct NFT][Demo ERC-721 Contract] or enough governance tokens (as told in the [demo video][Demo Video]). Here is a list of good wallets:

| Public address | Private key | Property |
| ------ | ------ | ------ |
| 0x4ad53d31Cb104Cf5f7622f1AF8Ed09C3ca980523 | dec5213b700bc944b06584aaf3d508f88a1ce0221b77067b7e7b95d7b88d2ae3 | Has correct NFT |
| 0x5d905Cd5734A457139bc04c77CAAf3DFCBf0bA33 | aa2f90405e3595239c83d51dcdb7070e14010c472bb69acc284f38558ddde8d7 | Has more than 15 MATIC testnet tokens |

(I just hope nobody cares to become mischievous and drains out the NFT or the MATIC tokens from the above wallets 😅)

<ins><b>Checking unhappy path</b></ins>

To check the unhappy path, you could just use any random wallet to connect to the app which has less than 15 Polygon testnet tokens and does not have the correct NFT.

<ins><b>Interacting on Admin interface</b></ins>

If you want to upload new content, you can use [the admin interface][Demo App Admin]. You can use any username/password in the browser prompt to remove it and move forward. For testing purpose, it would be a good idea to upload a small file 😅

<ins><b>Interacting with Chainsafe storage used in this demo app</b></ins>

If you want to interact with the Chainsafe storage which is being used in this demo app, you can do via their APIs. Following are the keys that you might need:

- CHAINSAFE_KEY_ID=OYWNOGUSZNWMPGUSQQUI
-  CHAINSAFE_KEY_SECRET=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjI4ODA2NDAsImNuZiI6eyJqa3UiOiIvY2VydHMiLCJraWQiOiI5aHE4bnlVUWdMb29ER2l6VnI5SEJtOFIxVEwxS0JKSFlNRUtTRXh4eGtLcCJ9LCJ0eXBlIjoiYXBpX3NlY3JldCIsImlkIjo4NjA2LCJ1dWlkIjoiM2M1NmYzMjEtYTk5Yi00MzA0LWFlNzEtNzJjNjU0MWM0Y2VhIiwicGVybSI6eyJiaWxsaW5nIjoiKiIsInNlYXJjaCI6IioiLCJzdG9yYWdlIjoiKiIsInVzZXIiOiIqIn0sImFwaV9rZXkiOiJPWVdOT0dVU1pOV01QR1VTUVFVSSIsInNlcnZpY2UiOiJzdG9yYWdlIn0.IDNCAGlNIvtr5T5NnL0IK8VVLXh1WLqvMPupvBWL0HPW2rikuKmURK2zW-tjCz5DDrFaXJlx6dkVhV-4lCsYhg
- CHAINSAFE_BUCKET_URL=https://api.chainsafe.io/api/v1/bucket/12110635-9fce-419a-83ef-4f843965abbc

<ins><b>Using Covalent API</b></ins>

We have used **Get token balances for address** API (https://www.covalenthq.com/docs/api/#/0/Get%20token%20balances%20for%20address/USD/1). This is a critical piece in auth. Looking at the response, the backend can know if the wallet has enough governance tokens or the correct NFT. If the wallet fulfills wither of the criteria, the backend generates a valid access token which eventually allows the member owning that wallet to view the sensitive files!

<ins><b> App testing </b></ins>
The [poc app][Demo App] runs fine on the following platforms:
| Browser | Version | Works in incognito mode too? | Comments |
| ------ | ------ | ------ | ------ |
| Chrome | Version 104.0.5112.81 (Official Build) (64-bit) | ❌ | Chrome tightens on CORS in the incognito mode. This poc app uses different domains to host [frontend][Demo App] and [backend][Demo Backend] and Chrome's incognito mode is not happy about this 😔 |
| Brave | Version 1.42.88 Chromium: 104.0.5112.81 (Official Build) (x86_64) | ✔️ |  |
| Firefox | Version 103.0.2 (64-bit)  | ✔️ |  |
| Edge | Version 104.0.1293.47 (Official build) (64-bit) | ✔️ |  |

You could also choose to run your own instance of the backend and the frontend. You would find the instructions in the respective README files:
- [Running Backend][README Backend]
- [Running Frontend][README Frontend]


[Ethonline Hackathon]: <https://online.ethglobal.com/>
[README Frontend]: <../main/frontend/README.md>
[README Backend]: <../main/backend/README.md>
[Demo Video]: <https://youtu.be/Eu0ivvFS7co>
[Demo App]: <https://dappvault-frontend.vercel.app/>
[Demo App Admin]: <https://dappvault-frontend.vercel.app/admin>
[Demo Backend]: <https://dappvault-backend.herokuapp.com/>
[Demo ERC-721 Contract]: <https://mumbai.polygonscan.com/address/0x8437ee943b49945a7270109277942defe30fac25>
