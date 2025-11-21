"use client"
import React from "react";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import {ConnetButton, WalletProvider} from './_wallet-sdk'
import theme from '../utils/theme'
import {chains as chains2, wallets as wallets2} from './_config'

interface ProviderProps {
  children: React.ReactNode
}
const Provider: React.FC<ProviderProps> = ({children}) => {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true}}>
      <ThemeProvider theme={theme}>
        <WalletProvider autoConnect chains={chains2} wallets={wallets2}>
          {children}
        </WalletProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}


// 0x53dcd07b90b6326dc0eaae84963b3100b0fe7963


export default Provider
