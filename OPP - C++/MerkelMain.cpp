#ifdef _WIN32       
    #include <windows.h>
#endif  
#include <algorithm>
#include <iostream>
#include <stdio.h>
#include <vector>
#include "Candlestick.h"         
#include "CandleDataGraphing.h" 
#include "CSVReader.h"  
#include "MerkelMain.h"
#include "OrderBookEntry.h"
#include "Wallet.h"
 
MerkelMain::MerkelMain()
{

}

void MerkelMain::init()
{
    int input;
    currentTime = orderBook.getEarliestTime();

    wallet.insertCurrency("BTC", 10);

    while(true)
    {
        printMenu();
        input = getUserOption();
        processUserOption(input);
    }
}


void MerkelMain::printMenu()
{
    // 1 print help
    std::cout << "1: Print help " << std::endl;
    // 2 print exchange stats
    std::cout << "2: Print exchange stats" << std::endl;
    // 3 make an offer
    std::cout << "3: Make an offer " << std::endl;
    // 4 make a bid 
    std::cout << "4: Make a bid " << std::endl;
    // 5 print wallet
    std::cout << "5: Print wallet " << std::endl;
    // 6 continue   
    std::cout << "6: Continue " << std::endl;
    // WRITTEN BY VILJAMAS SIMSONAS
    // 7 Print candle data 
    std::cout << "7: Print candle data " << std::endl;
    // 8 Draw candlesticks  
    std::cout << "8: Draw candlesticks " << std::endl;
    // 9 Draw volume graph   
    std::cout << "9: Draw volume graph " << std::endl;

    std::cout << "============== " << std::endl;

    std::cout << "Current time is: " << currentTime << std::endl;

}

void MerkelMain::printHelp()
{
    std::cout << "Help - your aim is to make money. Analyse the market and make bids and offers. " << std::endl;
}

void MerkelMain::printMarketStats()
{
    for (std::string const& p : orderBook.getKnownProducts())
    {
        std::cout << "Product: " << p << std::endl;
        std::vector<OrderBookEntry> entries = orderBook.getOrders(OrderBookType::ask, 
                                                                p, currentTime);
        std::cout << "Asks seen: " << entries.size() << std::endl;
        std::cout << "Max ask: " << OrderBook::getHighPrice(entries) << std::endl;
        std::cout << "Min ask: " << OrderBook::getLowPrice(entries) << std::endl;



    }
    // std::cout << "OrderBook contains :  " << orders.size() << " entries" << std::endl;
    // unsigned int bids = 0;
    // unsigned int asks = 0;
    // for (OrderBookEntry& e : orders)
    // {
    //     if (e.orderType == OrderBookType::ask)
    //     {
    //         asks ++;
    //     }
    //     if (e.orderType == OrderBookType::bid)
    //     {
    //         bids ++;
    //     }  
    // }    
    // std::cout << "OrderBook asks:  " << asks << " bids:" << bids << std::endl;

}

void MerkelMain::enterAsk()
{
    std::cout << "Make an ask - enter the amount: product,price, amount, eg  ETH/BTC,200,0.5" << std::endl;
    std::string input;
    std::getline(std::cin, input);

    std::vector<std::string> tokens = CSVReader::tokenise(input, ',');
    if (tokens.size() != 3)
    {
        std::cout << "MerkelMain::enterAsk Bad input! " << input << std::endl;
    }
    else {
        try {
            OrderBookEntry obe = CSVReader::stringsToOBE(
                tokens[1],
                tokens[2], 
                currentTime, 
                tokens[0], 
                OrderBookType::ask 
            );
            obe.username = "simuser";
            if (wallet.canFulfillOrder(obe))
            {
                std::cout << "Wallet looks good. " << std::endl;
                orderBook.insertOrder(obe);
            }
            else {
                std::cout << "Wallet has insufficient funds . " << std::endl;
            }
        }catch (const std::exception& e)
        {
            std::cout << " MerkelMain::enterAsk Bad input " << std::endl;
        }   
    }
}

void MerkelMain::enterBid()
{
    std::cout << "Make an bid - enter the amount: product,price, amount, eg  ETH/BTC,200,0.5" << std::endl;
    std::string input;
    std::getline(std::cin, input);

    std::vector<std::string> tokens = CSVReader::tokenise(input, ',');
    if (tokens.size() != 3)
    {
        std::cout << "MerkelMain::enterBid Bad input! " << input << std::endl;
    }
    else {
        try {
            OrderBookEntry obe = CSVReader::stringsToOBE(
                tokens[1],
                tokens[2], 
                currentTime, 
                tokens[0], 
                OrderBookType::bid 
            );
            obe.username = "simuser";

            if (wallet.canFulfillOrder(obe))
            {
                std::cout << "Wallet looks good. " << std::endl;
                orderBook.insertOrder(obe);
            }
            else {
                std::cout << "Wallet has insufficient funds . " << std::endl;
            }
        }catch (const std::exception& e)
        {
            std::cout << " MerkelMain::enterBid Bad input " << std::endl;
        }   
    }
}

void MerkelMain::printWallet()
{
    std::cout << wallet.toString() << std::endl;
}
        
void MerkelMain::gotoNextTimeframe()
{
    std::cout << "Going to next time frame. " << std::endl;
    for (std::string p : orderBook.getKnownProducts())
    {
        std::cout << "matching " << p << std::endl;
        std::vector<OrderBookEntry> sales =  orderBook.matchAsksToBids(p, currentTime);
        std::cout << "Sales: " << sales.size() << std::endl;
        for (OrderBookEntry& sale : sales)
        {
            std::cout << "Sale price: " << sale.price << " amount " << sale.amount << std::endl; 
            if (sale.username == "simuser")
            {
                // update the wallet
                wallet.processSale(sale);
            }
        }
        
    }

    currentTime = orderBook.getNextTime(currentTime);
}

// WRITTEN BY VILJAMAS SIMSONAS
// Prints candlestick data 
void MerkelMain::printCandleData()
{
    // Enables virtual terminal processing if program runs on Windows
    #ifdef _WIN32
       
        SetConsoleOutputCP(CP_UTF8);
        setvbuf(stdout, nullptr, _IOFBF, 1000);
        DWORD consoleMode;
        GetConsoleMode(GetStdHandle(STD_OUTPUT_HANDLE), &consoleMode);
        consoleMode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING;
        SetConsoleMode(GetStdHandle(STD_OUTPUT_HANDLE), consoleMode);
 
    #endif  

    // Get user input
    std::string input = "";
    
    std::cout << "ENTER << PRODUCT,ASK|BID >> TO PRINT CANDLE DATA" << std::endl << std::endl;

    std::getline (std::cin, input);
    
    // Creates vector of candlestick data
    std::vector<Candlestick> candlesticks = Candlestick::calculateCandlesticks(orderBook, input);
    
    std::cout << std::endl;

    // Prints data of each candle in the vector
    for (size_t i = 0; i < 5; ++i) {
        std::cout << "CandleStick " << i + 1 << "\n";
        std::cout << "High  → " << candlesticks[i].high  << "\n";        
        std::cout << "Open  → " << candlesticks[i].open  << "\n";
        std::cout << "Close → " << candlesticks[i].close << "\n";
        std::cout << "Low   → " << candlesticks[i].low   << "\n";
        std::cout << "Time  → " << candlesticks[i].date  << "\n";
        std::cout << "──────────────────────────\n";
    }
}

// WRITTEN BY VILJAMAS SIMSONAS 
// Draws candlesticks
void MerkelMain::drawCandlesticks()
{  
    // Get user input
    std::string input = "";
    
    std::cout << "ENTER << PRODUCT,ASK|BID >> TO DRAW CANDLESTICKS" << std::endl << std::endl;

    std::getline (std::cin, input);

    // Creates vector of all orderBook data based on pair/askOrBid input
    std::vector<Candlestick> candlestickVector = Candlestick::calculateCandlesticks(orderBook, input);

    // Creates 10 candlestick object subvector
    std::vector<Candlestick> candleSubvector(candlestickVector.begin() + 1, candlestickVector.begin() + 11);
    
    // Draws candlesticks 
    candleDataGraphing candlestickGraphObject;   

    candlestickGraphObject.drawCandlesticks(candleSubvector, input);//build a new graph for this group
}

// WRITTEN BY VILJAMAS SIMSONAS
// Draws volume graph 
void MerkelMain::drawVolumeGraph()
{
    // Get user input
    std::string input = "";
    
    std::cout << "ENTER << PRODUCT,ASK|BID >> TO DRAW VOLUME GRAPH" << std::endl << std::endl;

    std::getline (std::cin, input);

    // Creates vector of all orderBook data based on pair/askOrBid input    
    std::vector<Candlestick> candlestickVector = Candlestick::calculateCandlesticks(orderBook, input);

    // Creates 10 candlestick object subvector
    std::vector<Candlestick> candleSubvector(candlestickVector.begin() + 1, candlestickVector.begin() + 11);

    // Draws volume graph
    candleDataGraphing volumeGraphObject;

    volumeGraphObject.drawVolumeGraph(candleSubvector, input);
}

int MerkelMain::getUserOption()
{
    int userOption = 0;
    std::string line;
    std::cout << std::endl << "Type in 1-9" << std::endl << std::endl;
    std::getline(std::cin, line);
    try{
        userOption = std::stoi(line);
    }catch(const std::exception& e)
    {
        // 
    }
    std::cout << std::endl << "You chose: " << userOption << std::endl << std::endl;
    return userOption;
}

void MerkelMain::processUserOption(int userOption)
{
    if (userOption == 0) // bad input
    {
        std::cout << "Invalid choice. Choose 1-9" << std::endl;
    }
    if (userOption == 1) 
    {
        printHelp();
    }
    if (userOption == 2) 
    {
        printMarketStats();
    }
    if (userOption == 3) 
    {
        enterAsk();
    }
    if (userOption == 4) 
    {
        enterBid();
    }
    if (userOption == 5) 
    {
        printWallet();
    }
    if (userOption == 6) 
    {
        gotoNextTimeframe();
    }
    // WRITTEN BY VILJAMAS SIMSONAS
    if (userOption == 7) 
    {
        printCandleData();
    }
    if (userOption == 8) 
    {
        drawCandlesticks();
    }
    if (userOption == 9) 
    {
        drawVolumeGraph();
    }   
}
