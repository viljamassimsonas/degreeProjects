// WRITTEN ALL BY VILJAMAS SIMSONAS
#pragma once

#include <string>
#include "OrderBook.h"

// Candlestick class implementation
class Candlestick 
{
    public:

        Candlestick(double high, double open,   double close, 
                    double low,  double volume, std::string date)

            : high(high),
              open(open),
              close(close),          
              low(low),
              volume(volume),
              date(date)

            {}

        double high;
        double open;
        double close;
        double low;
        double volume;
        std::string date;

        // Creates vector of candle data objects
        static std::vector <Candlestick> calculateCandlesticks(OrderBook & orderBook, 
                                                       const std::string & inputString);
};

OrderBookType transform(const std::string& str);