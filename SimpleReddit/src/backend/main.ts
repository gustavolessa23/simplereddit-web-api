
import { getApp } from "./config/app";

(async () => {
    const app = await getApp();
    const port = process.env.PORT || 8080;

    // Start the server
    app.listen(port, () => {
        console.log(
            `The server is running! Port = ${port}!`
        );
    });
})();