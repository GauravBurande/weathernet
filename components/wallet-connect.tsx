"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ExternalLink, CheckCircle, AlertCircle, Coins } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string | null
  chainId: number | null
}

export function WalletConnect() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    chainId: null,
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimableTokens, setClaimableTokens] = useState("0.0")
  const { toast } = useToast()

  // Avalanche Fuji Testnet Chain ID
  const FUJI_CHAIN_ID = 43113

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
          })

          setWallet({
            isConnected: true,
            address: accounts[0],
            balance: (Number.parseInt(balance, 16) / 1e18).toFixed(4),
            chainId: Number.parseInt(chainId, 16),
          })

          // Simulate checking claimable tokens
          setClaimableTokens("2.5")
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet not found",
        description: "Please install MetaMask or another Ethereum wallet",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      // Switch to Avalanche Fuji Testnet
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${FUJI_CHAIN_ID.toString(16)}` }],
        })
      } catch (switchError: any) {
        // If the chain doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${FUJI_CHAIN_ID.toString(16)}`,
                chainName: "Avalanche Fuji Testnet",
                nativeCurrency: {
                  name: "AVAX",
                  symbol: "AVAX",
                  decimals: 18,
                },
                rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
                blockExplorerUrls: ["https://testnet.snowtrace.io/"],
              },
            ],
          })
        }
      }

      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })

      setWallet({
        isConnected: true,
        address: accounts[0],
        balance: (Number.parseInt(balance, 16) / 1e18).toFixed(4),
        chainId: FUJI_CHAIN_ID,
      })

      // Simulate checking claimable tokens
      setClaimableTokens("2.5")

      toast({
        title: "Wallet connected",
        description: "Successfully connected to Avalanche Fuji Testnet",
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const claimTokens = async () => {
    if (!wallet.isConnected) return

    setIsClaiming(true)
    try {
      // Simulate contract interaction for claiming tokens
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Tokens claimed!",
        description: `Successfully claimed ${claimableTokens} AVAX tokens`,
      })

      setClaimableTokens("0.0")

      // Refresh balance
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [wallet.address, "latest"],
      })

      setWallet((prev) => ({
        ...prev,
        balance: (Number.parseInt(balance, 16) / 1e18).toFixed(4),
      }))
    } catch (error) {
      console.error("Error claiming tokens:", error)
      toast({
        title: "Claim failed",
        description: "Failed to claim tokens",
        variant: "destructive",
      })
    } finally {
      setIsClaiming(false)
    }
  }

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      balance: null,
      chainId: null,
    })
    setClaimableTokens("0.0")
    toast({
      title: "Wallet disconnected",
      description: "Successfully disconnected wallet",
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isCorrectNetwork = wallet.chainId === FUJI_CHAIN_ID

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet & Token Claims
        </CardTitle>
        <CardDescription>Connect your wallet to claim AVAX rewards from your weather nodes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!wallet.isConnected ? (
          <Button onClick={connectWallet} disabled={isConnecting} className="w-full">
            <Wallet className="h-4 w-4 mr-2" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Connected</span>
                </div>
                <div className="text-sm text-muted-foreground font-mono">{formatAddress(wallet.address!)}</div>
              </div>
              <Button variant="outline" size="sm" onClick={disconnectWallet}>
                Disconnect
              </Button>
            </div>

            {!isCorrectNetwork && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">Please switch to Avalanche Fuji Testnet</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Balance</div>
                <div className="font-mono text-lg">{wallet.balance} AVAX</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Network</div>
                <Badge variant={isCorrectNetwork ? "default" : "destructive"}>
                  {isCorrectNetwork ? "Fuji Testnet" : "Wrong Network"}
                </Badge>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium">Claimable Rewards</div>
                  <div className="text-sm text-muted-foreground">Earned from your weather nodes</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg">{claimableTokens} AVAX</div>
                </div>
              </div>

              <Button
                onClick={claimTokens}
                disabled={!isCorrectNetwork || Number.parseFloat(claimableTokens) === 0 || isClaiming}
                className="w-full"
              >
                <Coins className="h-4 w-4 mr-2" />
                {isClaiming ? "Claiming..." : "Claim Rewards"}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              <a
                href={`https://testnet.snowtrace.io/address/${wallet.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                View on Snowtrace
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
