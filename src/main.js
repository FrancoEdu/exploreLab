import "./css/index.css"
import IMask from "imask"


const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path") //querySelector = faça a busca pelo query
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["DF6F29", "C69347"],
    default: ["0D6F5D", "C3129C"],
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")

const securityCodePattern = {
  mask:"0000"
}

const securityCodeMasked = IMask(securityCode,securityCodePattern) 

const expirationDate = document.querySelector("#expiration-date")

const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks:{
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY:{
      mask: IMask.MaskedRange,
      from:String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(expirationDate,expirationDatePattern)


const carNumber = document.querySelector("#card-number")
const carNumberPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\s{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "master",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: function(appended,dinamicMasked){
    const number = (dinamicMasked.value + appended).replace(/\D/g,'')
    const foundMask = dinamicMasked.compileMasks.find(function (item){
      return number.match(item.regex)
    })
    return foundMask
  },
}

const carNumberMasked = IMask(carNumber,carNumberPatter)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {   //arrow function, quando notar o click dispara a funcção
  alert("Cartão Adicionado")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

//alterando o que foi digitado no campo input no text de FULANO
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText = cardHolder.value.length === 0 ? 
  "FULANO DA SILVA" : cardHolder.value
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity,innerText = code.length === 0 ? "123" : code
}

carNumberMasked.on("accept", () => {
  const cardType = carNumberMasked.masked.currentMask.cardType
  setCardType()
  updateCardNumber(carNumberMasked.value)
})

function updateCardNumber(number){
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}


expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
  const ccExpiration = document.querySelector(".cc-extra .value")

  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}