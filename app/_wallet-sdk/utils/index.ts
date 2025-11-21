export function shortenEthAddress(addr: string | null | undefined, front = 6, back = 6, ellipsis = "...") {
  if (!addr && addr !== "") return "";
  const s = String(addr).trim();
  if (s.length <= front + back) return s;

  // 如果以 0x 开头，我们仍把它算作字符的一部分（可改）
  return `${s.slice(0, front)}${ellipsis}${s.slice(-back)}`;
}