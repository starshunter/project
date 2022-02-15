export const serverConn = async(url, input, method = 'POST') => 
    fetch(url, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
    }).then(response => {
        return response.json();
    })