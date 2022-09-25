import { getAccessToken, removeAccessToken } from "../utils/rest";
import { connectWallet, disconnectWallet } from "../utils/connectWallet";

const Navbar = (props) => {
  const  {
    account,
    setAccount,
    contentUri,
    setContentUri,
    setError,
    setAccessToken,
    onGetContent,
  } = props;

  const onConnectWallet = async () => {
    const { address, message, signature} = await connectWallet();
    console.log(address, message, signature);
    setAccount(address);
    setContentUri('');
    const {accessToken, error} = await getAccessToken({signature, walletPublicAddress:address});
    if (error) {
      setError(error);
    }
    if (accessToken) {
      setAccessToken(accessToken);
      await onGetContent()
    }
  };

  const ondisconnectWallet = async () => {
    await disconnectWallet();
    setAccount("");
    const resp = await removeAccessToken();
    setAccessToken(null);
    setContentUri('');
    console.log(resp);
  };

  return (
    <div className="navbar navbar-dark bg-warning fixed-top">
      <div className="container py-2">
        <a href="/" className="navbar-brand">
          Dappvault Demo
        </a> 
        <a href="https://github.com/ankitshubham97/dappvault">
          <img src="github-logo-6531.png" alt="public-address" className="ml-2" />
        </a>
        <div className="d-flex">
          {(() => {
            const publicAddr = account;
            if (publicAddr && publicAddr !== "" && !String(publicAddr).includes("walletPublicAddress")) {
              return <button className="btn btn-outline-secondary" disabled>Connected to {publicAddr}</button>;
            }
            return <button onClick={onConnectWallet} className="btn btn-outline-success"> Connect Wallet </button>;
          })()}
          &nbsp;
          {(() => {
            const publicAddr = account;
            if (publicAddr && publicAddr !== "" && !String(publicAddr).includes("walletPublicAddress")) {
              return <button onClick={ondisconnectWallet} className="btn btn-outline-danger">Disconnect</button>;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
