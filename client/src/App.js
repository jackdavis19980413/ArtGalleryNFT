// src/App.js

import React, { useState } from "react";

import MainLayout from "./Layouts/MainLayout";
import Gallery from "./Layouts/Gallery";
import MintDialog from "./Modals/MintDialog";

import { getWeb3, getTokenContract } from "./getWeb3";

const App = () => {
  const [account, setAccount] = useState('');
  const [gallery, setGallery] = useState([]);
  const [isMintOpen, setIsMintOpen] = useState(false);


  const initWeb3 = async () => {
    try {
      const web3Instance = await getWeb3();
      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);
      loadGallery();

    } catch (error) {
      console.error("Error connecting to web3", error);
    }
  }

  const loadGallery = async () => {
    try {
      const web3Instance = await getWeb3();
      const tokenContract = await getTokenContract(web3Instance);

      const totalSupply = await tokenContract.methods.tokenCounter().call();
      let galleryData = [];
      for (let i = 0; i < totalSupply; i++) {
        const tokenURI = await tokenContract.methods.tokenURI(i).call();
        const tokenCreator = await tokenContract.methods.getCreator(i).call();
        const owner = await tokenContract.methods.ownerOf(i).call();
        const price = await tokenContract.methods.prices(i).call();
        const listedForSale = await tokenContract.methods.listedForSale(i).call();
        galleryData.push({ id: i, uri: tokenURI, creator: tokenCreator, owner: owner, price: price, listedForSale: listedForSale });
      }
      setGallery(galleryData);
    } catch (error) {
      console.error("Error connecting to web3", error);
    }
  };

  const onConnect = (e) => {
    e.preventDefault()

    initWeb3();
  }

  return (
    <MainLayout
      header={
        <div className="flex justify-between items-center" >
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {account ? (
              <div>Connected Account: {account}</div>
            ) : (
              <div>NFT Art Gallery </div>
            )}
          </h2>
          <div className="mt-4 text-right">
            {account ? (
              <button onClick={(e) => { setIsMintOpen(true) }}
                className="bg-blue-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-blue-600 mr-2"
              >
                Mint New Art
              </button>
            ) : (
              <button onClick={onConnect}
                className="bg-cyan-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-cyan-600 mr-2"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div >
      }
    >
      <div className="py-4 mt-4">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <MintDialog isOpen={isMintOpen} onCloseFunc={setIsMintOpen} refresh={loadGallery} />
            {account && (
              <Gallery gallery={gallery} account={account} refresh={loadGallery} />
            )}
          </div>
        </div>
      </div>
    </MainLayout >
  );
};

export default App;
