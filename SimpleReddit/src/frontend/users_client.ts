
// Create a user, providing fields
(async ()=>{
    const userData = {
        email: "test@test.com",
        password: "secret1"
    };
    const response = await fetch(
        "http://localhost:8080/api/v1/users/",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' ,
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQ4Nzc3NTg4fQ.fF96-XW3YnoWnBdMJ02AJDylbG65VDLJ9cxuCtwivwI'
            },
            body: JSON.stringify(userData)
        }
    )
    const json = await response.json();
    console.log(json);
})();

// Get one user, providing id
(async ()=>{
    const response = await fetch(
        "http://localhost:8080/api/v1/users/1",
        {
            method: "GET"
        }
    );
    const json = await response.json();
    console.log(json);
})();
