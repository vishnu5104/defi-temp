import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { MarketAddress, MarketAddressABI } from '@/context/address';
import Router from 'next/router';
import { connectWallet } from '@/utils/apiFeatures';

const inter = Inter({ subsets: ['latin'] })
const router = Router;

export default function Home() {
  const [temp, settemp] = useState(0)
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('')

  useEffect(() => {
    // Connect to Ethereum network
    const provider = window.ethereum;
    const web3Instance = new Web3(provider);
    console.log("it has aa",web3Instance);

    // Create contract instance
    const contractInstance = new web3Instance.eth.Contract(MarketAddressABI, MarketAddress);
walletConnect()
    setWeb3(web3Instance);
    setContract(contractInstance);
  }, []);

  function convertWeiToEth(wei) {
    const ether = wei / 10**18;
    return ether;
  }


 
  const walletConnect = async (event, productId) => {
    const connectAccount = await connectWallet()
      setAccount(connectAccount)
  }

  const handleSubmit = async (event, productId) => {
    event.preventDefault();
  productId = 3;
    // Execute smart contract function
    let price;
    if (productId === 1) {
      price = '2';
    } else if (productId === 2) {
      price = '4';
    } else if (productId === 3) {
      price = '0.003';
    } else if (productId === 4) {
      price = '8';
    }
  
    await contract.methods.buyProduct(account).send({
      from: account,
      value: web3.utils.toWei(price, 'ether'),
      gas: 500000 // or any higher value
    })
  
    const temppool = await contract.methods.getBalance(account).call()
    // const valueinEth = convertWeiToEth(temppool)
    settemp(temppool)
  
    console.log("the value is ",temppool)
  
    // Redirect to confirmation page
    router.push({
      pathname: '/confirmation',
      query: { price: temppool },
    });
  };
  


  return (
    <>
      <div>
        <p>Wallet address: {account}</p>
        <h1>product name</h1>
        <p>pdes</p>
        <h2>price 2 ETH</h2>
        <h2>{temp}</h2>
        <form onSubmit={handleSubmit}>
  <label htmlFor="address">Enter your address:</label>
  <input type="text" name="address" required />

  <label htmlFor="productId">Select a product:</label>
  <select name="productId" id="productId">
    <option value="1">Product 1</option>
    <option value="2">Product 2</option>
    <option value="3">Product 3</option>
    <option value="4">Product 4</option>
  </select>

  <button type="submit">Buy now</button>
</form>
      
      </div>
    </>
  )
}
