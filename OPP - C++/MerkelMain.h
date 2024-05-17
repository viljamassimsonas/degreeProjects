#pragma once

#include <vector>
#include "OrderBook.h"
#include "OrderBookEntry.h"
#include "Wallet.h"

class MerkelMain
{
    public:
        MerkelMain();
        /** Call this to start the sim */
        void init();
    private: 
        void printMenu();
        void printHelp();
        void printMarketStats();
        void enterAsk();
        void enterBid();
        void printWallet();
        void gotoNextTimeframe();
        void printCandleData();
        void drawCandlesticks();
        void drawVolumeGraph();
        int getUserOption();
        void processUserOption(int userOption);

        std::string currentTime;

//        OrderBook orderBook{"20200317.csv"};
	OrderBook orderBook{"20200601.csv"};
        Wallet wallet;

};
