// WRITTEN ALL BY VILJAMAS SIMSONAS
#pragma once

#include <vector>
#include "CandleStick.h"

// Candle data graphing class implementation
class candleDataGraphing
{
    public: 

        int  candleDataGraphing::getScale(std::string product);

        // Candlestick  drawing section
        void candleDataGraphing::buildCandlestickStrings(double step, double low, Candlestick& candle, std::array<std::string, 24>& strings);

        void candleDataGraphing::drawCandlesticks(std::vector<Candlestick> candlesticks, std::string productType);

        // Volume graph drawing section
        void candleDataGraphing::buildVolumeGraphStrings(double step, Candlestick& candle, std::array<std::string, 8>& strings); 

        void candleDataGraphing::drawVolumeGraph(std::vector<Candlestick> candlesticks, std::string productType);

};