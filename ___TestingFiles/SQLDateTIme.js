function getMySQLTimestamp() {
  const pad2 = (n) => String(n).padStart(2, '0');
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm   = pad2(now.getMonth() + 1); // getMonth() es 0-based
  const dd   = pad2(now.getDate());
  const hh   = pad2(now.getHours());
  const min  = pad2(now.getMinutes());
  const ss   = pad2(now.getSeconds());

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

module.exports = { getMySQLTimestamp };
