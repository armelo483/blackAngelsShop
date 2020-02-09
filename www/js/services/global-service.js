angular.module('starter')

  .service('GlobalService', function ($resource, $filter, ApiEndpoint, $rootScope, AUTH_EVENTS) {

    var GlobalService = this;
    var defaultCurrencyId = "1";
    var defaultLanguageId = "3";
    var defaultLanguageIsoCode = "fr";
    var settings = JSON.parse(window.localStorage['settings'] || '{"id_guest": "","id_customer": "","id_cart": "", "id_lang": "", "id_currency": "", "iso_code" : ""}');

    settings["id_lang"] = settings.id_lang || defaultLanguageId;
    settings["id_currency"] = settings.id_currency || defaultCurrencyId;
    settings["iso_code"] = settings.iso_code || defaultLanguageIsoCode;
    console.log('settings');
    console.log(window.localStorage);

    function loadSettings() {
      if (settings) {
        console.log('Settings', settings)
        useSettings(settings);
      }
      if (!settings.id_guest) {
        console.log('No Settings')
        createGuestId();
      }
    }

    function createGuestId() {
      console.log('Create Guest ID');
      var createGuest = $resource(ApiEndpoint.url + '/guests', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON' },
        {
          save: {
            method: "POST",
            headers:
              {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/xml',
                'Access-Control-Allow-Origin': '*'
              }
          }
        });
      var guestXML = "<prestashop><guest></guest></prestashop>";
      createGuest.save({}, guestXML).$promise.then(function (data) {
        console.log(data.guest.id);
        settings["id_guest"] = data.guest.id;
        storeSettings();
        createCartId();
      });
    }

    function createCartId() {
      console.log('Create Cart ID');
      var createCart = $resource(ApiEndpoint.url + '/carts', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON' },
        {
          save: {
            method: "POST",
            headers:
              {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/xml'
              }
          }
        });
      var cartXML = "<prestashop><cart><id_guest></id_guest><id_currency>" + defaultCurrencyId + "</id_currency><id_lang>" + defaultLanguageId + "</id_lang></cart></prestashop>";
      createCart.save({}, cartXML).$promise.then(function (data) {
        console.log(data.cart.id);
        settings["id_cart"] = data.cart.id;
        storeSettings();
      });
    }

    function storeSettings() {
      console.log('Store Settings', settings);
      window.localStorage['settings'] = JSON.stringify(settings);
      useSettings(settings);
    }

    function useSettings(settings) {
      GlobalService.id_guest = settings.id_guest;
      GlobalService.id_customer = settings.id_customer;
      GlobalService.id_cart = settings.id_cart;
      GlobalService.id_lang = settings.id_lang;
      GlobalService.id_currency = settings.id_currency;
      GlobalService.iso_code = settings.iso_code;
      console.log('id_guest', GlobalService.id_guest);
      console.log('id_customer', GlobalService.id_customer);
      console.log('id_cart', GlobalService.id_cart)
      console.log('id_lang', GlobalService.id_lang)
      console.log('id_currency', GlobalService.id_currency)
      console.log('iso_code', GlobalService.iso_code)
    }
    loadSettings();

    GlobalService.updateCustomerId = function (id_customer) {
      settings["id_customer"] = id_customer;
      storeSettings();
    }

    GlobalService.languages = JSON.parse(window.localStorage['languages'] || '[{"id":1,"name":"English (English)","iso_code":"en"}]');
    GlobalService.loadLanguageList = function () {
      return $resource(ApiEndpoint.url + '/languages&filter[active]=[1]', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON', display: '[id,name,iso_code]' });
    }
    /*GlobalService.loadLanguageList().get().$promise.then(function (data) {
      GlobalService.languages = data.languages;
      //GlobalService.languages = GlobalService.languages + {id: 3,iso_code: "fr",name: "Français (French)"};
      console.log('GlobalService.languages');
        console.log(GlobalService.languages);
      window.localStorage['languages'] = JSON.stringify(data.languages);
    });

    GlobalService.updateLanguageId = function (id_lang) {
      settings["id_lang"] = id_lang;
      settings["iso_code"] = $filter('filter')(GlobalService.languages, { id: id_lang })[0]['iso_code'];
      storeSettings();
      window.localStorage.removeItem('ProductFeature');
      $rootScope.$broadcast(AUTH_EVENTS.changedLanguage);
    }

    GlobalService.countries = [];
    GlobalService.getCountries = function () {
      return $resource(ApiEndpoint.url + '/countries&filter[active]=[1]', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON', display: 'full', language: GlobalService.id_lang });
    }
*/
    GlobalService.states = [];
    GlobalService.getStates = function () {
      return $resource(ApiEndpoint.url + '/states&filter[active]=[1]', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON', display: 'full', language: GlobalService.id_lang });
    }

    GlobalService.order_states = [];
    GlobalService.getOrderState = function () {
      return $resource(ApiEndpoint.url + '/order_states', { ws_key: ApiEndpoint.ws_key, output_format: 'JSON', display: '[id,name,color]', language: GlobalService.id_lang });
    }
  })