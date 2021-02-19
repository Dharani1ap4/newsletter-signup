const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function(request, response) {
    response.sendFile(__dirname + "/signup.html");
})

app.post("/", function(request, response) {

    const firstname = request.body.fname;
    const lastname = request.body.lname;
    const emailaddress = request.body.emailad;

    const data = {
        "members": [{
            "email_address": emailaddress,
            "status": "subscribed",
            "merge_fields": {
                FNAME: firstname,
                LNAME: lastname,
            }

        }]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/9d9cfdd9a7";


    const options = {
        method: "POST",
        auth: "dharani:b3ad3a141148dbf07923a6dc9ab63636-us1"

    }

    const req = https.request(url, options, function(res) {
        const statusCode1 = res.statusCode;
        if (statusCode1 === 200) {
            response.sendFile(__dirname + "/success.html");
        } else {
            response.sendFile(__dirname + "/failure.html");
        }
        res.on("data", function(data) {
            const finalData = JSON.parse(jsonData);
            console.log(finalData);
        })

    })

    req.write(jsonData);
    req.end();
})

app.post("/failure", function(request, response) {
    response.redirect("/");
})

//b3ad3a141148dbf07923a6dc9ab63636-us1
//9d9cfdd9a7


app.listen(process.env.PORT || 3000, function(request, response) {
    console.log("The server has been started at port 3000");
})