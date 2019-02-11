// Get all links with comments
(async () => {
    const response = await fetch(
        "http://localhost:8080/api/v1/links",
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    );
    const json: JSON = await response.json();
    console.log(json);
})();

// Get one link, providing id
(async ()=>{
    const response = await fetch(
        "http://localhost:8080/api/v1/links/1",
        { method: "GET" }
    );
    const json = await response.json();
    console.log(json);
})();

// Delete one link by ID, providing token of user who created the link
(async () => {
    const response = await fetch(
        "http://localhost:8080/api/v1/links/8",
        {
            method: "DELETE",
            headers: {
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTQ4ODY4NzI2fQ.k4R6gQdH7LDBpRZrEt4df1QKkGL6_6T1lZFApF_9EZo'
            }
        }
    );
    const json = await response.json();
    console.log(json);
})();


// Create a link, providing fields
(async ()=>{
    const linkData = {
        title: "Teste",
        url: "http://www.teste.com"
    };
    const response = await fetch(
        "http://localhost:8080/api/v1/links/",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' ,
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQ4Nzc3NTg4fQ.fF96-XW3YnoWnBdMJ02AJDylbG65VDLJ9cxuCtwivwI'
            },
            body: JSON.stringify(linkData)
        }
    )
})();

// Upvote a link, providing id on URL
(async ()=>{
    const response = await fetch(
        "http://localhost:8080/api/v1/links/1/upvote",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' ,
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQ4Nzc3NTg4fQ.fF96-XW3YnoWnBdMJ02AJDylbG65VDLJ9cxuCtwivwI'
            }
        }
    )
    const json = await response.json();
    console.log(json);
})();

// Downvote a link, providing id on URL
(async ()=>{
    const response = await fetch(
        "http://localhost:8080/api/v1/links/1/downvote",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' ,
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTQ4ODY4NzI2fQ.k4R6gQdH7LDBpRZrEt4df1QKkGL6_6T1lZFApF_9EZo'
            }
        }
    )
    const json = await response.json();
    console.log(json);
})();

export function deleteLink(id: string, token: string){
    (async () => {
    const response = await fetch(
        "http://localhost:8080/api/v1/links/".concat(id),
        {
            method: "DELETE",
            headers: {
                "x-auth-token": token
            }
        }
    );
    const json = await response.json();
    console.log(json);
    return json;
})();
}