"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Wallet, Coins } from "lucide-react";
import abi from "@/app/abi.json";
import { ethers } from "ethers";
import { contractAddress, deviceId } from "@/lib/utils";
import { toast } from "sonner";

export function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0.0");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimableTokens, setClaimableTokens] = useState("0.0");

  const FUJI_CHAIN_ID = "0xa869";

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("No Wallet Found, Install MetaMask to continue");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      // Switch to Fuji Testnet
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: FUJI_CHAIN_ID }],
        });
      } catch (err: any) {
        if (err.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: FUJI_CHAIN_ID,
                chainName: "Avalanche Fuji Testnet",
                nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
                rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
                blockExplorerUrls: ["https://testnet.snowtrace.io/"],
              },
            ],
          });
        } else {
          throw err;
        }
      }

      // Get balance
      const balanceHex = await window.ethereum.request({
        method: "eth_getBalance",
        params: [account, "latest"],
      });
      const balance = (parseInt(balanceHex, 16) / 1e18).toFixed(4);

      setAddress(account);
      setBalance(balance);
      setClaimableTokens("0.0001");

      toast.success("Connected to Fuji Testnet");
    } catch (err) {
      console.error(err);
      toast.error("Connection Failed, try again!");
    } finally {
      setIsConnecting(false);
    }
  };

  const claimTokens = async (
    address: string | undefined,
    deviceId: string,
    claimableTokens: string,
    setIsClaiming: (val: boolean) => void,
    setClaimableTokens: (val: string) => void
  ) => {
    if (!address) {
      toast.error("Wallet not connected, please connect your wallet first.");
      return;
    }

    setIsClaiming(true);

    try {
      // Get provider from MetaMask (Avalanche Fuji C-Chain)
      const { ethereum } = window as any;
      if (!ethereum) throw new Error("MetaMask not found");

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      // Check chain (Fuji Testnet: 43113)
      const { chainId } = await provider.getNetwork();
      if (chainId !== BigInt(43113)) {
        toast.error("Wrong Network, Please switch to Avalanche Fuji Testnet.");
        return;
      }

      // Contract instance
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Send tx
      const tx = await contract.claimTokens(deviceId);
      toast("Transaction Sent!");

      // Wait for confirmation
      const receipt = await tx.wait();
      if (receipt.status === BigInt(1)) {
        toast.success("Claim Successful");
        setClaimableTokens("0.0");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (err: any) {
      console.error("Claim error:", err);

      let message = "Try again";
      if (err.code === 4001) message = "User rejected transaction";
      else if (err.message?.includes("revert"))
        message = "Claim not allowed yet";

      toast("Claimed tokens!");
    } finally {
      setIsClaiming(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance("0.0");
    setClaimableTokens("0.0");
    toast("Wallet Disconnected, You have disconnected your wallet");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" /> Wallet & Claim
        </CardTitle>
        <CardDescription>
          Connect wallet to claim AVAX test tokens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!address ? (
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className="text-sm font-mono break-all">{address}</div>
              <Button size="sm" variant="outline" onClick={disconnectWallet}>
                Disconnect
              </Button>
            </div>
            <div className="text-lg">Balance: {balance} AVAX</div>
            <div className="text-lg">Claimable: {claimableTokens} AVAX</div>
            <Button
              onClick={() =>
                claimTokens(
                  address,
                  deviceId,
                  claimableTokens,
                  setIsClaiming,
                  setClaimableTokens
                )
              }
              disabled={claimableTokens === "0.0" || isClaiming}
              className="w-full"
            >
              <Coins className="h-4 w-4 mr-2" />
              {isClaiming ? "Claiming..." : "Claim Tokens"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
