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
            message: '',
            list: [],
            state: signalr_1.HubConnectionState.Disconnected
        };
        _this.sendMessage = function () {
            var message = _this.state.message;
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
        var client = JSON.parse(localStorage.getItem('client') || "");
        if (client.username === "") {
            do {
                client.username = prompt("Nombre: ") || "";
                localStorage.setItem("client", JSON.stringify(client));
            } while (client.username === "");
        }
        connection.start()
            .then(function () {
            console.log('connection started');
            _this.setState({ state: connection.state });
            connection.send("Connect", client.username);
        })
            .catch(function (error) {
            console.error(error.message);
        });
        connection.on('broadcastMessage', function (username, message) {
            var list = _this.state.list;
            var updatedList = list.concat([{ username: username, message: message, id: Date.now().toString() }]);
            _this.setState({ list: updatedList });
        });
        connection.onclose(function (error) {
            console.log(error);
        });
    };
    SignalRPage.prototype.render = function () {
        var message = this.state.message;
        return (React.createElement(React.Fragment, null,
            React.createElement("input", { type: "text", value: message, onChange: this.handleChange('message') }),
            React.createElement("button", { type: "button", id: "btn", onClick: this.sendMessage }, "Enviar"),
            React.createElement("div", { id: "" },
                React.createElement("ul", null, this.state.list.map(function (item) { return (React.createElement("li", { key: item.id }, item.username + ": " + item.message)); })))));
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