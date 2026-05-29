let clients: any[] = [];

export function addClient(client: any) {

  clients.push(client);

}

export function removeClient(client: any) {

  clients = clients.filter(c => c !== client);

}

export function sendLog(message: string) {

  clients.forEach(client => {

    client.raw.write(
      `data: ${JSON.stringify({ message })}\n\n`
    );

  });

}