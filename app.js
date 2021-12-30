document.getElementById("button").addEventListener("click", () => {
  let gold = parseFloat(document.getElementById("gold").value);
  let silver = parseFloat(document.getElementById("silver").value);
  let cssh = parseFloat(document.getElementById("cssh").value);
  let saving = parseFloat(document.getElementById("saving").value);
  let bussinesAc = parseFloat(document.getElementById("bussinesAc").value);
  let insurance = parseFloat(document.getElementById("insurance").value);
  let realState = parseFloat(document.getElementById("realState").value);
  let merchandiseInv = parseFloat(
    document.getElementById("merchandiseInv").value
  );
  let storckMutualFunds = parseFloat(
    document.getElementById("storckMutualFunds").value
  );
  let liabilities = parseFloat(document.getElementById("liabilities").value);

  let total =
    gold +
    silver +
    cssh +
    saving +
    bussinesAc +
    insurance +
    realState +
    merchandiseInv +
    storckMutualFunds +
    liabilities;
  let totalToFxed = total.toFixed(2);
  document.getElementById("sub").innerHTML = totalToFxed + " ৳";

  // let total = parseFloat(document.getElementById('sub').innerHTML=gold+silver+cssh+saving+bussinesAc+insurance+realState+merchandiseInv+storckMutualFunds + "৳");

  if (total < 437665) {
    alert("আপনার যাকাত ফরজ হয়নি। / Your Zakat is not Compulsory.");
  }
  if (total < 437000) {
    toFixedPayZaket = document.getElementById("payZakat").innerHTML = 00 + " ৳";
  }
  let payZakat = (total * 2.5) / 100;
  let toFixedPayZaket = payZakat.toFixed(2);
  document.getElementById("payZakat").innerHTML = toFixedPayZaket + " ৳";

  removeValue();
});

// Remve Value
function removeValue() {
  document.getElementById(gold).value = "";
}

// Dynamic Year for Footer

/*let date = new Date();
let year = date.getFullYear();
document.getElementById("year").innerHTML=year;*/
document.querySelector("#year").innerHTML = new Date().getFullYear();
