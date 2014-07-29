'use strict';

// Declare app level module which depends on filters, and services
var pinoutApp = angular.module('pinoutApp', ['CornerCouch', 'ui.bootstrap', 'ng', 'ngDebounce']);

pinoutApp.constant('_LOGIN_REQUIRED_', '_LOGIN_REQUIRED_');

pinoutApp.controller('PinoutCtrl', ['$rootScope', '$scope', 'cornercouch', '$modal', '$q', '_LOGIN_REQUIRED_', 
    function ($rootScope, $scope, cornercouch, $modal, $q, _LOGIN_REQUIRED_) {
  // Make a (rarely used) alias for this $scope
  var scope = $scope;

  scope.processors = {};
  scope.boards = {};
  
  scope.server = cornercouch("https://giseburt.iriscouch.com", 'GET');
  // $scope.server = cornercouch("https://motate.iriscouch.com");
  // $scope.server = cornercouch("http://localhost:5984", "GET");
  
  scope.motateProcessorsView = scope.server.getDB('motate');
  scope.motateBoardsView = scope.server.getDB('motate');
  scope.motatePinNamesView = scope.server.getDB('motate');
  
  scope.processorDoc = {};
  scope.processorDocOriginal = {};
  
  scope.doEditProcessor = function($scope) {
    $scope.isEditingProcessor = true;
    scope.processorDocOriginal = angular.copy(scope.processorDoc);
  };
  
  scope.doCancelEditProcessor = function($scope) {
    $scope.isEditingProcessor = false;
    angular.copy(scope.processorDocOriginal, scope.processorDoc);
  };

  scope.processorPinLookup = {};
  scope.$watch('processorDoc', function(newValue, oldValue) {
    scope.processorPinLookup = {};
    for (var pinIdx in scope.processorDoc.pins) {
      var pin = scope.processorDoc.pins[pinIdx];
      scope.processorPinLookup[pin.gpio_port+pin.gpio_pin] = pin;
    }
  });
  
  scope.lookupPin = function(pin) {
    if (pin) {
      return scope.processorPinLookup[pin.gpio_port+pin.gpio_pin];
    }
    return {};
  };
  
  scope.peripheralOptions = [{'name':'Per. A', 'value':'A'}, {'name':'Per. B', 'value':'B'}];

  scope.timerTypeOptions = ['Timer', 'PWMTimer'];
  scope.timerChannelOptions =[{'name':'Ch. A', 'value':'A'}, {'name':'Ch. B', 'value':'B'}]
  scope.timerNumberOptions = [0, 1, 2, 3];
  scope.pwmTimerNumberOptions = [0, 1, 2, 3];

  scope.spiPinOptions = [0, 1, 2, 3];
  scope.spiTypeOptions = [{'name':'CS', 'value':'cs'}, {'name':'MISO', 'value':'miso'}, {'name':'MOSI', 'value':'mosi'}, {'name':'SCK', 'value':'sck'}];

  scope.twiNumberOptions = [0, 1];
  scope.twiTypeOptions = [{'name':'SDA', 'value':'sda'}, {'name':'SCK', 'value':'sck'}];

  scope.uartTypeOptions = [{'name':'TX', 'value':'tx'}, {'name':'RX', 'value':'rx'}];
  
  scope.submitProcessor = function($scope) {
    var processorDoc = scope.motateProcessorsView.newDoc(scope.processorDoc);

    processorDoc.save().success(function(data) {
      // scope.processorDoc._id = data.id;
      scope.processorDoc._rev = data.rev;
      $scope.processorForm.$setPristine();
      angular.copy(scope.processorDoc, scope.processorDocOriginal);
    });
  };
  
  scope.processorPredicate = ['gpio_port', 'gpio_pin'];
  scope.processorSortColumn = 1;
  scope.processorReverse = false;
    
  scope.handleProcessorReverse = function(column) {
    if (column == scope.processorSortColumn) {
      scope.processorReverse = !scope.processorReverse;
    }
    scope.processorSortColumn = column;
  };


  scope.boardDoc = {};
  scope.boardDocOriginal = {};

  scope.doCopyBoard = function($scope) {
    scope.isEditingBoard = true;
    scope.boardDocOriginal = scope.boardDoc;
    scope.boardDoc = angular.copy(scope.boardDoc);
    delete scope.boardDoc._rev;
    scope.boardDoc._id += " (Copy)";
  };

  scope.doNewBoard = function($scope) {
    scope.isEditingBoard = true;
    scope.boardDocOriginal = scope.boardDoc;
    scope.boardDoc = {_id:"", processor:$scope.processor._id,type:"board", pins:[]};
    for (var pinIdx in $scope.processor.pins) {
      var pin = $scope.processor.pins[pinIdx];
      var newPin = {
        pin:pin.pin,
        gpio_pin:pin.gpio_pin,
        gpio_port:pin.gpio_port
      };
      scope.boardDoc.pins.push(newPin);
    }
  };

  scope.doEditBoard = function($scope) {
    scope.isEditingBoard = true;
    scope.boardDocOriginal = angular.copy(scope.boardDoc);
  };
  
  scope.doCancelEditBoard = function($scope) {
    scope.isEditingBoard = false;
    if (scope.boardDoc._rev) {
      angular.copy(scope.boardDocOriginal, scope.boardDoc);
    } else {
      scope.boardDoc = scope.boardDocOriginal;
    }
  };

  scope.submitBoard = function($scope) {
    var boardDoc = scope.motateBoardsView.newDoc(scope.boardDoc);
    
    boardDoc.save().success(function(data) {
      scope.boardDoc._id = data.id;
      if (scope.boardDoc._rev) {
        angular.copy(scope.boardDoc, scope.boardDocOriginal);
      } else {
        scope.boards[scope.boardDoc._id] = scope.boardDoc;
      }
      scope.boardDoc._rev = data.rev;
      $scope.boardForm.$setPristine();
    });
  };

  scope.boardSortFn = function(subkey, flip) {
    var flip_keep = flip || 0
    var subkey_keep = subkey;
    return function(o) {
      var procPin = scope.lookupPin(o);
      return procPin && procPin[subkey_keep];
    }
  };
  
  scope.boardPWMSortFn = function(subkey) {
    var subkey_keep = subkey;
    return function(o) {
      var procPin = scope.lookupPin(o);
      if (!procPin.pwm) return null;
      return procPin.pwm[subkey_keep];
    }
  };

  scope.boardSPISortFn = function(subkey) {
    var subkey_keep = subkey;
    return function(o) {
      var procPin = scope.lookupPin(o);
      if (!procPin.spi) return null;
      return procPin.spi[subkey_keep];
    }
  };

  scope.boardTWISortFn = function(subkey) {
    var subkey_keep = subkey;
    return function(o) {
      var procPin = scope.lookupPin(o);
      if (!procPin.twi) return null;
      return procPin.twi[subkey_keep];
    }
  };

  scope.boardUARTSortFn = function(subkey) {
    var subkey_keep = subkey;
    return function(o) {
      var procPin = scope.lookupPin(o);
      if (!procPin.uart) return null;
      return procPin.uart[subkey_keep];
    }
  };

  scope.boardPredicate = [scope.boardSortFn('gpio_port'), scope.boardSortFn('gpio_pin')];
  scope.boardSortColumn = 2;
  scope.boardReverse = false;
    
  scope.handleBoardReverse = function(column) {
    if (column == scope.boardSortColumn) {
      scope.boardReverse = !scope.boardReverse;
    }
    scope.boardSortColumn = column;
  };

  scope.motatePinNameLookup = {};
  
  scope.fixPinNum = function(pin) {
    for (var i = 0; i < scope.motatePinNameLookup.length; i++) {
      var pinRules = scope.motatePinNameLookup[i];
      if (pin.motate_name == null) {
        return false;
      }
      if (pinRules.motate_name.toLocaleLowerCase() == pin.motate_name.toLocaleLowerCase()) {
        pin.motate_pin = Number(pinRules.motate_pin);
        pin.needs_pwm = pinRules.needs_pwm;
        pin.needs_spi = pinRules.needs_spi;
        pin.needs_twi = pinRules.needs_twi;
        pin.needs_uart = pinRules.needs_uart;
      }
    }
    return false;
  };
  
  scope.logOut = function() {
    scope.server.login(null, null);
    // $rootScope.$broadcast(_LOGIN_REQUIRED_);
  };

  scope.$on(_LOGIN_REQUIRED_, function() {
    if ($rootScope.loggingIn)
      return;
    
    $rootScope.loggingIn = true;
    
    scope.modalInstance = $modal.open({
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl',
      resolve: {
        server: function () { return scope.server; }
      }
    });
    
    scope.modalInstance.result.then(function () {
      $rootScope.loggingIn = false;
      console.log('SUCCESS at: ' + new Date());
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  });
  
  
  // Loading functions
  
  $rootScope.loadData = function(why) {
    scope.motateProcessorsView.query("search", "processors",
        {
          include_docs: true,
          descending: true
        }
    ).success(
      function() {
        for (var rowIdx in scope.motateProcessorsView.rows) {
          var row = scope.motateProcessorsView.rows[rowIdx];
          scope.processors[row.key] = row.doc;
        }

        scope.processorDoc = scope.processors[scope.motateProcessorsView.rows[0].key]
      }
    );

    scope.motateBoardsView.query("search", "boards_by_processor",
      {
        include_docs: true,
        descending: true
      }
    ).success(
      function() {
        for (var rowIdx in scope.motateBoardsView.rows) {
          var row = scope.motateBoardsView.rows[rowIdx];
          scope.boards[row.id] = row.doc;
        }
    
        scope.boardDoc = scope.boards[scope.motateBoardsView.rows[0].id];
      }
    );

    scope.motatePinNamesView.query("search", "pins",
      {
        include_docs: true,
        descending: true
      }
    ).success(
      function() {
        scope.motatePinNameLookup = scope.motatePinNamesView.rows[0].doc.names;
      }
    );
  };
  
  $rootScope.checkLogin = function() {
    if (scope.server.userCtx.name == null) {
      $rootScope.$broadcast(_LOGIN_REQUIRED_);
    } else {
      $rootScope.loggedIn = true;
      $rootScope.deferredLoad.resolve('Logged In');
    }
  };
  $rootScope.loginFailed = function() {
    $rootScope.loggedIn = false;
    $rootScope.$broadcast(_LOGIN_REQUIRED_);
  };
  
  $rootScope.deferredLoad = $q.defer();
  $rootScope.deferredLoad.promise.then($rootScope.loadData);

  scope.server.session().then($rootScope.checkLogin, $rootScope.loginFailed);
  
}]); // PinoutCtrl

pinoutApp.controller('BoardPinCtrl', function ($scope, $debounce) {
  $scope.processorPin = {}
  var scope = $scope;
  var parent = $scope.$parent;
  var pin = $scope.pin;
  
  if (pin.motate_pin && !pin.motate_name) {
    for (var i = 0; i < $scope.motatePinNameLookup.length; i++) {
      var pinRules = $scope.motatePinNameLookup[i];
      if (Number(pinRules.motate_pin) == Number(pin.motate_pin)) {
        pin.motate_name = pinRules.motate_name;
        pin.needs_pwm = pinRules.needs_pwm;
        pin.needs_spi = pinRules.needs_spi;
        pin.needs_twi = pinRules.needs_twi;
        break;
      }
    }
  }
  
  parent.$watch('processorDoc', function(newValue, oldValue) {
    var processor = parent.boardDoc.processor;
    if (parent.processors[processor]) {
      for (var rowIdx in parent.processors[processor].pins) {
        var procPin = parent.processors[processor].pins[rowIdx];
        if (procPin.gpio_port == pin.gpio_port && procPin.gpio_pin == pin.gpio_pin) {
          scope.processorPin = procPin;
        }
      }
    }
  });
});

pinoutApp.filter('appropriatePins', function() {
  return function(array, text, pin, processorPin) {
    var arrayFiltered = [];
    for (var i = 0; i < array.length; i++) {
      var pinRules = array[i];
      
      if (pinRules.motate_name.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) == -1) {
        continue;
      }
      if (pinRules.needs_spi) {
        if (!processorPin.has_spi || pinRules.spi.type != processorPin.spi.type) {
          continue;
        }
      }
      if (pinRules.needs_twi) {
        if (!processorPin.has_twi || pinRules.twi.type != processorPin.twi.type) {
          continue;
        }
      }
      if (pinRules.needs_pwm) {
        if (!processorPin.has_pwm) {
          continue;
        }
      }
      if (pinRules.needs_uart) {
        if (!processorPin.has_uart || pinRules.uart.type != processorPin.uart.type) {
          continue;
        }
      }
      
      arrayFiltered.push(pinRules);
    }
    return arrayFiltered;
  };
});

pinoutApp.filter('appropriatePinNum', function() {
  return function(value, text, motatePinNameLookup) {
    if (text == null) {
      return true;
    }
    for (var i = 0; i < motatePinNameLookup.length; i++) {
      var pinRules = motatePinNameLookup[i];
      if (pinRules.motate_name.toLocaleLowerCase() == text.toLocaleLowerCase()) {
        return value == pinRules.motate_pin;
      }
    }
    return true;
  };
});

pinoutApp.filter('pinForMotateName', function() {
  return function(text, value, motatePinNameLookup) {
    if (text != null || value == null) {
      return text;
    }
    for (var i = 0; i < motatePinNameLookup.length; i++) {
      var pinRules = motatePinNameLookup[i];
      if (pinRules.motate_pin == value) {
        return text == pinRules.motate_name;
      }
    }
    return text;
  };
});

pinoutApp.controller('LoginCtrl', function ($scope, $modalInstance, $rootScope, $timeout, $q, server) {
  $scope.server = server;
  $rootScope.loggingIn = true;
  
  $scope.ok = function (scope) {
    $rootScope.loggingIn = false;
    $rootScope.loggedIn = true; // until proven false...

    $rootScope.deferredLoad = $q.defer();
    $rootScope.deferredLoad.promise.then($rootScope.loadData);
    $scope.server.login(scope.user, scope.password).then($rootScope.checkLogin, $rootScope.loginFailed);

    $timeout(function() {$modalInstance.dismiss({value:'done'});}, 0, false);
  };
});

pinoutApp.config(function($httpProvider) {
  $httpProvider.interceptors.push(['$injector', '$q', '_LOGIN_REQUIRED_', function($injector, $q, _LOGIN_REQUIRED_) {
    var rootScope = rootScope || $injector.get('$rootScope');
    return {
      // 'request': function(request) {
//         // if we're not logged-in to the AngularJS app, redirect to login page
//         rootScope.loggedIn = rootScope.loggedIn || rootScope.username;
//         
//         if (!rootScope.loggedIn && !rootScope.inLogin) {
//           // $scope.openLogin();
//           // rootScope.$broadcast(_LOGIN_REQUIRED_);
//           console.log("open LOGIN");
//           rootScope.inLogin = 1;
//         }
//         return $q.reject(request);
//         // return request;
//       },
//       
        'responseError': function(rejection) {
        // if we're not logged-in to the web service, redirect to login page
        if (rejection.status === 401 && !rootScope.loggingIn) {
          rootScope.loggedIn = false;
          rootScope.$broadcast(_LOGIN_REQUIRED_);
          console.log("open LOGIN2");
        }
        return $q.reject(rejection);
      }
    };
  }]);
});