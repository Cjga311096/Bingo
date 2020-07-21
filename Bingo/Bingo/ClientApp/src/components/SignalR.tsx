import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';


type CounterProps = RouteComponentProps<{}>;

const connection = new HubConnectionBuilder()
    .withUrl("https://localhost:44397/SignalHubs")
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

type State = {
    name: string,
    message: string,
    list: Messages[]
}

type Messages = {
    name: string,
    message: string,
    id: string
}

class SignalRPage extends React.PureComponent<CounterProps> {
    public state: State = {
        name: '',
        message: '',
        list: []
    }

    componentDidMount() {
        
        var username: any;
        do {
            username = prompt("Nombre: ");
        } while (username === null || username === "");
        
        connection.start()
            .then(function () {
                console.log('connection started');
                connection.send("Connect", username);
            })
            .catch(error => {
                console.error(error.message);
            });
        
        connection.on('broadcastMessage', (name: string, message: string) => {
            const { list } = this.state;
            const updatedList: Messages[] = list.concat([{ name, message, id: Date.now().toString() }]);
            this.setState({ list: updatedList });
        });
    }


    sendMessage = () => {
        const { name, message } = this.state;
        console.log(name, message);
        connection.send("Send", message);
    }

    handleChange = (name: string) => (event: any) => this.setState({ [name]: event.target.value });

    public render() {
        const { name, message } = this.state;
        return (
            <React.Fragment>
                <input type="text" value={name} onChange={this.handleChange('name')} />
                <input type="text" value={message} onChange={this.handleChange('message')} />

                <button type="button" id="btn" onClick={this.sendMessage}>Enviar</button>

                <div id="">
                    <ul>
                        {this.state.list.map((item: any) => (
                            <li key={item.id}>{`${item.name}: ${item.message}`}</li>
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
