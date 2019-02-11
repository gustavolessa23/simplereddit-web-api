
// User login, returning a token if valid
(async ()=>{
    const userData = {
        email: "test@test.com",
        password: "secret1"
    };
    const response = await fetch(
        "http://localhost:8080/api/v1/auth/login",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' ,
            },
            body: JSON.stringify(userData)
        }
    )
    const json = await response.json();
    console.log(json);
})();