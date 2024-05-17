// WRITTEN ALL BY VILJAMAS SIMSONAS
#ifdef _WIN32       
    #include <windows.h>
    #ifdef min
        #undef min
        #undef max
    #endif
#endif  
#include <algorithm>
#include <array>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>
#include <stdio.h>
#include <vector>
#include "Candlestick.h"
#include "CandleDataGraphing.h"

// Changes scale of graph based on currency pair
int candleDataGraphing::getScale(std::string pair)
{
    int scaleSize = 2;

    if     (pair == "BTC/USDT")
    {
        scaleSize = 2;
    }
    else if(pair == "ETH/USDT")
    {
        scaleSize = 4;
    }
    else if(pair == "DOGE/USDT")
    {
        scaleSize = 6;
    }
    else if(pair == "ETH/BTC")
    {
        scaleSize = 7;
    }      
    else if(pair == "DOGE/BTC")
    {
        scaleSize = 8;
    }
    return scaleSize;
}

// Creates array of strings used to draw the candlesticks 
void candleDataGraphing::buildCandlestickStrings(double sizeOfStep, 
                                                 double low, 
                                                 Candlestick& candlestick, 
                                                 std::array<std::string, 24>& stringArray) 
{
    //Enables virtual terminal processing if program runs on Windows
    #ifdef _WIN32
       
        SetConsoleOutputCP(CP_UTF8);
        setvbuf(stdout, nullptr, _IOFBF, 1000);
        DWORD consoleMode;
        GetConsoleMode(GetStdHandle(STD_OUTPUT_HANDLE), &consoleMode);
        consoleMode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING;
        SetConsoleMode(GetStdHandle(STD_OUTPUT_HANDLE), consoleMode);
 
    #endif  

    //Sets colours
    const std::string Red   = "\033[31m"; 
    const std::string Green = "\033[32m"; 
    const std::string White = "\033[0m" ; 

    // Sets each candles' part positions dependant 
    // on the candles low end value and the stepping 
    // values of sizeOfStep (y axis scaling values)
    int highPosition  = int((candlestick.high  - low) / sizeOfStep);
    int openPosition  = int((candlestick.open  - low) / sizeOfStep);
    int closePosition = int((candlestick.close - low) / sizeOfStep);
    int lowPosition   = int((candlestick.low   - low) / sizeOfStep);

    // Sets the candle to red or green based on open and close values
    std::string colour = (candlestick.close < candlestick.open) ? Red : Green;

    // Adds empty bottom string sections below candle
    for (int i = 0; i < lowPosition; i++) 
    {
        stringArray[i].append(colour + "              " + White);
    }                            

    // Adds bottom wick strings
    for (int i = lowPosition; i < std::min(openPosition, closePosition); ++i) 
    {
        stringArray[i]     += colour + "      │       " + White;
    }

    // Adds close value body string
    stringArray[std::min(openPosition, closePosition)]     += colour + "     ███      " + White;

    // Adds extra body strings if candle's body is bigger than  2  body  ( > ███ x 2 ) strings in y scale terms
    for (int i = std::min(openPosition, closePosition) + 1; i < std::max(openPosition, closePosition); i++)
    {
        stringArray[i]     += colour + "     ███      " + White;
    }

    // Adds open value body string if body is longer than 1 height in y scale terms
    if(openPosition != closePosition)
    {
        stringArray[std::max(openPosition, closePosition)] += colour + "     ███      " + White;
    }

    // Adds top wick strings
    for (int i = std::max(openPosition, closePosition) + 1; i < highPosition + 1; i++)
    {
        stringArray[i]     += colour + "      │       " + White;
    }

    // Adds empty top string sections above candle
    for (int i = highPosition + 1; i < 24; i++)
    {
        stringArray[i]     += colour + "              " + White;
    }                          
}

// Draws the candlesticks based on the stringArray made on buildCandlestickStrings()
void candleDataGraphing::drawCandlesticks(std::vector<Candlestick> candles, 
                                          std::string inputString)
{
    // Sets highest/lowest candle from the candle data vector
    Candlestick topCandle    = *std::max_element(candles.begin(), candles.end(), [](Candlestick A, Candlestick B){return A.high < B.high;});
    Candlestick bottomCandle = *std::min_element(candles.begin(), candles.end(), [](Candlestick A, Candlestick B){return A.low  < B.low ;});

    // Tokenise console pair/askOrBid input
    std::vector<std::string> input = CSVReader::tokenise(inputString, ',');

    // Sets currency pair based on tokenised input
    std::string pair;

    if (input.size() != 2) 
    {
        std::cout << "BAD INPUT!" << inputString << std::endl;
    } 
    else 
    {
        pair = input[0]; 
    }

    // Sets graph scaling based on currency pair
    int scaleSize = getScale(pair);

    // Sets value scaling for candle data based on highest/lowest candle
    double sizeOfStep = (topCandle.high - bottomCandle.low) / 23;            

    // Initialises stringArray where candle strings are stored for drawing
    std::array<std::string, 24> stringArray;    

    // Start of string stream creation, aka drawing from left to right line by line
    for(int i = 0; i < stringArray.size(); i++)
    {   
        std::stringstream stream;

        stream << std::fixed << std::setprecision(scaleSize) << std::setw(5) << bottomCandle.low + i * sizeOfStep;

        stringArray[i] = stream.str() + " ─┤";
    }

    std::cout << "" << std::endl;

    // Build strings based on candle data and stepping sized used for drawing the candlesticks
    for(int i = 0; i < candles.size(); i++)
    {
        buildCandlestickStrings(sizeOfStep, bottomCandle.low, candles[i], stringArray);
    }

    // Print PRICE string
    std::cout << "" << std::endl << "  PRICE" << std::endl << std::endl; 
    
    // Print all the stream strings created with buildCandlestickStrings()
    for(int i = stringArray.size() - 1; i >= 0; i--)
    {
        std::cout << stringArray[i] << std::endl;  
    }

    // Bottom graph line print
    std::cout<<"           └──";

    for(int i = 0; i < candles.size() - 1; i++)
    {
        std::cout << "───────────────";
    }

    // Print currency pair of graph
    std::cout << std::endl << " " << pair;

        // Print timestamps of each candle
    for(int i = 0; i < candles.size(); i++)
    {
        std::string candleDate = candles[i].date;

        std::vector<std::string> tokenisedDates = CSVReader::tokenise(candleDate       , ' ');
        std::vector<std::string> candleTime     = CSVReader::tokenise(tokenisedDates[1], '.');

        std::cout << "      " << candleTime[0];
    }
    std::cout << std::endl << std::endl;
}

// Creates array of strings used to draw the volume graph 
void candleDataGraphing::buildVolumeGraphStrings(double sizeOfStep, Candlestick& candlestick, std::array<std::string, 8>& stringArray) {
    
    //Enables virtual terminal processing if program runs on Windows
    #ifdef _WIN32
       
        SetConsoleOutputCP(CP_UTF8);
        setvbuf(stdout, nullptr, _IOFBF, 1000);
        DWORD consoleMode;
        GetConsoleMode(GetStdHandle(STD_OUTPUT_HANDLE), &consoleMode);
        consoleMode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING;
        SetConsoleMode(GetStdHandle(STD_OUTPUT_HANDLE), consoleMode);
 
    #endif  

    //Sets colours
    const std::string Red   = "\033[31m"; 
    const std::string Green = "\033[32m"; 
    const std::string White = "\033[0m" ; 

    // Sets the candle to red or green based on open and close values
    std::string colour = (candlestick.close < candlestick.open) ? Red : Green;

    // Sets top position of volume bar
    int highestPosition = int(candlestick.volume / sizeOfStep);

    // Adds bottom bar part string
    stringArray[0]     += colour + "     ▀▀▀      " + White;

    // Adds rest of bar body strings above
    for(int i = 1; i < highestPosition; i++)
    {
        stringArray[i] += colour + "     ███      " + White;
    }

    // Adds empty space strings above the bar
    for(int i = highestPosition; i < 8; i++)
    {
        stringArray[i] += colour + "              " + White;;
    }
} 

// Draws the volume bars based on the stringArray made on buildVolumeGraphStrings()
void candleDataGraphing::drawVolumeGraph(std::vector<Candlestick> candles, std::string inputString){
    
    // Initialises stringArray where volume bar strings are stored for drawing
    std::array<std::string, 8> stringArray;
    
    // Sets biggest volume bar from the candle data vector
    Candlestick biggestBar = *std::max_element(candles.begin(), candles.end(), [](Candlestick A, Candlestick B){return A.volume < B.volume;});//find candlestick with highest volume to set the scale
    
    // Sets biggest volume bar value
    double highestVolume = biggestBar.volume;

    // Sets value scaling for candle data based on highest volume bar
    double sizeOfStep = highestVolume / 7;
    
    // Adjusts correctly margin in the graphical representation
    highestVolume += sizeOfStep; 

    // Sets currency pair based on tokenised input
    std::string pair;

    std::vector<std::string> input = CSVReader::tokenise(inputString, ',');
    if (input.size() != 2) 
    {
        std::cout << "BAD INPUT!" << inputString << std::endl;
    } 
    else 
    {
        pair = input[0]; 
    }

    // Sets graph scaling based on currency pair
    int scaleSize = getScale(pair);

    // Start of string stream creation, aka drawing from left to right line by line
    for(int i = 0; i < stringArray.size(); i++)
    {
        std::stringstream stream;

        stream << std::fixed << std::setprecision(scaleSize) << std::setw(10) << 0 + i * sizeOfStep;

        stringArray[i] = stream.str() + " ─┤";
    }

    // Build strings based on candle data and stepping sized used for drawing the volume graph
    for(int i = 0; i < candles.size(); i++)
    {
        buildVolumeGraphStrings(sizeOfStep, candles[i], stringArray);
    }

    // Print PRICE string    
    std::cout << std::endl << "  VOLUME" << std::endl << std::endl;

    // Print all the stream strings created with buildVolumeGraphStrings()
    for(int i = stringArray.size() - 1; i >= 0; i--)
    {
        std::cout << stringArray[i] << std::endl;
    }

    // Bottom graph line print
    std::cout << "            └──";

    for(int i = 0; i < candles.size()-1; i++)
    {
        std::cout << "───────────────";
    }
    
    // Print currency pair of graph
    std::cout <<std::endl << "  " << pair;

    // Print timestamps of each volume bar
    for(int i = 0; i < candles.size(); i++)
    {
        std::string candleDate = candles[i].date;

        std::vector<std::string> tokenisedDates = CSVReader::tokenise(candleDate       , ' ');
        std::vector<std::string> candleTime     = CSVReader::tokenise(tokenisedDates[1], '.');

        std::cout << "      " << candleTime[0];
    }
    std::cout << std::endl << std::endl;
}