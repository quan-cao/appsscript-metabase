class Metabase {
  constructor(domain, username, password, token) {
    if (!domain) throw Error("Need to provide domain.")
    this.baseUrl = domain.concat("/api");

    if (!token && (!username || !password)) {
      throw Error("Need to provide token or username & password");
    }

    this.username = username;
    this.password = password;
    this._token = token;
  }

  get token () {
    if(!this._token) {
      this._token = this.getToken();
    }
    return this._token;
  }

  set token(val) {
    this._token = val;
  }

  getToken () {
    var url = this.baseUrl.concat("/session");
    var payload = {
      "username": this.username,
      "password": this.password
    };
    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload)
    };
    var resp=UrlFetchApp.fetch(url, options);
    return JSON.parse(resp.getContentText()).id;
  };

  _query (cardid, parameters) {
    var url = this.baseUrl.concat("/card/", cardid, "/query");
    var options = {
      "method": "post",
      "contentType": "application/json",
      "headers": { "X-Metabase-Session": this.token },
      "muteHttpExceptions": true,
      "payload": JSON.stringify({ "parameters": parameters })
    };
    var resp = UrlFetchApp.fetch(url, options);
    if (resp == "Unauthenticated") throw Error("Unauthenticated");
    resp = JSON.parse(resp.getContentText());
    var columns = [];
    resp.data.cols.forEach(function (val) {
      columns.push(val.display_name);
    });
    var rows = resp.data.rows;
    rows.unshift(columns);
    return rows;
  };

  query (cardid, parameters) {
    try {
      return this._query(cardid, parameters);
    } catch(e) {
      if (e.message == "Unauthenticated") {        
        this._token = this.getToken();
        return this._query(cardid, parameters);
      }
    }
  };
}

var _domain = ""  // Metabase domain
var _username = "";  // Metabase username
var _password = "";  // Metabase password
var _token = "";  // Metabase token, Optional

var _cardid = "";  // Metabase card id
var _parameters = [];  // Metabase card parameters

/**
 * Returns the result from Metabase card.
 * In order to use this function, you need to setup
 * token, or username and password, in order to call
 * Metabase API. Metabase token is usually expired after
 * 14 days by Metabase setup default.
 *
 * @param {String} domain Your Metabase domain, should be in format
 * of 'http://example.com' or 'https://example.com'.
 * @param {String} username (Optional) Your username to login Metabase.
 * @param {String} password (Optional) Your password to login Metabase.
 * @param {String} token (Optional) Your Metabase session token.
 * @param {String} cardid Metabase card id.
 * @param {String|Array} parameters Parameters to put in Metabase card.
 * @returns {Array<Array>} Array containing rows of data,
 * each row is an array. First row is header.
 * @customfunction
 */
function getMetabase(
  domain=_domain,
  username=_username,
  password=_password,
  token=_token,
  cardid=_cardid,
  parameters=_parameters
) {
  if (typeof(parameters) == "string") {
    parameters = JSON.parse(parameters);
  }
  var M = new Metabase(domain, username, password, token);
  var result = M.query(cardid, parameters);
  return result;
}

