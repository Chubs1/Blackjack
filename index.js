//TK when there is bust, bust 21 its fucked
// and if there is a natural ugh
startingDeck = ["Ah", "Ad", "Ac", "As",
    "2h", "2d", "2c", "2s",
    "3h", "3d", "3c", "3s",
    "4h", "4d", "4c", "4s",
    "5h", "5d", "5c", "5s",
    "6h", "6d", "6c", "6s",
    "7h", "7d", "7c", "7s",
    "8h", "8d", "8c", "8s",
    "9h", "9d", "9c", "9s",
    "10h", "10d", "10c", "10s",
    "Jh", "Jd", "Jc", "Js",
    "Qh", "Qd", "Qc", "Qs",
    "Kh", "Kd", "Kc", "Ks"];

decks = 6
amountOfPlayers = 1
activePlayers = amountOfPlayers
players = []
cards = []
speed = 1/2
dealSpeed = 500 / speed // 0 is instant
newHandSpeed = 750 / speed
const game = document.getElementById("game")
let shouldItStart = true
// this is for if it happen twice in one hit



// get decks set up
shuffleDeck = () => {
    cards = []
for (let i = 0; i < decks; i++) {
    cards = cards.concat(startingDeck);
}
}       
shuffleDeck()


class player {
    number 
    hitButton
    standButton
    text
    handTotal = 0
    soft = 0
    money = 100
    cards = []
    standing = false
    busted = false
    natural = false
    bet = 0
}

dealer = {
    handTotal: 0,
    soft: 0,
    cards: [],
    busted: false,
    text: null,
    dealer: true,
    natural: false
}

betOutCome = (player) => {
    if(player.busted ){
        loseBet(player)
    } else
    if(dealer.natural && !player.natural){
        loseBet(player)
    } else

    if(!dealer.natural && player.natural){
        blackJack(player)
    } else
    if(player.handTotal > dealer.handTotal){
        winBet(player)
    } else
    if(player.standing && dealer.busted){
        winBet(player)
    } 
}

blackJack = (player) => {
    player.money += (player.bet*1.5)
}

loseBet = (player) => {
    player.money -= player.bet
}

winBet = (player) => {
    player.money += player.bet

}

showCard = (player) => {
    const card = document.createElement('div');
    card.className = 'card';
    currentCard = player.cards[player.cards.length-1]
    suit = currentCard[0][currentCard[0].length-1]
    if(suit == "c"){
        y = 0
    } else
    if(suit == "d"){
        y = -124.25
    } else
    if(suit == "h"){
        y = -124.25*2
    } else
    if(suit == "s"){
        y = -124.25*3
    }
    cardNumber = parseInt(currentCard)
    if(isNaN(cardNumber)){
        face = currentCard[0][0]
        if(face == "J"){
            x = -1130.71429
        }
        else 
        if(face == "Q"){
            x = -1243.78572
        }
        else 
        if(face == "K"){
            x = -1356.85715
        }
        else {
            x = 0
        }


    } else{
        x = -113.071429 * (cardNumber-1)
    }

    card.style.backgroundPosition = `${x}px ${y}px`

    player.cardContainer.append(card)

}

showDealerHidden =  () => {

    currentCard = dealer.cards[1]
    suit = currentCard[0][currentCard[0].length-1]
if(suit == "c"){
    y = 0
} else
if(suit == "d"){
    y = -124.25
} else
if(suit == "h"){
    y = -124.25*2
} else
if(suit == "s"){
    y = -124.25*3
}
cardNumber = parseInt(currentCard)
if(isNaN(cardNumber)){
    face = currentCard[0][0]
    if(face == "J"){
        x = -1130.71429
    }
    else 
    if(face == "Q"){
        x = -1243.78572
    }
    else 
    if(face == "K"){
        x = -1356.85715
    }
    else {
        x = 0
    }


} else{
    x = -113.071429 * (cardNumber-1)
}

    const hidden = document.getElementById("hidden")
    hidden.style.backgroundPosition = `${x}px ${y}px`

}

updateCard = (player) => {
    if(player.dealer && player.cards.length == 3){
        showDealerHidden()
    }
 
    
 
    if(player.dealer && player.cards.length == 2){
        const card = document.createElement('div');
        card.className = 'card';
        card.id = 'hidden'
        card.style.backgroundPosition = "113.071429px -124.25px"
        player.cardContainer.append(card)
    } else {
        player.text.innerHTML = player.handTotal
        showCard(player)
    }

    

}

dealCard = async (cards, player) => {
    if(player.dealer && player.cards.length > 1){
    await new Promise(resolve => setTimeout(resolve, dealSpeed));
    }
    card = cards.splice(Math.random() * cards.length, 1) 
    player.cards.push(card)

    if(["J", "Q", "K"].includes(card[0][0])){
        player.handTotal += 10
    }  
    else if(card[0][0] == "A"){
        player.handTotal += 11
            player.soft++
    } 
    else
    {
        player.handTotal += parseInt(card[0])
    }

    if(player.handTotal > 21 && player.soft > 0){
        player.soft--
        player.handTotal -= 10
    }
    if(player.handTotal > 21){
        bust(player)
    }
    if(player.handTotal == 21 && !player.dealer){

        player.hitButton.disabled = true
        player.standButton.disabled = true
        player.standing = true
        activePlayers--
        if(player.cards.length > 2){
            switchPlayer(players)
        } else {
            player.natural = true
        }
    }
        updateCard(player)
        
}

switchPlayer = async (players) => {
    console.log("Swithc!")
    currentPlayer = players.shift();
    console.log(currentPlayer)
    players.push(currentPlayer);
    currentPlayer = players[0]
    console.log(currentPlayer)
    if(!currentPlayer.busted && !currentPlayer.standing){
        currentPlayer.hitButton.disabled = false
        currentPlayer.standButton.disabled = false
    } else{
        if(activePlayers > 0){
            currentPlayer.hitButton.disabled = true
            currentPlayer.standButton.disabled = true
            switchPlayer(players)
        } else{
            await new Promise(resolve => setTimeout(resolve, dealSpeed));

            dealer.text.innerHTML = dealer.handTotal
            showDealerHidden()
            while(dealer.handTotal < 17){
                dealCard(cards, dealer)
                await new Promise(resolve => setTimeout(resolve, dealSpeed));
        }
        startGame(cards, true)
        }
    }

}


createPlayers = () => {
    for (let i = 0; i < amountOfPlayers; i++) {
        players.push(new player)
        players[i].number = i
        hitButton = document.createElement('button')
        hitButton.innerHTML = `Player ${i+1} Hit`
        standButton = document.createElement('button')
        standButton.innerHTML = `Player ${i+1} Stand`
        players[i].hitButton = hitButton
        players[i].standButton = standButton
        game.appendChild(hitButton)
        game.appendChild(standButton)
        players[i].hitButton.addEventListener("click", function() {

            dealCard(cards, players[0])
        });
    players[i].standButton.addEventListener("click", async function() {
    this.disabled = true
    
    currentPlayer = players[0]
    currentPlayer.standing = true
    currentPlayer.hitButton.disabled = true
    activePlayers--
    switchPlayer(players)
});

    }
    //dealer
    text = game.appendChild(document.createElement('p'))
    text.style.textAlign = 'center'
dealer.text = text
const container = document.createElement('div');
container.className = 'card-container';
container.id = 'dealer'
dealer.cardContainer = container
game.appendChild(container)
        for (let i = 0; i < amountOfPlayers; i++) {
        const container = document.createElement('div');
        container.className = 'card-container';
        container.id = `hand-${i}`;
        
        text = container.appendChild(document.createElement('p'))
        text.style.textAlign = 'center'
        players[i].text = text
        players[i].cardContainer = container
        
        game.appendChild(container)
}
}
createPlayers()
startGame =  async (cards, wait) => {
    
    if(shouldItStart){
        shouldItStart = false
    
        setTimeout(() => {
            console.log("strat")
            shouldItStart  = true;   
        }, 1000);

    activePlayers = amountOfPlayers
    if(wait){
       await new Promise(resolve => setTimeout(resolve, newHandSpeed));

    }
    console.log("start")
    for (let i = 0; i < amountOfPlayers; i++){
    console.log("??")
    players[i].text.innerHTML = ''
    players[i].handTotal = 0
    players[i].soft = 0
    players[i].cards = []
    players[i].standing = false
    players[i].busted = false
    players[i].natural = false
    players[i].bet = 0
    players[i].cardContainer.innerHTML = ''
    players[i].cardContainer.appendChild(players[i].text)
    }

    // reset dealer
    dealer.cardContainer.innerHTML = ''
    dealer.handTotal = 0
    dealer.soft = 0
    dealer.cards = []
    dealer.busted = false
    dealer.text.innerHTML = ''
    dealer.cardContainer.appendChild(dealer.text)
    dealer.dealer = true
    dealer.natural = false

    players.sort((a, b) => a.number - b.number);

    players[0].hitButton.disabled = false
    players[0].standButton.disabled = false
    for (let i = 1; i < amountOfPlayers; i++) {
        players[i].hitButton.disabled = true
        players[i].standButton.disabled = true
    }
      
    for (let i = 0; i < amountOfPlayers; i++) {
        dealCard(cards, players[i])
    }
    dealCard(cards, dealer)
    for (let i = 0; i < amountOfPlayers; i++) {
        dealCard(cards,players[i])
    }
    dealCard(cards, dealer)
    if(dealer.handTotal == 21 && ["J", "Q", "K", "1"].includes(dealer.cards[0][0][0])){
        dealer.natural = true
        players.forEach(player => {
            if(player.natural){
                //push TK
            } else{
                //lose TK
            }
            
        })
    } else
    if(dealer.handTotal == 21 && dealer.cards[0][0][0] == "A"){
                //offer insurance TK
                dealer.natural = true
                if(player.natural){
                    //push TK
                } else{
                    //lose TK
                }
    }
    if (players[0].handTotal == 21) {
        players[0].standing = true
        switchPlayer(players)
        console.log("player 1 has natural bj")
    }
}
}

bust = async (player) => {
    player.busted = true
    // lose bet TK
    activePlayers--
    if(!player.dealer){
    player.hitButton.disabled = true
    player.standButton.disabled = true
    }
    switchPlayer(players)
  
}
startGame(cards, false, true)