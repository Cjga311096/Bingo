"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var signalr_1 = require("@microsoft/signalr");
var connection = new signalr_1.HubConnectionBuilder()
    .withUrl("https://localhost:44397/SignalHubs")
    .withAutomaticReconnect()
    .configureLogging(signalr_1.LogLevel.Information)
    .build();
var SignalRPage = /** @class */ (function (_super) {
    __extends(SignalRPage, _super);
    function SignalRPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            name: '',
            message: '',
            list: []
        };
        _this.sendMessage = function () {
            var _a = _this.state, name = _a.name, message = _a.message;
            console.log(name, message);
            connection.send("Send", message);
        };
        _this.handleChange = function (name) { return function (event) {
            var _a;
            return _this.setState((_a = {}, _a[name] = event.target.value, _a));
        }; };
        return _this;
    }
    SignalRPage.prototype.componentDidMount = function () {
        var _this = this;
        var username;
        do {
            username = prompt("Nombre: ");
        } while (username === null || username === "");
        connection.start()
            .then(function () {
            console.log('connection started');
            connection.send("Connect", username);
        })
            .catch(function (error) {
            console.error(error.message);
        });
        connection.on('broadcastMessage', function (name, message) {
            var list = _this.state.list;
            var updatedList = list.concat([{ name: name, message: message, id: Date.now().toString() }]);
            _this.setState({ list: updatedList });
        });
    };
    SignalRPage.prototype.render = function () {
        var _a = this.state, name = _a.name, message = _a.message;
        return (React.createElement(React.Fragment, null,
            React.createElement("input", { type: "text", value: name, onChange: this.handleChange('name') }),
            React.createElement("input", { type: "text", value: message, onChange: this.handleChange('message') }),
            React.createElement("button", { type: "button", id: "btn", onClick: this.sendMessage }, "Enviar"),
            React.createElement("div", { id: "" },
                React.createElement("ul", null, this.state.list.map(function (item) { return (React.createElement("li", { key: item.id }, item.name + ": " + item.message)); })))));
    };
    return SignalRPage;
}(React.PureComponent));
;
function mapStateToProps(state) {
    return state;
}
function mapDispatchToProps() {
    return {};
}
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(SignalRPage);
//# sourceMappingURL=SignalR.js.map