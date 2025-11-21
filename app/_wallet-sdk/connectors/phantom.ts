import type { Wallet } from "../types";
import { WATTET_EVENT_ACCOUNT_CHANGE, WATTET_EVENT_CHAIN_CHANGE } from "../const";
import { Connection, PublicKey } from "@solana/web3.js";

// Phantom 默认主网 RPC（你可修改成自己的）
const RPC_URL = "https://api.mainnet-beta.solana.com";

/** 生成 Provider（Solana Connection） */
const genProvider = async () => {
  const provider = new Connection(RPC_URL, "confirmed");

  // Phantom 没有 chainId 概念，用网络名称代替
  return {
    provider,
    chainID: "solana-mainnet",
  };
};

/** 连接 Phantom */
const connect = async () => {
  const phantom = window.phantom?.solana;
  if (!phantom || !phantom.isPhantom) throw new Error("Phantom wallet not installed");

  const res = await phantom.connect(); // 返回 publicKey

  const providerRes = await genProvider();

  return {
    provider: providerRes.provider,
    chainID: providerRes.chainID,
    address: res.publicKey.toString(),
    accounts: [res.publicKey.toString()],
  };
};

/** 断开 Phantom */
const disconnect = async () => {
  const phantom = window.phantom?.solana;
  if (!phantom || !phantom.isPhantom) return;
  await phantom.disconnect();
};

/** Solana 不支持切链，这里直接返回当前 provider */
const switchChain = async (chainId: string) => {
  return await genProvider();
};

/** 添加事件监听 */
const addEventListener = () => {
  const phantom = window.phantom?.solana;
  if (!phantom || !phantom.isPhantom) return;

  /** 账户切换监听 */
  phantom.on("accountChanged", async (publicKey: PublicKey | null) => {
    const providerRes = await genProvider();

    const address = publicKey ? publicKey.toString() : "";

    const event = new CustomEvent(WATTET_EVENT_ACCOUNT_CHANGE, {
      detail: {
        ...providerRes,
        accounts: address ? [address] : [],
        address,
      },
    });

    window.dispatchEvent(event);
  });

  /**
   * Phantom 暂无 chainChanged 事件
   * 这里我们仍然 dispatch 一次，保持结构一致性
   */
  phantom.on("networkChanged", async (network: string) => {
    const providerRes = await genProvider();

    const event = new CustomEvent(WATTET_EVENT_CHAIN_CHANGE, {
      detail: providerRes,
    });

    window.dispatchEvent(event);
  });
};

/** 移除监听 */
const removeEventListener = () => {
  const phantom = window.phantom?.solana;
  if (!phantom || !phantom.isPhantom) return;

  phantom.removeAllListeners("accountChanged");
  phantom.removeAllListeners("networkChanged");
};

const phantomWallet: Wallet = {
  id: "phantom",
  name: "Phantom Wallet",
  icon: "https://avatars.githubusercontent.com/u/78782331?s=200&v=4",
  connect,
  disconnect,
  switchChain,
  addEventListener,
  removeEventListener,
  description: "Phantom is a Solana wallet browser extension.",
  installed:
    typeof window !== "undefined" &&
    Boolean(window.phantom?.solana?.isPhantom),
  downloadLink: "https://phantom.app/",
};

export default phantomWallet;
