# CMC Spreadsheet Script

![Get CMC Data List](https://github.com/cryp-doh/cmc-google-apps/blob/master/assets/getcmcdatalist.png)

This google apps script allows you to pull data from [coinmarketcap.com](https://coinmarketcap.com) via their api (see https://coinmarketcap.com/api/ for further explanations) by providing custom functions to be directly used inside your google spreadsheets.

Would you like to get started immediately? Jump to the [Setup section](#setup).

Enjoy my work? [Any tip is welcome](#tip)!

## Motivation

Dissattisfied with the current state of crypto currency portfolio tracking, I decided to go ahead and start working on an open-source alternative to the popular CRYPTOFINANCE spreadsheet add-on.

For one, the fact that CRYPTOFINANCE is closed source really turned me off, since there's no guarantee for user tracking being absent (besides google anyways). Besides that, I had set up my portfolio on one of the many online crypto tracking providers. However, updates on these platforms tend to be rather slow/behind, so I couldn't really see the latest dips/bumps - at least not fast enough! Also, oftentimes the prices seemed off compared to the data of CMC or the exchanges I had registered myself to. Hence, this spreadsheet script was born...

## Status

### Version

**Alpha** - initial pre-release for the public. Test data is needed.

Wanna give it a try for your crypto-portfolio needs? As of now, anybody willing to test the script is very welcome! Please install the script (see [Setup](#setup)) and provide feedback as you see fit.

You would like help development of the add-on / script and push it further? Feel free to fork and send pull requests!

### Current Features

* Retrieve all CMC data on a seperate sheet via menu button
* custom spreadsheet function "=CMC()"
* flexibilty via parametrs currencyPair and attr
* custom spreadsheet function "=CMCLIST()"
* configurable via parametrs limit, convert and start

### Planned Features

* provide options for CMC and CMCLIST for making changes (1h, 24h, 7d) colored
* graphs
* importing data from exchanges (Binance, GDAX, Kraken, etc.) via api access <- this will only happen with community support
* profit / margin calculation based on imported data
* configurable history with graph support
* many more & open for suggestions

## <a name="setup"></a>Setup

Since this is the alpha version and before being able to upload the add-on to the chrome webstore for the broader masses, users need to install the script manually for now, following these steps.

1. Open the spreadsheet in which you would like to use the script or create a new spreadsheet.

2. Navigate to the menu and go to _Tools_ -> _Script editor..._ - a script related to your current document will open in a new tab.

3. Remove everything inside the script (function myFunction()...).

4. Copy the script's source code from https://github.com/cryp-doh/cmc-google-apps/blob/master/src/cmc.gs and paste it in the empty script of the _Script editor_.

5. Save the project and give it a fancy name, e.g. "CMC".

6. After the script is saved, in the _Script editor_'s menu, click on _Run_ -> _Run function_ -> _onOpen_.

7. The app will ask you to authorize the script to access your google data. Go ahead and review the permissions. A pop-up will open where you have to choose your account for the script to be used with. After that, a warning will appear, stating "_This app isn't verified_". Click on "_Advanced_" and after that on "_Go to CMC (unsafe)_". Finally, in the next window, hit the _Allow_ button. **After this step you should have successfully installed the CMC Spreadsheet Script**.

## Usage

Before being able to use the custom functions provided by the script (CMC, CMCLIST), you first must fill the internal document storage with currency-data from coinmarketcap. In order to do so, go to the spreadsheet in which you installed the script. Click on the menu _Add-ons_ -> _CMC_ -> _Get CMC Data_. This will create a new sheet called _CMC_ (check the bottom tabs), which will get filled with all currencies currently provided from coinmarketcap.

After this step, you're good to go and can now use the custom functions in your main sheet.

### CMC

_This also is documented on the spreadsheet function itself, when autocomplete kicks in!_

**=CMC(currencyPair, attr)**

Get currency data from CMC. If called without any parameters, the function will return the default currency pair's price (BTC/USD).

Parameters:

* _currencyPair_ A currency pair. The first is the base currency which should get converted into the second currency. 
**Example: =CMC("ETH/EUR")**

* _attr_ The attributes to retrieve. Default is price. Possible attr's are: name, symbol, rank, price, marketcap, supply, maxsupply, 1hchange, 24hchange, 7dchange, updated.
**Example: =CMC("BTC/USD","symbol,price,7dchange")**

### CMCLIST

_This also is documented on the spreadsheet function itself, when autocomplete kicks in!_

**=CMCLIST(limit, convert, start)**

Get list data from CMC. If called without any parameters, CMCLIST will return the top 100 currencies.

Parameters:

* _limit_ The limit of items on the list. Put in "0" to retrieve all currencies. Default is 100.
**Example: =CMCLIST(50)**

* _convert_ Type in a currency to also get the conversion rate of that currency for all currencies on the list. Default is USD.
**Example: =CMCLIST(20, "ETH")**

* _start_ The currency rank where the list will start (in combination with limit, which represents the end, i.e. last index = start + limit). Leave empty to start from beginning.
**Example: =CMCLIST(10, "USD", 10)**

## Credits

Credits goes to [coinmarketcap.com](https://coinmarketcap.com) for providing the api and aggregating all the crypto-finance data on the market. Without them, this script wouldn't exist, obiously ;)

## <a name="tip"></a>Tip

* Bitcoin / BTC: 

**37S6auL2o7BaDd17LkKZ3SaYszS9woCQfy**

![BTC QR-Tag](https://github.com/cryp-doh/cmc-google-apps/blob/master/assets/btc.png)

* Ether / ETH: 

**0x9618e70d4fe366941be4CB3dF1691f0DA9aaa621**

![ETH QR-Tag](https://github.com/cryp-doh/cmc-google-apps/blob/master/assets/eth.png)

* Monero / XMR:

**4GdoN7NCTi8a5gZug7PrwZNKjvHFmKeV11L6pNJPgj5QNEHsN6eeX3DaAQFwZ1ufD4LYCZKArktt113W7QjWvQ7CW7Z6qNc4kQgMzU8K8r**

![XMR QR-Tag](https://github.com/cryp-doh/cmc-google-apps/blob/master/assets/xmr.png)