import Web3 from "web3";
import ArtGalleryNFT from "./contracts/ArtGalleryNFT.json";

const getWeb3 = async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            return web3;
        } catch (error) {
            console.log(error);
        }
    } else if (window.web3) {
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        return web3;
    } else {
        const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        return web3;
    }
}

const getTokenContract = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = ArtGalleryNFT.networks[networkId];
    const instance = new web3.eth.Contract(ArtGalleryNFT.abi, deployedNetwork && deployedNetwork.address);
    return instance;
};

export { getWeb3, getTokenContract };
