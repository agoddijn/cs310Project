app.controller('MapController', ['$http', function ($http) {
        var vm = this;
        vm.buildings = [];
        vm.map;
        vm.markers = [];
        vm.infoWindow;
        vm.selectedMarker;
        vm.buildingNameQuery = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "rooms_fullname",
                    "rooms_lat",
                    "rooms_lon",
                    "totalSeats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": [
                        "rooms_shortname"
                    ]
                },
                "FORM": "TABLE"
            },
            "TRANSFORMATIONS": {
                "GROUP": [
                    "rooms_shortname",
                    "rooms_fullname",
                    "rooms_lat",
                    "rooms_lon"
                ],
                "APPLY": [
                    {
                        "totalSeats": {
                            "SUM": "rooms_seats"
                        }
                    }
                ]
            }
        };
        vm.getRoomInfoReq = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": [
                    "rooms_shortname",
                    "rooms_number",
                    "rooms_seats"
                ],
                "ORDER": {
                    "dir": "DOWN",
                    "keys": [
                        "rooms_seats",
                        "rooms_shortname",
                        "rooms_number"
                    ]
                },
                "FORM": "TABLE"
            }
        };
        vm.getBuildings = function () {
            var url = "/query";
            $http.post(url, vm.buildingNameQuery).then(function (res) {
                vm.buildings = res.data.result;
                vm.populateMap();
            }).catch(function (err) {
                console.log("Could not get buildings");
                console.log(err);
            });
        };
        vm.initMap = function () {
            vm.map = new google.maps.Map(document.getElementById('my-map'), {
                zoom: 15,
                center: new google.maps.LatLng(49.265550, -123.250289)
            });
            vm.infoWindow = new google.maps.InfoWindow();
        };
        vm.populateMap = function () {
            for (var _i = 0, _a = vm.buildings; _i < _a.length; _i++) {
                var building = _a[_i];
                vm.createMarker(building);
            }
        };
        vm.createMarker = function (building) {
            var req = {
                "WHERE": {
                    "IS": {
                        "rooms_shortname": building["rooms_shortname"]
                    }
                },
                "OPTIONS": {
                    "COLUMNS": [
                        "rooms_shortname",
                        "rooms_number",
                        "rooms_seats"
                    ],
                    "ORDER": {
                        "dir": "DOWN",
                        "keys": [
                            "rooms_seats",
                            "rooms_shortname",
                            "rooms_number"
                        ]
                    },
                    "FORM": "TABLE"
                }
            };
            var url = "/query";
            $http.post(url, req).then(function (res) {
                var marker = new google.maps.Marker({
                    map: vm.map,
                    position: new google.maps.LatLng(building["rooms_lat"], building["rooms_lon"]),
                    title: building["rooms_shortname"]
                });
                marker.content = '<div class="infoWindowContent">' +
                    '<div class="panel panel-default">' +
                    '<div class="panel-heading">' + building["rooms_fullname"] + '</div>' +
                    '<div class="panel-body">' +
                    '<p>Total Seats: ' + building["totalSeats"] + '</p>' +
                    '</div>' +
                    '<table class="table table-bordered">' +
                    '<thead><tr>' +
                    '<th>Room</th>' +
                    '<th>Seats</th>' +
                    '</tr></thead>';
                for (var _i = 0, _a = res.data.result; _i < _a.length; _i++) {
                    var room = _a[_i];
                    marker.content += '<tr><td>' + room.rooms_number + '</td>' +
                        '<td>' + room.rooms_seats + '</td></tr>';
                }
                marker.content += '</table></div></div>';
                google.maps.event.addListener(marker, 'click', function () {
                    vm.infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                    vm.infoWindow.open(vm.map, marker);
                });
                vm.markers.push(marker);
            }).catch(function (err) {
                console.log("Could not get buildings");
                console.log(err);
            });
        };
        vm.init = function () {
            vm.getBuildings();
            vm.initMap();
        };
        vm.search = function () {
            var myMarker;
            for (var _i = 0, _a = vm.markers; _i < _a.length; _i++) {
                var marker = _a[_i];
                if (marker.title === vm.selectedMarker) {
                    myMarker = marker;
                    break;
                }
            }
            google.maps.event.trigger(myMarker, 'click');
        };
        vm.init();
    }]);
//# sourceMappingURL=map-controller.js.map