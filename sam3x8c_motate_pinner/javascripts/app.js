'use strict';

// Declare app level module which depends on filters, and services
var pinoutApp = angular.module('pinoutApp', ['CornerCouch', 'ui.bootstrap', 'ng']);

pinoutApp.controller('PinoutCtrl', function ($scope, cornercouch) {
  $scope.processors = {};
  $scope.boards = {};
  
  // $scope.server = cornercouch("https://motate.iriscouch.com");
  $scope.server = cornercouch("http://localhost:5984", "GET");
  $scope.server.session();
  $scope.motateProcessorsView = $scope.server.getDB('motate');
  $scope.motateBoardsView = $scope.server.getDB('motate');
  
  $scope.processorPredicate = ['gpio_port', 'gpio_pin'];
  $scope.processorSortColumn = 0;
  $scope.processorReverse = false;
    
  $scope.handleProcessorReverse = function(column) {
    if (column == $scope.processorSortColumn) {
      $scope.processorReverse = !$scope.processorReverse;
    }
    $scope.processorSortColumn = column;
  };

  $scope.predicate = ['pin', 'port'];
  $scope.sortColumn = 0;
  $scope.reverse = false;
    
  $scope.handleReverse = function(column) {
    if (column == $scope.sortColumn) {
      $scope.reverse = !$scope.reverse;
    }
    $scope.sortColumn = column;
  };
    
  $scope.pinNames = {
    "0": "Serial0_RX",
    "1": "Serial0_TX",
    "10": "Socket1_SPISlaveSelectPinNumber",
    "100": "XAxis_MinPinNumber",
    "101": "XAxis_MaxPinNumber",
    "102": "YAxis_MinPinNumber",
    "103": "YAxis_MaxPinNumber",
    "104": "ZAxis_MinPinNumber",
    "105": "ZAxis_MaxPinNumber",
    "106": "AAxis_MinPinNumber",
    "107": "AAxis_MaxPinNumber",
    "108": "BAxis_MinPinNumber",
    "109": "BAxis_MaxPinNumber",
    "11": "Socket1_InterruptPinNumber",
    "110": "CAxis_MinPinNumber",
    "111": "CAxis_MaxPinNumber",
    "112": "Spindle_EnablePinNumber",
    "113": "Spindle_DirPinNumber",
    "114": "Spindle_PwmPinNumber",
    "115": "Spindle_Pwm2PinNumber",
    "116": "Coolant_EnablePinNumber",
    "117": "LED_USBRXPinNumber",
    "118": "LED_USBTXPinNumber",
    "12": "Socket1_StepPinNumber",
    "13": "Socket1_DirPinNumber",
    "14": "Socket1_EnablePinNumber",
    "15": "Socket1_Microstep_0PinNumber",
    "16": "Socket1_Microstep_1PinNumber",
    "17": "Socket1_VrefPinNumber",
    "2": "I2C0_SDAPinNumber",
    "20": "Socket2_SPISlaveSelectPinNumber",
    "21": "Socket2_InterruptPinNumber",
    "22": "Socket2_StepPinNumber",
    "23": "Socket2_DirPinNumber",
    "24": "Socket2_EnablePinNumber",
    "25": "Socket2_Microstep_0PinNumber",
    "26": "Socket2_Microstep_1PinNumber",
    "27": "Socket2_VrefPinNumber",
    "3": "I2C0_SCLPinNumber",
    "30": "Socket3_SPISlaveSelectPinNumber",
    "31": "Socket3_InterruptPinNumber",
    "32": "Socket3_StepPinNumber",
    "33": "Socket3_DirPinNumber",
    "34": "Socket3_EnablePinNumber",
    "35": "Socket3_Microstep_0PinNumber",
    "36": "Socket3_Microstep_1PinNumber",
    "37": "Socket3_VrefPinNumber",
    "4": "SPI0_SCKPinNumber",
    "40": "Socket4_SPISlaveSelectPinNumber",
    "41": "Socket4_InterruptPinNumber",
    "42": "Socket4_StepPinNumber",
    "43": "Socket4_DirPinNumber",
    "44": "Socket4_EnablePinNumber",
    "45": "Socket4_Microstep_0PinNumber",
    "46": "Socket4_Microstep_1PinNumber",
    "47": "Socket4_VrefPinNumber",
    "5": "SPI0_MISOPinNumber",
    "50": "Socket5_SPISlaveSelectPinNumber",
    "51": "Socket5_InterruptPinNumber",
    "52": "Socket5_StepPinNumber",
    "53": "Socket5_DirPinNumber",
    "54": "Socket5_EnablePinNumber",
    "55": "Socket5_Microstep_0PinNumber",
    "56": "Socket5_Microstep_1PinNumber",
    "57": "Socket5_VrefPinNumber",
    "6": "SPI0_MOSIPinNumber",
    "60": "Socket6_SPISlaveSelectPinNumber",
    "61": "Socket6_InterruptPinNumber",
    "62": "Socket6_StepPinNumber",
    "63": "Socket6_DirPinNumber",
    "64": "Socket6_EnablePinNumber",
    "65": "Socket6_Microstep_0PinNumber",
    "66": "Socket6_Microstep_1PinNumber",
    "67": "Socket6_VrefPinNumber",
    "7": "Kinen_SyncPinNumber"
  }
  ;
    
/*
  $scope.pins = [];
*/

  $scope.has_pwm_changed = function() {
    if ($scope.has_pwm == true) {
      if ($scope._old_pwm) {
        $scope.pwm = delete $scope._old_pwm;
      } else {
        $scope.pwm = {};
      }
    } else {
      $scope._old_pwm = delete $scope.pwm;
    }
  }


  $scope.processorDoc = {};

  $scope.peripheralOptions = [{'name':'Per. A', 'value':'A'}, {'name':'Per. B', 'value':'B'}];

  $scope.timerTypeOptions = ['Timer', 'PWMTimer'];
  $scope.timerChannelOptions = ['A', 'B']
  $scope.timerNumberOptions = [0, 1, 2, 3];
  $scope.pwmTimerNumberOptions = [0, 1, 2, 3];

  $scope.spiPinOptions = [0, 1, 2, 3];
  $scope.spiTypeOptions = [{'name':'CS', 'value':'cs'}, {'name':'non-CS', 'value':'other'}];

  $scope.twiNumberOptions = [0, 1];
  $scope.twiTypeOptions = [{'name':'SDA', 'value':'SDA'}, {'name':'SCK', 'value':'SCK'}];

  $scope.motateProcessorsView.query("search", "processors",
    {
      include_docs: true,
      descending: true,
      limit: 8
    }
  ).success(
    function() {
      for (var rowIdx in $scope.motateProcessorsView.rows) {
        var row = $scope.motateProcessorsView.rows[rowIdx];
        $scope.processors[row.key] = row.doc;
      }
      $scope.processorDoc = $scope.processors[$scope.motateProcessorsView.rows[0].key]
    }
  );

  $scope.submitProcessor = function() {
    // if (!$scope.processorDoc instanceof $scope.motateProcessorsView.docClass) {
      var processorDoc = $scope.motateProcessorsView.newDoc($scope.processorDoc);
    // }

    processorDoc.save();
  };


  $scope.boardDoc = {};

  $scope.motateBoardsView.query("search", "boards_by_processor",
    {
      include_docs: true,
      descending: true,
      limit: 8
    }
  ).success(
    function() {
      for (var rowIdx in $scope.motateBoardsView.rows) {
        var row = $scope.motateBoardsView.rows[rowIdx];
        $scope.boards[row.key] = row.doc;
      }
      
      $scope.boardDoc = $scope.boards[$scope.motateBoardsView.rows[0].key];
    }
  );

  $scope.submitBoard = function() {
    // if (!$scope.boardDoc instanceof $scope.motateBoardsView.docClass) {
      var boardDoc = $scope.motateBoardsView.newDoc($scope.boardDoc);
    // }

    boardDoc.save();
  };
  
  
  $scope.getProcessorPin = function(boardPin) {
    
  }
});
