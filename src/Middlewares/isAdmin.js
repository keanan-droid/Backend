import { verify } from "jsonwebtoken"

export const isAdmin = (request, response, next) => {
    const admin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxIiwicGhvbmVudW1iZXIiOiIxMjM0NTY3ODkiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NTYzNTU3OTMsImV4cCI6MTY1NjYxNDk5M30.2cG_XmOOghTbwd7zCXeVQgs_aTs5DemwaEh0P-U7tbo"
    const token = request.headers["x-auth-token"];

    if (!token) {
        console.log(request.headers);
        return response.status(401).json({ msg: "Login or signup to continue" });
    }

    verify(token, "privateKey", (error, decodedToken)=> {
        if (token !== admin) {
            return response.status(401).json({ msg: "Unauthorised" })
        }
        request.token = decodedToken;
        next();
    });
}

//admin"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxIiwicGhvbmVudW1iZXIiOiIxMjM0NTY3ODkiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NTYzNTU3OTMsImV4cCI6MTY1NjYxNDk5M30.2cG_XmOOghTbwd7zCXeVQgs_aTs5DemwaEh0P-U7tbo"
//user"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyIiwicGhvbmVudW1iZXIiOiIxMjM0NTY3ODkiLCJyb2xlIjoidXNlciIsImlhdCI6MTY1NjM1NTg5NCwiZXhwIjoxNjU2NjE1MDk0fQ.6hmiV7oS93HR52f9b123gV3Umt4s0qwNA3pEgaH1Lws"