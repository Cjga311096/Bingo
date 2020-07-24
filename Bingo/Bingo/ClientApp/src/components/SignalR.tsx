import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import { HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';


type CounterProps = RouteComponentProps<{}>;

const connection = new HubConnectionBuilder()
    .withUrl("https://localhost:44397/SignalHubs")
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

type State = {
    message: string,
    list: Messages[],
    state: HubConnectionState
}

type Messages = {
    username: string,
    message: string,
    id: string
}

type Client = {
    username: string
}

class SignalRPage extends React.PureComponent<CounterProps> {
    public state: State = {
        message: '',
        list: [],
        state: HubConnectionState.Disconnected
    }

    componentDidMount() {
        var client: Client = JSON.parse(localStorage.getItem('client') || "");
        if (client.username === "") {

            do {
                client.username = prompt("Nombre: ") || "";

                localStorage.setItem("client", JSON.stringify(client));
            } while (client.username === "");
        }
        
        connection.start()
            .then(() => {
                console.log('connection started');
                this.setState({ state: connection.state });
                connection.send("Connect", client.username);
            })
            .catch(error => {
                console.error(error.message);
            });
        
        connection.on('broadcastMessage', (username: string, message: string) => {
            const { list } = this.state;
            const updatedList: Messages[] = list.concat([{ username, message, id: Date.now().toString() }]);
            this.setState({ list: updatedList });
        });

        connection.onclose(error => {
            console.log(error);
        });
    }


    sendMessage = () => {
        const { message } = this.state;
        connection.send("Send", message);
    }

    handleChange = (name: string) => (event: any) => this.setState({ [name]: event.target.value });

    public render() {
        const { message } = this.state;
        return (
            <React.Fragment>
                <input type="text" value={message} onChange={this.handleChange('message')} />

                <button type="button" id="btn" onClick={this.sendMessage}>Enviar</button>

                <div id="">
                    <ul>
                        {this.state.list.map((item: any) => (
                            <li key={item.id}>{`${item.username}: ${item.message}`}</li>
                        ))}
                    </ul>
                </div>
            </React.Fragment>
        );
    }
};


function mapStateToProps(state: ApplicationState) {
    return state;
}

function mapDispatchToProps() {
    return {
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignalRPage);
