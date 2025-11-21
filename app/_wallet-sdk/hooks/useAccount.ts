import { useWallet } from "@/app/_wallet-sdk/provider"
const useAccount = ()=>{
  const {address, isConnected} = useWallet()
  return {address, isConnected}
}
export default useAccount