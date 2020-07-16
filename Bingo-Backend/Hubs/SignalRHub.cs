using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Bingo_Backend.Hubs
{
    class SignalRHub: Hub
    {
        public void Send(string nombre,string mensaje)
        {
            Clients.All.SendAsync("broadcastMessage",nombre,mensaje);
        }
    }
}
