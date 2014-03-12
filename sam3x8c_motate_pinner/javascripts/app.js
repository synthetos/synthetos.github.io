'use strict';

// Declare app level module which depends on filters, and services
var pinoutApp = angular.module('pinoutApp', ['CornerCouch', 'ui.bootstrap']);

pinoutApp.controller('PinoutCtrl', function ($scope, cornercouch) {
  $scope.binaries = [];
  
  // $scope.server = cornercouch("https://motate.iriscouch.com");
  $scope.server = cornercouch("http://localhost:5984", "GET");
  $scope.server.session();
  $scope.motatedb = $scope.server.getDB('motate');
  
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
  $scope.pins = [
  {
    "motatePin": 2,
    "motateTWIUsed": true,
    "pin": "B",
    "pinPort": "B12",
    "port": 12,
    "pwmChannel": "A",
    "pwmInverted": "true",
    "pwmNumber": 0,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer",
    "twiPin": 1,
    "twiPinType": "SDA"
  },
  {
    "motatePin": 3,
    "motateTWIUsed": true,
    "pin": "B",
    "pinPort": "B13",
    "port": 13,
    "pwmChannel": "A",
    "pwmInverted": "true",
    "pwmNumber": 1,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer",
    "twiPin": 1,
    "twiPinType": "SCK"
  },
  {
    "motatePin": 4,
    "pin": "A",
    "pinPort": "A27",
    "port": 27,
    "spiOtherPeripheral": "A"
  },
  {
    "motatePin": 5,
    "pin": "A",
    "pinPort": "A25",
    "port": 25,
    "spiOtherPeripheral": "A"
  },
  {
    "motatePin": 6,
    "pin": "A",
    "pinPort": "A26",
    "port": 26,
    "spiOtherPeripheral": "A"
  },
  {
    "motatePin": 7,
    "pin": "B",
    "pinPort": "B15",
    "port": 15,
    "pwmChannel": "A",
    "pwmInverted": "true",
    "pwmNumber": 3,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer"
  },
  {
    "pin": "B",
    "pinPort": "B16",
    "port": 16,
    "pwmChannel": "A",
    "pwmInverted": "false",
    "pwmNumber": 0,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer"
  },
  {
    "motatePin": 100,
    "pin": "A",
    "pinPort": "A12",
    "port": 12,
    "pwmChannel": "A",
    "pwmInverted": "false",
    "pwmNumber": 1,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer"
  },
  {
    "motatePin": 52,
    "pin": "A",
    "pinPort": "A10",
    "port": 10
  },
  {
    "motatePin": 51,
    "pin": "A",
    "pinPort": "A11",
    "port": 11
  },
  {
    "motatePin": 54,
    "pin": "B",
    "pinPort": "B26",
    "port": 26
  },
  {
    "motatePin": 53,
    "pin": "A",
    "pinPort": "A9",
    "port": 9,
    "pwmChannel": "A",
    "pwmInverted": "true",
    "pwmNumber": 3,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer"
  },
  {
    "motatePin": 114,
    "pin": "A",
    "pinPort": "A8",
    "port": 8,
    "pwmChannel": "A",
    "pwmInverted": "true",
    "pwmNumber": 0,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer"
  },
  {
    "motatePin": 22,
    "pin": "A",
    "pinPort": "A21",
    "port": 21,
    "pwmChannel": "A",
    "pwmInverted": "false",
    "pwmNumber": 0,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer"
  },
  {
    "motatePin": 43,
    "pin": "B",
    "pinPort": "B11",
    "port": 11
  },
  {
    "motatePin": 55,
    "pin": "B",
    "pinPort": "B25",
    "port": 25,
    "pwmChannel": "A",
    "pwmInverted": "false",
    "pwmNumber": 0,
    "pwmPeripheral": "B",
    "pwmType": "Timer"
  },
  {
    "motatePin": 41,
    "pin": "B",
    "pinPort": "B22",
    "port": 22
  },
  {
    "motatePin": 56,
    "pin": "B",
    "pinPort": "B24",
    "port": 24
  },
  {
    "motatePin": 42,
    "pin": "B",
    "pinPort": "B14",
    "port": 14,
    "pwmChannel": "A",
    "pwmInverted": "true",
    "pwmNumber": 2,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer"
  },
  {
    "motatePWM": true,
    "motatePin": 17,
    "pin": "B",
    "pinPort": "B17",
    "port": 17,
    "pwmChannel": "A",
    "pwmInverted": "false",
    "pwmNumber": 1,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer"
  },
  {
    "pin": "B",
    "pinPort": "B23",
    "port": 23,
    "spiCSPeripheral": "B",
    "spiCSPin": "3"
  },
  {
    "motatePin": 33,
    "pin": "B",
    "pinPort": "B5",
    "port": 5
  },
  {
    "motatePin": 44,
    "pin": "B",
    "pinPort": "B10",
    "port": 10
  },
  {
    "motatePin": 46,
    "pin": "B",
    "pinPort": "B8",
    "port": 8
  },
  {
    "motatePin": 45,
    "pin": "B",
    "pinPort": "B9",
    "port": 9
  },
  {
    "motatePin": 34,
    "pin": "B",
    "pinPort": "B6",
    "port": 6
  },
  {
    "motatePin": 61,
    "pin": "B",
    "pinPort": "B7",
    "port": 7
  },
  {
    "motatePWM": true,
    "motatePin": 27,
    "pin": "B",
    "pinPort": "B18",
    "port": 18,
    "pwmChannel": "A",
    "pwmInverted": "false",
    "pwmNumber": 2,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer"
  },
  {
    "motateCSUsed": true,
    "motatePin": 40,
    "pin": "A",
    "pinPort": "A28",
    "port": 28,
    "spiCSPeripheral": "A",
    "spiCSPin": "0"
  },
  {
    "motatePWM": true,
    "motatePin": 47,
    "pin": "A",
    "pinPort": "A2",
    "port": 2,
    "pwmChannel": "A",
    "pwmInverted": "false",
    "pwmNumber": 1,
    "pwmPeripheral": "A",
    "pwmType": "Timer"
  },
  {
    "motatePin": 32,
    "pin": "B",
    "pinPort": "B4",
    "port": 4
  },
  {
    "motatePin": 36,
    "pin": "B",
    "pinPort": "B3",
    "port": 3
  },
  {
    "motatePin": 35,
    "pin": "B",
    "pinPort": "B2",
    "port": 2
  },
  {
    "motatePin": 24,
    "pin": "B",
    "pinPort": "B1",
    "port": 1
  },
  {
    "motatePin": 26,
    "pin": "B",
    "pinPort": "B20",
    "port": 20,
    "spiCSPeripheral": "B",
    "spiCSPin": "1"
  },
  {
    "motatePWM": true,
    "motatePin": 37,
    "pin": "B",
    "pinPort": "B19",
    "port": 19,
    "pwmChannel": "A",
    "pwmInverted": "false",
    "pwmNumber": 3,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer"
  },
  {
    "motateCSUsed": true,
    "motatePin": 50,
    "pin": "A",
    "pinPort": "A29",
    "port": 29,
    "spiCSPeripheral": "A",
    "spiCSPin": "1"
  },
  {
    "motatePin": 16,
    "pin": "A",
    "pinPort": "A24",
    "port": 24
  },
  {
    "motatePin": 12,
    "pin": "A",
    "pinPort": "A23",
    "port": 23
  },
  {
    "motatePin": 13,
    "pin": "A",
    "pinPort": "A22",
    "port": 22
  },
  {
    "motatePin": 14,
    "pin": "A",
    "pinPort": "A6",
    "port": 6,
    "pwmChannel": "B",
    "pwmInverted": "false",
    "pwmNumber": 2,
    "pwmPeripheral": "A",
    "pwmType": "Timer"
  },
  {
    "motatePin": 25,
    "pin": "A",
    "pinPort": "A4",
    "port": 4
  },
  {
    "motatePWM": true,
    "motatePin": 57,
    "pin": "A",
    "pinPort": "A3",
    "port": 3,
    "pwmChannel": "B",
    "pwmInverted": "false",
    "pwmNumber": 1,
    "pwmPeripheral": "A",
    "pwmType": "Timer"
  },
  {
    "motatePin": 23,
    "pin": "B",
    "pinPort": "B0",
    "port": 0
  },
  {
    "motateCSUsed": true,
    "motatePin": 60,
    "pin": "B",
    "pinPort": "B21",
    "port": 21,
    "spiCSPeripheral": "B",
    "spiCSPin": "2"
  },
  {
    "motatePin": 15,
    "pin": "A",
    "pinPort": "A16",
    "port": 16
  },
  {
    "motatePin": 101,
    "pin": "A",
    "pinPort": "A13",
    "port": 13,
    "pwmChannel": "A",
    "pwmInverted": "true",
    "pwmNumber": 2,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer"
  },
  {
    "motatePin": 102,
    "pin": "A",
    "pinPort": "A14",
    "port": 14
  },
  {
    "motatePin": 103,
    "pin": "A",
    "pinPort": "A15",
    "port": 15
  },
  {
    "motatePin": 104,
    "pin": "A",
    "pinPort": "A17",
    "port": 17,
    "twiPin": 0,
    "twiPinType": "SDA"
  },
  {
    "motatePin": 105,
    "pin": "A",
    "pinPort": "A0",
    "port": 0,
    "pwmChannel": "A",
    "pwmInverted": "false",
    "pwmNumber": 3,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer"
  },
  {
    "motatePin": 116,
    "pin": "A",
    "pinPort": "A1",
    "port": 1
  },
  {
    "motatePin": 117,
    "pin": "A",
    "pinPort": "A18",
    "port": 18,
    "twiPin": 0,
    "twiPinType": "SCK"
  },
  {
    "motatePin": 118,
    "pin": "A",
    "pinPort": "A19",
    "port": 19,
    "pwmChannel": "A",
    "pwmInverted": "true",
    "pwmNumber": 1,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer"
  },
  {
    "pin": "B",
    "pinPort": "B27",
    "port": 27,
    "pwmChannel": "A",
    "pwmInverted": "false",
    "pwmNumber": 0,
    "pwmPeripheral": "B",
    "pwmType": "Timer"
  },
  {
    "pin": "A",
    "pinPort": "A20",
    "port": 20,
    "pwmChannel": "A",
    "pwmInverted": "false",
    "pwmNumber": 2,
    "pwmPeripheral": "B",
    "pwmType": "PWMTimer"
  },
  {
    "motatePin": 112,
    "pin": "A",
    "pinPort": "A5",
    "port": 5
  },
  {
    "motatePin": 113,
    "pin": "A",
    "pinPort": "A7",
    "port": 7
  }
  ]
  ;
*/
  // $scope.processorDoc = $scope.motatedb.getDoc("sam3x8e");
  $scope.motatedb.query("boards_by_processor", "boards_by_processor",
      {
        include_docs: true,
        descending: true,
        limit: 8
      }
    );

  $scope.boards = $scope.motatedb.rows;
  $scope.processorDoc = $scope.motatedb.getDoc("G2v9g");
  $scope.submitPinout = function() {
    $scope.processorDoc.save();
  };
});
