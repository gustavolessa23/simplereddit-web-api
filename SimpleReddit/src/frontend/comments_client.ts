
// Delete one comment by ID, providing token
(async () => {
    const response = await fetch(
        "http://localhost:8080/api/v1/comments/1",
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


// Create a comment, providing fields
(async ()=>{
    const commentData = {
        linkid: 3,
        commentBody: "This link is really useful!"
    };
    const response = await fetch(
        "http://localhost:8080/api/v1/comments/",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' ,
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQ4Nzc3NTg4fQ.fF96-XW3YnoWnBdMJ02AJDylbG65VDLJ9cxuCtwivwI'
            },
            body: JSON.stringify(commentData)
        }
    )
    const json = await response.json();
    console.log(json);
})();

// Update a comment, providing at least one field
(async ()=>{
    const commentData = {
        commentBody: "I've changed my mind. It isn't useful at all!"
    };
    const response = await fetch(
        "http://localhost:8080/api/v1/comments/1",
        {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' ,
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTQ4ODY4NzI2fQ.k4R6gQdH7LDBpRZrEt4df1QKkGL6_6T1lZFApF_9EZo'
            },
            body: JSON.stringify(commentData)
        }
    )
    const json = await response.json();
    console.log(json);
})();
