app.controller('InsightController', ['$location', function ($location) {
        var vm = this;
        vm.name = "Alex";
        vm.isActive = function (link) {
            if ($location.path() === link) {
                return "active";
            }
            else {
                return "";
            }
        };
    }]);
//# sourceMappingURL=main-controller.js.map