var color_card_deck = []; //represent the array of color choose after using 'colorChanger'
var colors = ["yellow", "blue", "red", "green", "null"]; //represent the colors of card that availabe
var types = [1, 3, 4, 5, 6, 7, 8, 9, "changesDirection", "2plush", "stop", "taki", "colorChanger"]; //represent the kinds of card that availabe
var cardsInCashier = 50; // represent the amount of cards of the deck
var deck = []; // represent an array of card's deck  
var TableDeck = []; //array that represent only the card that throwed to the table   
var turn = -1; //represent which player turn to play, -1 is the first player and +1 is the second 
var garbage_deck = []; //represent the 'garbage' deck of cards that has been trown by players 
var counter = 0; //represent the amount of cards that exist in any level   
var player1 = {
    my_cards: [] //represnt the cards array of player number 1
}
var player2 = {
    my_cards: [] //represnt the cards array of player number 2
}

var timer = 10; //set the amount of time that the player can play
var count_time_down;
var selected_color;

var red_count;
var green_count;
var yellow_count;
var blue_count;
create_html();

function saveToStorage() {
    localStorage.setItem("player1.my_cards", JSON.stringify(player1.my_cards));
    console.log(localStorage["player1.my_cards"]);
    localStorage.setItem("player2.my_cards", JSON.stringify(player2.my_cards));
    console.log(localStorage["player2.my_cards"]);
    localStorage.setItem("TableDeck", JSON.stringify(TableDeck));
    console.log(localStorage["TableDeck"]);
    localStorage.setItem("garbage_deck", JSON.stringify(garbage_deck));
    console.log(localStorage["garbage_deck"]);
    localStorage.setItem("turn", JSON.stringify(turn));
    console.log(localStorage["turn"]);
    localStorage.setItem("timer", JSON.stringify(timer));
    console.log(localStorage["timer"]);
    localStorage.setItem("deck", JSON.stringify(deck));
    console.log(localStorage["deck"]);
    localStorage.setItem("counter", JSON.stringify(counter));
    console.log(localStorage["counter"]);
}

function userCanClick(boolean) {
    if (boolean == 1) {
        document.getElementById("right").style.pointerEvents = "auto";
        document.getElementById("TableDeck").style.pointerEvents = "auto";
    } else { //user can't click on anything while it's the computer's turn
        document.getElementById("right").style.pointerEvents = "none";
        document.getElementById("TableDeck").style.pointerEvents = "none";
    }
}

function start() // this function start by the right order the methods of the taki game 
{
    if (localStorage.length > 0) {

        //temporrary 
        tmp_player1 = JSON.parse(localStorage.getItem("player1.my_cards"));
        tmp_player2 = JSON.parse(localStorage.getItem("player2.my_cards"));
        tmp_table = JSON.parse(localStorage.getItem("TableDeck"));
        tmp_garbage = JSON.parse(localStorage.getItem("garbage_deck"));
        tmp_deck = JSON.parse(localStorage.getItem("deck"));

        for (var i = 0; i < tmp_player1.length; i++) { //set player1 deck
            player1.my_cards.push(new Card(tmp_player1[i].type, tmp_player1[i].color, tmp_player1[i].img));
        }
        for (var i = 0; i < tmp_player2.length; i++) { //set player2 deck
            player2.my_cards.push(new Card(tmp_player2[i].type, tmp_player2[i].color, tmp_player2[i].img));
        }

        for (var i = 0; i < tmp_garbage.length; i++) { //set the garbage
            garbage_deck.push(new Card(tmp_garbage[i].type, tmp_garbage[i].color, tmp_garbage[i].img))
        }

        for (var i = 0; i < tmp_deck.length; i++) { //set the deck
            deck.push(new Card(tmp_deck[i].type, tmp_deck[i].color, tmp_deck[i].img))
        }

        //set the card that in the middle be regular card again from json
        TableDeck[0] = new Card(tmp_table[0].type, tmp_table[0].color, tmp_table[0].img);
        counter = JSON.parse(localStorage.getItem("counter"));
        turn = JSON.parse(localStorage.getItem("turn"));

        //set the table images
        for (var i = 0; i < player1.my_cards.length; i++) {
            document.getElementById("player1").innerHTML += player1.my_cards[i].img;
        }
        for (var i = 0; i < player2.my_cards.length; i++) {
            document.getElementById("player2").innerHTML += player2.my_cards[i].img;
        }

        for (var i = 0; i < colors.length - 1; i++) // create the colors cards
        {
            color_card_deck[i] = new Card(null, colors[i], "<img onclick='color_selected(" + i + ")' src='images/" + colors[i] + ".jpeg' />");
        }

        if (TableDeck[0].type == "colorChanger") //in case that color change card puted an not selected a color yet
        {
            if (JSON.parse(localStorage.getItem("selected_color")) == null) {
                color_change_putted();
                alert("You left before picking a color")
                turn *= -1;
            } else {
                alert("You left after the color " + JSON.parse(localStorage.getItem("selected_color")) + " was picked")
                document.getElementById("TableDeck").innerHTML = JSON.parse(localStorage.getItem("selected_color"));
                TableDeck[0].color = JSON.parse(localStorage.getItem("selected_color"));
                document.getElementById("TableDeck").innerHTML = "<img onclick='cashier_clicked()' src='images/cashier.jpg' />" + "<img src='images/" + JSON.parse(localStorage.getItem("selected_color")) + ".jpeg' />";
            }
            //turn *= -1; // to keep  the turn in the right order
        }

        show_turn();
        if (TableDeck[0].type != "colorChanger") {
            document.getElementById("TableDeck").innerHTML += "<img onclick='cashier_clicked()' src='images/cashier.jpg' />"; //שם את התמונה של החפיסה יחד עם פונקציה שמחלקת קלפים לשחקן הרלוונטי
            document.getElementById("TableDeck").innerHTML += TableDeck[0].img;
        }
        turn_func();

    } else {
        createDeck();
        shuffle();
        split_cards_to_players();
        while (deck[33].type == "colorChanger") { // מוודא שהקלף הפותח לא יהיה מסוג שנה צבע
            shuffle();
        }
        document.getElementById("TableDeck").innerHTML += "<img onclick='cashier_clicked()' src='images/cashier.jpg' />"; //שם את התמונה של החפיסה יחד עם פונקציה שמחלקת קלפים לשחקן הרלוונטי
        document.getElementById("TableDeck").innerHTML += deck[--counter].img; //מציג את הקלף הראשון שיש בחבילה להתחיל לשחק עליו
        TableDeck.push(deck.pop()); //הוצאת הקלף שפתוח בקופה ממערך הקלפים
        show_turn();
    }
}

function Card(type, color, img) // a contractore that gets type and color of a card clicked and the image of the card
{
    this.type = type;
    this.color = color;
    this.img = img;
}
Card.prototype.isEqualColor = function(c) //checks if the colors are the same
    {
        if (this.color === c)
            return true;
    }
Card.prototype.isEqualType = function(t) //checks if the type are the same
    {
        if (this.type === t)
            return true;
    }

function createDeck() // creates deck of 50 cards 
{
    for (var i = 0; i < types.length - 1; i++) {
        for (var j = 0; j < colors.length - 1; j++) {
            this.deck[counter++] = new Card(types[i], colors[j], "<img onclick='clicked(" + i + "," + j + ")' src='images/" + types[i] + "_" + colors[j] + ".jpg' />");
        }
    }
    this.deck[counter++] = new Card("colorChanger", null, "<img onclick='clicked(12,4)' src='images/color_changer.jpg' />"); //מייצר את הקלף של שנה צבע
    this.deck[counter++] = new Card("colorChanger", null, "<img onclick='clicked(12,4)' src='images/color_changer.jpg' />"); //מייצר את הקלף של שנה צבע
    for (var i = 0; i < colors.length - 1; i++) {
        color_card_deck[i] = new Card(null, colors[i], "<img onclick='color_selected(" + i + ")' src='images/" + colors[i] + ".jpeg' />");
    }
}

function shuffle() // this function is shuffling the cards - tooks from the internet
{
    array = this.deck;
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}

function split_cards_to_players() //splits 8 cards to each player 
{
    for (var i = 0; i < 8; i++) {
        player1.my_cards.push(deck[i]);
        document.getElementById("player1").innerHTML += deck[i].img;
        deck.splice(i, 1);
        counter--;
    }
    for (var i = 0; i < 8; i++) {
        player2.my_cards.push(deck[i]);
        cover();
        document.getElementById("player2").innerHTML += deck[i].img;
        deck.splice(i, 1);
        counter--;
    }
}

function clicked(x, y) //this function is operates when card been clicked - x is index of type and y is index of color
{
    if (TableDeck[0].type == "colorChanger" && TableDeck[0].color == null) //check that if change color puted so a color selected
    {
        alert("must choose color!");
        return;
    }
    console.log(types[x], colors[y]);
    if (turn < 0) //checks which turn of player is 
    {
        clearInterval(count_time_down); //means that the player1 has played
        timer = 10;
        for (var i = 0; i < player1.my_cards.length; i++) {
            if ((player1.my_cards[i].isEqualColor(colors[y]) && player1.my_cards[i].isEqualType(types[x])) || (types[x] == 'colorChanger' && player1.my_cards[i].color === null)) {
                if (TableDeck[0].isEqualType(types[x]) || TableDeck[0].isEqualColor(colors[y]) || types[x] == 'colorChanger') //בדיקה האם אחד מהתנאים מתקיים על הקלף שנבחר על ידי השחקן אל מול הקלף שעל השולחן, צבע או מספר
                {
                    garbage_deck.push(TableDeck.pop()); // throw from deck array and put it in the garbage array 
                    TableDeck.push(player1.my_cards[i]);
                    player1.my_cards.splice(i, 1);
                    turn *= -1;
                    if (TableDeck[0].type == "changesDirection" || TableDeck[0].type == "stop") {
                        turn *= -1;
                        check_winner();
                        break;
                    } else if (TableDeck[0].type == "2plush") {
                        cashier_clicked(1); //with skip is on
                        turn *= -1;
                        cashier_clicked(1); //with skip is on
                        turn *= -1;
                        check_winner();
                        break;
                    } else if (TableDeck[0].type == "taki") {
                        taki_puted(TableDeck[0], player1.my_cards);
                        check_winner();
                        break;
                    } else if (types[x] == "colorChanger") {
                        alert("choose a color to your opponent");
                        localStorage.removeItem("selected_color");
                        color_change_putted();
                        check_winner();
                        break;
                    }
                } else //means that the player clicked on ileagal card 
                {
                    cashier_clicked();
                    break;
                }
                break;
            }
        }
        show_turn();
        check_winner();
        show_my_cards();
        turn_func();
    } else {
        for (var i = 0; i < player2.my_cards.length; i++) {
            if ((player2.my_cards[i].isEqualColor(colors[y]) && player2.my_cards[i].isEqualType(types[x])) || (types[x] == 'colorChanger' && player2.my_cards[i].color === null)) {
                if (TableDeck[0].isEqualType(types[x]) || TableDeck[0].isEqualColor(colors[y]) || types[x] == 'colorChanger') {
                    uncover(x, y); // uncover the cover of the bot's card
                    garbage_deck.push(TableDeck.pop());
                    TableDeck.push(player2.my_cards[i]);
                    player2.my_cards.splice(i, 1);
                    turn *= -1;
                    if (TableDeck[0].type == "changesDirection" || TableDeck[0].type == "stop") {
                        turn *= -1;
                        check_winner();
                        turn_func();
                        break;
                    } else if (TableDeck[0].type == "2plush") {
                        cashier_clicked(1); //with skip is on
                        turn *= -1;
                        cashier_clicked(1); //with skip is on
                        turn *= -1;
                        check_winner();
                        break;
                    } else if (TableDeck[0].type == "taki") {
                        taki_puted(TableDeck[0], player2.my_cards); //send to the method of open taki  
                        check_winner();
                        break;
                    } else if (types[x] == "colorChanger") {
                        alert("choose a color to your opponent");
                        localStorage.removeItem("selected_color");
                        color_change_putted();
                        check_winner();
                        break;
                    }
                } else {
                    cashier_clicked();
                    break;
                }
                break;
            }
        }
        show_turn();
        check_winner();
        show_my_cards();
    }
    saveToStorage();
}

function cashier_clicked(skip) //this function called by clicking on the cashier and gives to the correct player a card from the deck array
{
    clearInterval(count_time_down); //means that the player has played
    if (TableDeck[0].type == "colorChanger" && TableDeck[0].color == null) {
        alert("must choose color!");
        return;
    }
    if (deck.length < 1) {
        if (garbage_deck.length == 0) {
            alert("there is no cards left in the cashier!");
            return;
        }
        this.deck = this.deck.concat(garbage_deck);
        shuffle();
        garbage_deck = [];
    }
    if (turn < 0) {
        player1.my_cards.push(deck.pop());
        document.getElementById("player1").innerHTML += player1.my_cards[player1.my_cards.length - 1].img;
        turn *= -1;
        show_turn();
        counter--;
        //show_my_cards();
        if (skip != 1) { //it means that we applied the 2+ card so we dont want that 'turn_func()' worked automaticlly so we prevent it by the sing 'skip'
            turn_func();
        }
    } else {
        player2.my_cards.push(deck.pop());
        cover();
        document.getElementById("player2").innerHTML += player2.my_cards[player2.my_cards.length - 1].img;
        turn *= -1;
        show_turn();
        counter--;
        //show_my_cards();
        turn_func();
    }
}

function show_my_cards() // shows the current cards that exist of each player 
{
    document.getElementById("player1").innerHTML = "";
    document.getElementById("player2").innerHTML = "";
    if (TableDeck[0].type != "colorChanger") {
        document.getElementById("TableDeck").innerHTML = "<img onclick='cashier_clicked()' src='images/cashier.jpg' />";
        document.getElementById("TableDeck").innerHTML += TableDeck[0].img;
    }

    for (var i = 0; i < player1.my_cards.length; i++) {
        document.getElementById("player1").innerHTML += player1.my_cards[i].img;
    }
    for (var i = 0; i < player2.my_cards.length; i++) {
        document.getElementById("player2").innerHTML += player2.my_cards[i].img;
    }
}

function show_turn() //this function shows which player turn to play whith a pointer of an image
{
    if (this.turn < 0) {
        document.getElementById("pointer1").innerHTML = "<img src='images/pointer2.png' />";
        document.getElementById("pointer2").innerHTML = "";
        clearInterval(count_time_down);
        timer_func(); //apllying the timer for the player
        userCanClick(1);
    } else {
        clearInterval(count_time_down); //means that the player1 has played
        timer = 10;
        document.getElementById("timer").innerHTML = "";
        document.getElementById("pointer1").innerHTML = "";
        document.getElementById("pointer2").innerHTML = "<img src='images/pointer2.png' />";
        userCanClick(0);
    }
    saveToStorage(); //saves every step
}

function taki_puted(taki_type, player_deck) //this method get the player deck and put all the cards that stands in the terms in his deck
{
    for (var i = 0; i < player_deck.length; i++) {
        if (player_deck[i].color == taki_type.color) {
            garbage_deck.push(TableDeck.pop());
            TableDeck.push(player_deck[i]);
            uncover(types.indexOf(player_deck[i].type), colors.indexOf(player_deck[i].color));
            console.log(player_deck[i].type, player_deck[i].color);
            player_deck.splice(i, 1);
            i--;
            console.log(i);
            show_my_cards();
        }
    }
}

function check_winner() //check if any of the player left with no cards in his deck
{
    if (player1.my_cards.length == 0) {
        clearInterval(count_time_down);
        alert("You are the winner!!");
        restart();
        return;
    } else if (player2.my_cards.length == 0) {
        clearInterval(count_time_down);
        alert("The computer is the winner!!");
        restart();
        return;
    }
}

function color_selected(color_index) // get a color that picked by the player
{
    document.getElementById("colorDeck").innerHTML = "";
    alert("color selected " + colors[color_index]);
    TableDeck[0].color = colors[color_index];
    document.getElementById("TableDeck").innerHTML = "<img onclick='cashier_clicked()' src='images/cashier.jpg' />" + "<img src='images/" + colors[color_index] + ".jpeg' />";
    localStorage.setItem("selected_color", JSON.stringify(colors[color_index]));
    turn *= -1;
    show_turn();
    turn_func();
}

function color_change_putted() // print to the screen the possibality colors that can be choose 
{
    for (var i = 0; i < colors.length - 1; i++) {
        document.getElementById("colorDeck").innerHTML += color_card_deck[i].img;
    }
    turn *= -1;
}

function restart() // reset to default the necessery variables and start the game again
{
    localStorage.clear();
    turn = -1;
    deck = [];
    TableDeck = [];
    garbage_deck = [];
    counter = 0;
    player1.my_cards = [];
    player2.my_cards = [];
    document.getElementById("player1").innerHTML = "";
    document.getElementById("player2").innerHTML = "";
    document.getElementById("colorDeck").innerHTML = "";
    document.getElementById("TableDeck").innerHTML = ""; //שם את התמונה של החפיסה יחד עם פונקציה שמחלקת קלפים לשחקן הרלוונטי
    clearInterval(count_time_down);
    timer = 10; //set the amount of time that the player can play
    start();
    //location.reload();//took from w3
}

function create_html() // creates the HTML 
{
    var container = document.createElement("div");
    container.id = "container";
    container.setAttribute("class", "container-fluid")

    var title = document.createElement("img");
    title.src = 'images/taki_logo.png';
    title.id = "title";

    var col1_title = document.createElement("div");
    col1_title.setAttribute("class", "col m-auto")

    var row1_title = document.createElement("div");
    row1_title.setAttribute("class", "row")

    var main = document.createElement("div");
    main.setAttribute("class", "row m-auto");

    var left = document.createElement("div");
    left.setAttribute("class", "col-12 col-md-5");
    left.id = 'left';
    var center = document.createElement("div");
    left.style.pointerEvents = "none";
    center.setAttribute("class", "col-12 col-md-2");

    var right = document.createElement("div");
    right.id = "right";
    right.setAttribute("class", "col-12 col-md-5");

    var computer = document.createElement("p");
    computer.innerHTML = "Computer";

    var computer_table = document.createElement("table");

    var computer_tr = document.createElement("tr");

    var computer_td = document.createElement("td");

    var player2 = document.createElement("div");
    player2.id = "player2";

    var pointer2 = document.createElement("td");
    pointer2.id = "pointer2";

    var dealer = document.createElement("p");
    dealer.innerHTML = "Dealer";

    var dealer_table = document.createElement("table");

    var dealer_tr = document.createElement("tr");

    var dealer_td = document.createElement("td");

    var deck = document.createElement("div");
    deck.id = "Deck";

    var dealer_tr2 = document.createElement("tr");

    var dealer_td2 = document.createElement("td");

    var tabledeck = document.createElement("div");
    tabledeck.id = "TableDeck";

    var dealer_tr3 = document.createElement("tr");

    var dealer_td3 = document.createElement("td");

    var colordeck = document.createElement("div");
    colordeck.id = "colorDeck";

    var restart_button = document.createElement("input");
    restart_button.setAttribute("type", "button");
    restart_button.id = "restart";
    restart_button.value = "Restart";
    restart_button.onclick = restart;

    var player1_title = document.createElement("p");
    player1_title.innerHTML = "Player";

    var player1_table = document.createElement("table");

    var player1_tr = document.createElement("tr");

    var player1_td = document.createElement("td");

    var player1_tr2 = document.createElement("tr");
    var player1_td2 = document.createElement("td");
    var player1_timer = document.createElement("h2");
    player1_timer.id = 'timer';

    var player1_div = document.createElement("div");
    player1_div.id = "player1";

    var pointer1 = document.createElement("td");
    pointer1.id = "pointer1";


    document.body.appendChild(container);
    container.appendChild(row1_title);
    container.appendChild(main);
    row1_title.appendChild(col1_title);
    col1_title.appendChild(title);
    main.appendChild(left);
    main.appendChild(center);
    main.appendChild(right);

    left.appendChild(computer);
    left.appendChild(computer_table);
    computer_table.appendChild(computer_tr);
    computer_tr.appendChild(computer_td);
    computer_tr.appendChild(pointer2);
    computer_td.appendChild(player2);


    center.appendChild(dealer);
    center.appendChild(dealer_table);
    dealer_table.appendChild(dealer_tr);
    dealer_tr.appendChild(dealer_td);
    dealer_td.appendChild(deck);
    dealer_table.appendChild(dealer_tr2);
    dealer_tr2.appendChild(dealer_td2);
    dealer_td2.appendChild(tabledeck);
    dealer_table.appendChild(dealer_tr3);
    dealer_tr3.appendChild(dealer_td3);
    dealer_td3.appendChild(colordeck);
    center.appendChild(restart_button);

    right.appendChild(player1_title);
    right.appendChild(player1_table);
    player1_table.appendChild(player1_tr);
    player1_tr.appendChild(player1_td);
    player1_td.appendChild(player1_div);
    player1_table.appendChild(player1_tr2);
    player1_tr2.appendChild(player1_td2);
    player1_tr.appendChild(pointer1);
    player1_td2.appendChild(player1_timer);
}

function computer(computer_player_deck) {
    color_counter();
    for (var i = 0; i < computer_player_deck.length; i++) //check if there is a taki card
    {
        if (computer_player_deck[i].type == "taki" && (TableDeck[0].isEqualType(computer_player_deck[i].type) || TableDeck[0].isEqualColor(computer_player_deck[i].color))) //has a taki card
        {
            if (Math.max(yellow_count, green_count, blue_count, red_count) > 2) //means that there is some card color above 2
            {
                if (computer_player_deck[i].color == "yellow" && yellow_count > 2) {
                    clicked(11, 0);
                } else if (computer_player_deck[i].color == "blue" && blue_count > 2) {
                    clicked(11, 1);
                } else if (computer_player_deck[i].color == "red" && red_count > 2) {
                    clicked(11, 2);
                } else if (computer_player_deck[i].color == "green" && green_count > 2) {
                    clicked(11, 3);
                } else {
                    break;
                }

            } else //means that there is not some card color above 2 and continue to the rest of the list
            {
                break;
            }
            return;
        }
    }
    for (var i = 0; i < computer_player_deck.length; i++) //check if there is has a stop card
    {
        if (computer_player_deck[i].type == "stop" && (TableDeck[0].isEqualType(computer_player_deck[i].type) || TableDeck[0].isEqualColor(computer_player_deck[i].color))) //has a stop card
        {
            type_index = types.indexOf(computer_player_deck[i].type); //gives the index of type
            color_index = colors.indexOf(computer_player_deck[i].color); //gives the index of color

            clicked(type_index, color_index); //sending to clicked function the idexes that represent a card
            return;
        }
    }
    for (var i = 0; i < computer_player_deck.length; i++) //check if there is has a change direction card
    {
        if (computer_player_deck[i].type == "changesDirection" && (TableDeck[0].isEqualType(computer_player_deck[i].type) || TableDeck[0].isEqualColor(computer_player_deck[i].color))) //has a change direction card
        {
            type_index = types.indexOf(computer_player_deck[i].type); //gives the index of type
            color_index = colors.indexOf(computer_player_deck[i].color); //gives the index of color

            clicked(type_index, color_index); //sending to clicked function the idexes that represent a card
            return;
        }
    }
    for (var i = 0; i < computer_player_deck.length; i++) //check if there is has a 2+ card
    {
        if (computer_player_deck[i].type == "2plush" && (TableDeck[0].isEqualType(computer_player_deck[i].type) || TableDeck[0].isEqualColor(computer_player_deck[i].color))) //has a 2+ card
        {
            type_index = types.indexOf(computer_player_deck[i].type); //gives the index of type
            color_index = colors.indexOf(computer_player_deck[i].color); //gives the index of color

            clicked(type_index, color_index); //sending to clicked function the idexes that represent a card

            return;
        }
    }
    for (var i = 0; i < computer_player_deck.length; i++) //check if there is has a card with the same color
    {
        if (TableDeck[0].isEqualColor(computer_player_deck[i].color)) //if has the same color card
        {
            type_index = types.indexOf(computer_player_deck[i].type); //gives the index of type
            color_index = colors.indexOf(computer_player_deck[i].color); //gives the index of color

            clicked(type_index, color_index); //sending to clicked function the indexes that represent a card
            return;
        }
    }
    for (var i = 0; i < computer_player_deck.length; i++) //check if there is has a card with the same type
    {
        if (TableDeck[0].isEqualType(computer_player_deck[i].type)) //has a the same type card
        {
            type_index = types.indexOf(computer_player_deck[i].type); //gives the index of type
            color_index = colors.indexOf(computer_player_deck[i].color); //gives the index of color

            clicked(type_index, color_index); //sending to clicked function the idexes that represent a card
            return;
        }
    }
    for (var i = 0; i < computer_player_deck.length; i++) //check if there is has a change color card
    {
        if (computer_player_deck[i].type == "colorChanger") //has a the change color card
        {
            clicked(12, 4);

            var most_color_arr = [yellow_count, blue_count, red_count, green_count];
            var index_of_most_color = indexOfMax(most_color_arr);

            switch (index_of_most_color) //send to change color function the correct color
            {
                case 0:
                    color_selected(0);
                    break;
                case 1:
                    color_selected(1);
                    break;
                case 2:
                    color_selected(2);
                    break;
                case 3:
                    color_selected(3);
                    break;

            } //end of switch and case
            return;
        }
    }
    cashier_clicked(); //has no card to put so need to take card from the cashier
}

function indexOfMax(arr) { //https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array/11301464
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function turn_func() //check whos turn it is and appling the bot if it his turn
{
    if (turn < 0) {
        console.log("turn is player 1");
    } else {
        console.log("turn is player 2");
        const computer_timer = setTimeout("computer(player2.my_cards)", 2000);
    }
} //to make the bot play

function cover() //cover all the bot's cards
{
    for (var i = 0; i < player2.my_cards.length; i++) {
        var x = player2.my_cards[i].type;
        var y = colors.indexOf(player2.my_cards[i].color);
        player2.my_cards[i].img = "<img onclick='clicked(" + x + "," + y + ")' src='images/card_back.png' />";
    }
}

function uncover(x, y) //finding the card that the bot throwed and uncovering him
{
    for (var i = 0; i < player2.my_cards.length; i++) {
        if (player2.my_cards[i].type == types[x] && player2.my_cards[i].color == colors[y]) {
            player2.my_cards[i].img = "<img onclick='clicked(" + x + "," + y + ")' src='images/" + types[x] + "_" + colors[y] + ".jpg' />";
            break;
        }
    }
}

function timer_func() {
    count_time_down = setInterval(function() {
        timer--;
        document.getElementById("timer").innerHTML = "Remained " + timer + " seconds";

        if (timer < 0) {
            clearInterval(count_time_down);
            cashier_clicked();
            timer = 10;
        }
    }, 1000); // I have watched and used by that example https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_countdown
}

function color_counter() //utility to the computer to count the amount of colors
{
    red_count = 0;
    green_count = 0;
    yellow_count = 0;
    blue_count = 0;
    for (var i = 0; i < player2.my_cards.length; i++) {
        switch (player2.my_cards[i].color) //count the amount of each color of the array
        {
            case "yellow":
                yellow_count++;
                break;
            case "green":
                green_count++;
                break;
            case "blue":
                blue_count++;
                break;
            case "red":
                red_count++;
                break;
        } //end of switch and case
    }
}