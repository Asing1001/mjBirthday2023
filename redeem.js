function redeem() {
  const code = document.getElementById("passcode").value;
  if (code === '0511') {
    document.getElementById('redeemBlock').style.display = 'none';
    document.getElementById('giftBlock').style.display = 'block';
  }
}