using Bingo_Backend.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bingo_Backend.Hubs
{
    class SignalRHub : Hub
    {
        public static List<Client> ConnectedUsers { get; set; } = new List<Client>();

        public void Send(string mensaje) {
            const username: string = 
            Clients.All.SendAsync("broadcastMessage", ConnectedUsers.Find(client => client.ID == Context.ConnectionId).Username, mensaje);
        }

        [HubMethodName("Connect")]

        public void Connect(string username) => ConnectedUsers.Add(new Client() { Username = username, ID = Context.ConnectionId });

        public override Task OnConnectedAsync() {
            if (!ConnectedUsers.Any(p => p.Username.Equals(Context.User.Identity.Name))) {
                if (!string.Equals(Context.User.Identity.Name, string.Empty)) {
                    Client cliente = new Client() {
                        Username = Context.User.Identity.Name,
                        ID = Context.ConnectionId
                    };
                    ConnectedUsers.Add(cliente);
                }
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception) {
            var disconnectedUser = ConnectedUsers.FirstOrDefault(c => c.ID.Equals(Context.ConnectionId));
            ConnectedUsers.Remove(disconnectedUser);
            return base.OnDisconnectedAsync(exception);
        }

    }
}
