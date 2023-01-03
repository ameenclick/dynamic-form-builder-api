const Forms = require("../models/Forms");
const Response = require("../models/Responses")

exports.findForms = async (request, response) => {
    const forms = await Forms.find();
    response.send(forms);
};

exports.createForm = async (req, res) => {
    var formData = req.body
    //Creating database structure to store form
    var hash = require('object-hash');
    formHash = hash(formData)
    var labels=[]
    formData.fields.forEach(element => {
        if(element.label) labels=[...labels,element.label]
    });
    formData["version"]=formHash
    const form = Forms({
        stack: [formData],
        labels: labels,
        active: true
    })
    await form.save()
    res.send(form)
}

exports.findForm = async (req,res) => {
    try{
        var forms = await Forms.findById(req.params.id) 
        res.send(forms)
    } catch {
        res.status(404).send({ error: "Form not found"})
    }
    
}

exports.updateForm = async ( req, res ) => {
    try{
        const form = await Forms.findById(req.params.id)
        let formData=JSON.parse(JSON.stringify(form))
        let copyFormData=JSON.parse(JSON.stringify(formData))
        let newData = req.body
        delete newData["version"]
        //Creating new form version to store for rollback
        var hash = require('object-hash');
        formHash = hash(newData)
        if(copyFormData.stack.pop().version === formHash)
        {
            res.status(205).send("Already")
            console.log("Data already exist")
            return
        }
        //Storing all labels for mapping with response
        newData.fields.forEach(element => {
            if(element.label && !formData.labels.includes(element.label))
            {
                var l=formData.labels
                formData["labels"]=[...l,element.label]
            }
        })
        newData["version"]=formHash
        var appendedData=[...formData.stack, newData]
        formData["stack"]=appendedData
        formData["active"]=true
        Object.assign(form, formData);
        await form.save()
        res.send(form)
    } catch (err) {
        console.log(err)
        res.status(404).send({ error: "Form not found"})
    }
}

exports.activeForm = async ( req, res) => {
    try{
        const form = await Forms.findById(req.params.id);
        Object.assign(form, req.body)
        await form.save();
        res.send(form)
        
    }catch (err) {
        res.status(404).send({ error: "Form not found"})
        console.log(err)
    }
}

exports.deleteForm = async ( req, res ) => {
    try{
        const form = await Forms.findById(req.params.id)
        await form.remove();
        res.send({ data : "Deletion successful "+form.id})
    } catch {
        res.status(404).send({ error: "Form not found"})
    }
}


exports.createResponse = async ( req, res ) => {
    try{
        const response = Response(req.body);
        await response.save();
        res.send("Recieved successfully")
    }catch {
        res.status(500).send({ error: "Storage failed"})
    }
}

//Find responses of a form
exports.findResponsesByFormId = async ( req, res ) => {
    try{
        var response = await Response.find({"formId" :req.params.id});
        var form = await Forms.findById(req.params.id)
        //Sending labels seperatly with response 
        res.send({response: response, labels:form.labels})
    } catch {
        res.status(500).send({ error: "Data not found"})
    }
}

//Get list of all active forms
exports.getActiveForms = async ( req, res ) => {
    try{
        var response = await Forms.find({"active": true});
        res.send(response)
    } catch {
        res.status(404).send({ error: "Forms not found"})
    }
}