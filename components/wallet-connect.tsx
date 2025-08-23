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
import { useToast } from "@/hooks/use-toast";

export function WalletConnect() {
  const { toast } = useToast();
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0.0");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimableTokens, setClaimableTokens] = useState("0.0");

  const FUJI_CHAIN_ID = "0xa869"; // Avalanche Fuji Testnet chainId (hex)

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "No Wallet Found",
        description: "Install MetaMask to continue",
        variant: "destructive",
      });
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
      setClaimableTokens("2.5"); // demo rewards

      toast({
        title: "Wallet Connected",
        description: "Connected to Fuji Testnet",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Connection Failed",
        description: "Try again",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const claimTokens = async () => {
    if (!address) return;
    setIsClaiming(true);
    try {
      await new Promise((r) => setTimeout(r, 2000)); // fake delay

      toast({
        title: "Claim Successful",
        description: `You claimed ${claimableTokens} AVAX`,
      });
      setClaimableTokens("0.0");
    } catch (err) {
      console.error(err);
      toast({
        title: "Claim Failed",
        description: "Try again",
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance("0.0");
    setClaimableTokens("0.0");
    toast({
      title: "Wallet Disconnected",
      description: "You have disconnected your wallet",
    });
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
              onClick={claimTokens}
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
