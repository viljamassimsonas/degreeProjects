// WRITTEN ALL BY VILJAMAS SIMSONAS
#include <iostream>
#include <string>
#include <vector>
#include "Candlestick.h"
#include "CSVReader.h"
#include "OrderBook.h"
#include "OrderBookEntry.h"

// String to order type transform
OrderBookType transform(const std::string & string) 
{
         if (string == "ask")     return OrderBookType::ask;
    else if (string == "bid")     return OrderBookType::bid;
    else if (string == "asksale") return OrderBookType::asksale;
    else if (string == "bidsale") return OrderBookType::bidsale;
    else
        return OrderBookType::unknown;
}

// Creates vector of candle data objects using orderBook data
std::vector <Candlestick> Candlestick::calculateCandlesticks(OrderBook & orderBook, const std::string & inputString) 
{
    std::vector <Candlestick> candlestickVector;

    // Tokenise request into product pair and ask or bid request type
    std::vector <std::string> input = CSVReader::tokenise(inputString, ',');

    // Sets currency pair/askOrBid based on tokenised input
    std::string pair;
    OrderBookType askOrBid;

    if (input.size() != 2) 
    {
        std::cout << "BAD INPUT!" << inputString << std::endl;
    } 
    else 
    {
        // Product pair
        pair = input[0]; 
        
        // Ask or bid request
        askOrBid = transform(input[1]); 
    }

    // Builds data of the candle data 
    // object and gets pushed into the vector
    OrderBook currentPeriodOrders;

    double firstCandle = true;
    double highPrice   = 0;
    double openPrice   = 0;
    double closePrice  = 0;
    double lowPrice    = 0;
    double volume      = 0;
    double runTotal    = 0;
    double count       = 0;

    OrderBookEntry compOrder = orderBook.getOrderEntry(0);

    for (int i = 0; i < orderBook.getOrdersVectorSize(); i++) 
    {
        OrderBookEntry order = orderBook.getOrderEntry(i);

        if (OrderBookEntry::compareByTimestamp(compOrder, order)) 
        { 
            // Checks if the candle created is the first one
            // to start correct open Price close Price chain
            if (firstCandle) 
            {
                closePrice = runTotal / count;
                openPrice  = closePrice;

                // Sets conditional to false
                firstCandle = false; 
            } 
            else 
            {
                closePrice = runTotal / count;
                lowPrice   = currentPeriodOrders.getLowestPrice();
                highPrice  = currentPeriodOrders.getHighestPrice();

                // Appends new candle data object to the returned vector
                candlestickVector.emplace_back(Candlestick(highPrice, 
                                                           openPrice, 
                                                           closePrice, 
                                                           lowPrice, 
                                                           volume, 
                                                           order.timestamp));

                // Updates the compared order to the current one
                compOrder = order;

                // Resets all counters
                count     = 0;
                volume    = 0;
                runTotal  = 0;
                openPrice = closePrice;

                // Deletes current period orders used for candle data object
                currentPeriodOrders.deleteAll(); 
            }
        } 
        // Still same time period
        else 
        { 
            // Ensures correct currency pair and askOrBid is taken
            if (order.orderType == askOrBid && order.product == pair) 
            {
                // Increase order price total amount
                runTotal += (order.price * order.amount);

                // Increase total volume
                volume += order.price;

                // Increase total order amount
                count  += order.amount;

                // Add this order to group of orders used for the candle data object
                currentPeriodOrders.insertOrder(order); 
            }
        }
    }
    return candlestickVector;
}