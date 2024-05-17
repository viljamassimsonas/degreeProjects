#pragma once

#include <string>
#include <vector>
#include "CSVReader.h"
#include "OrderBookEntry.h"

class OrderBook
{
    public:
    /** construct, reading a csv data file */
        OrderBook(std::string filename);

    // WRITTEN BY VILJAMAS SIMSONAS    
    /** construct, empty */
        OrderBook();

    /** return vector of all know products in the dataset*/
        std::vector<std::string> getKnownProducts();
    /** return vector of Orders according to the sent filters*/
        std::vector<OrderBookEntry> getOrders(OrderBookType type, 
                                              std::string product, 
                                              std::string timestamp);

        /** returns the earliest time in the orderbook*/
        std::string getEarliestTime();
        /** returns the next time after the 
         * sent time in the orderbook  
         * If there is no next timestamp, wraps around to the start
         * */
        std::string getNextTime(std::string timestamp);

        void insertOrder(OrderBookEntry& order);

        std::vector<OrderBookEntry> matchAsksToBids(std::string product, std::string timestamp);

        static double getHighPrice(std::vector<OrderBookEntry>& orders);
        static double getLowPrice(std::vector<OrderBookEntry>& orders);

        // WRITTEN BY VILJAMAS SIMSONAS
        // Same as getHighPrice() and getLowPrice() but no vector input
        double getLowestPrice();
        double getHighestPrice();

        // WRITTEN BY VILJAMAS SIMSONAS
        // Delete all order book items
        void deleteAll();

        // WRITTEN BY VILJAMAS SIMSONAS
        // Returns order book entry based on index
        OrderBookEntry getOrderEntry(int index);

        // WRITTEN BY VILJAMAS SIMSONAS
        // Returns total size of orders 
        int OrderBook::getOrdersVectorSize();

    private:
        std::vector<OrderBookEntry> orders;

};
