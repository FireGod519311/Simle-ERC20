import { Outlet } from "react-router-dom"
import Header from "./header"
import '@rainbow-me/rainbowkit/styles.css';

import {
    getDefaultConfig,
    RainbowKitProvider,
    darkTheme
  } from '@rainbow-me/rainbowkit';
  import { WagmiProvider } from 'wagmi';
  import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia,
  } from 'wagmi/chains';
  import {
    QueryClientProvider,
    QueryClient,
  } from "@tanstack/react-query";

const queryClient = new QueryClient()
const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });

const MainLayout = () => {
    return (
        <>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider modalSize="compact" theme={darkTheme({accentColor:'black'})}>
                        <Header />
                        <Outlet />
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider >
        </>
    )
}

export default MainLayout