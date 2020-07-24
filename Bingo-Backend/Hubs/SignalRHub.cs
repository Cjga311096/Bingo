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
            string username = ConnectedUsers.Find(client => client.ID == Context.ConnectionId).Username;
            Clients.All.SendAsync("broadcastMessage", username, mensaje);
        }

        [HubMethodName("Connect")]

        public void Connect(string username) {
            bool exist = ConnectedUsers.Exists(item => item.ID == Context.ConnectionId);
            if (!exist) ConnectedUsers.Add(new Client() { Username = username, ID = Context.ConnectionId });
            if (exist) ConnectedUsers.Find(item => item.ID == Context.ConnectionId).Username = username; 
        }

        public override Task OnConnectedAsync() {
            Client cliente = new Client() {
                Username = "No definido",
                ID = Context.ConnectionId
            };
            ConnectedUsers.Add(cliente);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception) {
            var disconnectedUser = ConnectedUsers.FirstOrDefault(c => c.ID.Equals(Context.ConnectionId));
            ConnectedUsers.Remove(disconnectedUser);
            return base.OnDisconnectedAsync(exception);
        }

    }
}
