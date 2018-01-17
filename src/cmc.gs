/**
 * Installing the add-on.
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Called when document gets opened.
 */
function onOpen() {
  
  const ui = SpreadsheetApp.getUi();
  
  ui.createAddonMenu()
    .addItem("Get CMC Data", "menuGetCmcData")
    .addToUi();
  
}

// cmc api url
var cmcUrl = "https://api.coinmarketcap.com/v1/ticker/";

// key value store for curencies {id: symbol}
var documentProperties = PropertiesService.getDocumentProperties();

/**
 * Creates a new spreadsheet "CMC" which holds all coins information.
 */
function menuGetCmcData() {
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = "CMC";
  const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  
  sheet.clear();
  
  var data = getCmcData(true, 0);
  
  function rangeClosure(a,b,row,idx) {
    
    return function() {
      
      const range = sheet.getRange(a, b);
      const col = row[idx];
      
      range.setValue(col);
      
      // make header bold
      if (a === 1) {
        range.setFontWeight("bold");
      }
      
      // color columns "1h Change", "24h Change", "7d Change"
      if ([9, 10, 11].indexOf(idx) > -1 && a !== 1) {
        
        if (col >= -0.05 && col <= 0.05) {
          range.setBackground("yellow");
        } else if (col < -0.05 && col >= -5) {
          range.setBackground("lightcoral");
        } else if (col < -5) {
          range.setBackground("indianred");
        } else if (col > 0.05 && col <= 5) {
          range.setBackground("palegreen");
        } else {
          range.setBackground("limegreen");
        }
        
      }
      
    };
    
  }
  
  if (data && data.map) {
    
    data.map(function(row, i) {
      
      for (var j=0; j<row.length; j++) {
        var k = i+1;
        var l = j+1;
        rangeClosure(k,l,row,j)();
      }
      
    });
    
  }
  
  // freeze first row
  sheet.setFrozenRows(1);
  
}

/**
 * Store the id symbol mapping in persistent document key value store.
 *
 * @param {object} data The data to be stored.
 */
function storeIdSymbolMapping(data) {
  
  if (data) {
    documentProperties.setProperties(data);
  }
  
}

/**
 * CMC api helper for currency access.
 */
function cmcApiCurrency(currency, convert) {
  
  var params = "";
  
  if (!currency) {
    throw "No currency specified.";
  }
  
  if (convert) {
    params = "/?convert="+convert;
  }

  const response = UrlFetchApp.fetch(cmcUrl + currency + params, {'muteHttpExceptions': true});
  return JSON.parse(response.getContentText());
}

/**
 * CMC api helper for list access.
 */
function cmcApiTicker(limit, convert, start) {
  
  var params = [];
  var paramsString = "";
  
  if (limit !== undefined) {
    params.push("limit="+limit);
  }
  
  if (start) {
    params.push("start="+start);
  }
  
  if (convert) {
    params.push("convert="+convert);
  }
  
  if (params.length > 0) {
    paramsString = "?" + params.join("&");
  }
  
  const response = UrlFetchApp.fetch(cmcUrl + paramsString, {'muteHttpExceptions': true});
  return JSON.parse(response.getContentText());
}

/**
 * Helper for retrieving the coin data list from CMC to be used in a sheet directly.
 *
 * @param {"true|false"} storeData Indicates if the data should be persisted in documentProperties storage.
 * @param {"100"} limit The limit of items on the list.
 * @param {"EUR"} convert Type in a currency to also get the conversion rate of that currency for all currencies on the list.
 * @param {"50"} start The currency rank where the list will start.
 */
function getCmcData(storeData, limit, convert, start) {
    
  // field mapping for cmc api request
  var fields = {
    "name": "Name",
    "symbol": "Symbol",
    "rank": "Rank",
    "price_usd": "Price in $",
    "price_btc": "Price in BTC",
    "market_cap_usd": "Market Cap in $",
    "available_supply": "Available Supply",
    "total_supply": "Total Supply",
    "max_supply": "Max Supply",
    "percent_change_1h": "1h Change",
    "percent_change_24h": "24h Change",
    "percent_change_7d": "7d Change",
    "last_updated": "Last updated",
  };
  
  if (convert) {
    fields["price_" + convert.toLowerCase()] = "Price in " + convert;
  }
  
  const content = cmcApiTicker(limit, convert, start);
  
  var cmcData = [];
  var idSymbolMapping = {};
  
  // create the head
  var head = [];
  
  for (var f in fields) {
    head.push(fields[f]);
  }
  
  cmcData.push(head);
  
  // push obj values
  if (content.map) {
    
    content.map(function(obj) {
      
      var row = [];
      
      for (var f in fields) {
        if (obj[f]) {
          row.push(obj[f]);
        } else {
          row.push(null);
        }
      }
      
      cmcData.push(row);
      
      if (storeData) {
        idSymbolMapping[obj.id] = obj.symbol
      }
      
    });
    
    if (storeData && idSymbolMapping) {
      storeIdSymbolMapping(idSymbolMapping);
    }
    
  }
  
  return cmcData;
}

var allowedAttrs = ["name", "symbol", "rank", "price", "marketcap", "supply", "maxsupply", "1hchange", "24hchange", "7dchange", "updated"];

/**
 * Maps user defined attributes to the object that will be retrieved by an api call.
 */
function mapAttr(attr, currencies) {
  
  var result = {};
  
  const attrArray = attr.split(',');
  const price = "price_" + currencies.convert.toLowerCase();
  
  const attrMap = {
    "name": "name",
    "symbol": "symbol",
    "rank": "rank",
    "price": price,
    "marketcap": "market_cap_usd",
    "supply": "available_supply",
    "maxsupply": "max_supply",
    "1hchange": "percent_change_1h",
    "24hchange": "percent_change_24h",
    "7dchange": "percent_change_7d",
    "updated": "last_updated"
  };
  
  attrArray.forEach(function(a) {
    
    // validate attributes
    if (allowedAttrs.indexOf(a) === -1) {
      throw "Invalid attribute(s).";
    }
    
    result[a] = attrMap[a];
    
  });
  
  Logger.log(result);
  
  return [result];
  
}

/**
 * Takes a string in the form of e.g. "BTC/EUR" and transforms in into an object with the following structure:
 * {
 *   base: {
 *     id: id,
 *     symbol: symbol
 *`  },
 *   convert: convertSymbol
 * }
 *
 * @param {"BTC/EUR"} currencyPair
 */
function resolveCurrencyPair(currencyPair) {
  
  var result = {};
  
  const all = documentProperties.getProperties();
  const currencies = currencyPair.split("/");
  
  if (currencies.length === 1) {
    result.convert = "USD";
  } else {
    result.convert = currencies[1];
  }
  
  if (!all) {
    throw "Please update CMC data via menu: CMC -> Get CMC Data"
  }
  
  for (id in all) {
    
    if (all[id] === currencies[0]) {
      
      result.base = {"id": id, "symbol": all[id]};
      
      return result;
      
    }
    
  }
  
  throw "Invalid base currency. Maybe you need to update CMC data? Go to menu CMC -> Get CMC Data.";
  
}

/**
 * Get currency data from CMC. If called without any parameters, function will return default currency pair (BTC/USD)'s price.
 *
 * @param {"BTC/USD"} currencyPair A currency pair. The first is the base currency which should get converted into the second currency.
 * @param {"price,1hchange,rank"} attr The attributes to retrieve. Default is price. Possible attr's are: name, symbol, rank, price, marketcap, supply, maxsupply, 1hchange, 24hchange, 7dchange, updated
 * @customfunction
 */
function CMC(currencyPair, attr) {
  
  var currencies;
  
  if (currencyPair !== undefined) {
    currencies = resolveCurrencyPair(currencyPair);
  } else {
    currencies = {base: {id: "bitcoin", symbol: "BTC"}, convert: "USD"};
  }
  
  if (currencies) {
    
    var mappedAttr;
    
    if (attr) {
      mappedAttr = mapAttr(attr, currencies);
    } else {
      mappedAttr = mapAttr("price", currencies);
    }
    
    const content = cmcApiCurrency(currencies.base.id, currencies.convert)[0];
    
    var result = [];
    
    for (attr in mappedAttr) {
      result.push(content[mappedAttr[attr]]);
    }
    
    return result;
  }
  
}

/**
 * Get list data from CMC. If called without any parameters, CMCLIST will return the top 100 currencies.
 *
 * @param {"100"} limit The limit of items on the list. Put in "0" to retrieve all currencies. Default is 100.
 * @param {"EUR"} convert Type in a currency to also get the conversion rate of that currency for all currencies on the list. Default is USD.
 * @param {"50"} start The currency rank where the list will start (in combination with limit, which represents the end, where last index = start + limit). Leave empty for starting from beginning.
 * @customfunction
 */
function CMCLIST(limit, convert, start) {

  if (limit !== undefined) {
    
    if (convert) {
      
      if (start) {
        return getCmcData(false, limit, convert, start);
      }

      return getCmcData(false, limit, convert);
      
    }
    
    return getCmcData(false, limit);
    
  } else {
    return getCmcData(false, 100);
  }
  
}

