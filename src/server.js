const express = require("express");
const mongoos = require("mongoose");
const port = 3001;
const formController = require("./controllers/forms.js");
const cors = require('cors');

mongoos.connect('mongodb://localhost:27017/form-builder', {
    useNewUrlParser: true
})
.then(() => {
    const app = express();
    app.use(cors({ origin: true,credentials: true }));
    app.use(express.json())

    //Create Form
    app.post("/Form/Store", formController.createForm)

    //Fetch all the forms
    app.get("/Forms", formController.findForms)

    //Fetch Form
    app.get("/Form/:id", formController.findForm)

    //Update Form
    app.patch("/form/:id", formController.updateForm)
    
    //Delete Form
    app.delete("/Form/:id", formController.deleteForm)

    //Create Response
    app.post("/Form/Submit", formController.createResponse)

    //Activate or deactivate form
    app.post("/Form/Status/:id", formController.activeForm)

    //Fetch all response for a specific form
    app.get("/Response/:id", formController.findResponsesByFormId);

    //Fetch active forms
    app.get("/Forms/Active", formController.getActiveForms);

    app.listen(port, () => {
        console.log("Server listening on "+port)
    })
})
.catch(() => {
    console.log("Database connection failed!");
})

