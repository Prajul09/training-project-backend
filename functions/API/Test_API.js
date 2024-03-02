const admin = require("firebase-admin");
const express = require("express");
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });
const cors = require("cors");

const Testing = express();
Testing.use(cors({ origin: true }));

const db = admin.firestore();

Testing.get("/", async (req, res) => {
    res.send("Hello from firebase API")
})

Testing.post("/api/create", [parseUrl, parseJson], async (req, res) => {
    try {
        await db.collection("testingConcept").doc(`/${Date.now()}/`).create({
            id: Date.now(),
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            dob: req.body.dob,
        });

        return res.status(200).send({ status: "Success", msg: "Data Saved",  id: Date.now() });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: "Failed", msg: error });
    }
});


Testing.get("/api/get/:id", [parseUrl, parseJson], async (req, res) => {
    try {
        const reqDoc = db.collection("testingConcept").doc(req.params.id);
        let userDetail = await reqDoc.get();
        let response = userDetail.data();

        return res.status(200).send({ status: "Success", data: response });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: "Failed", msg: error });
    }
});

Testing.get("/api/getAll", [parseUrl, parseJson], async (req, res) => {
    try {
        const query = db.collection("testingConcept");
        let response = [];
        await query.get().then((data)=>{
            let docs = data.docs;

            docs.map((doc)=> {
                const selectedItem = {
                    id:doc.data().id,
                    name: doc.data().name,
                    email: doc.data().email,
                    mobile: doc.data().mobile,
                    dob: doc.data().dob,
                };
                response.push(selectedItem);
            });
            return response;
        });
        return res.status(200).send({ status: "Success", data: response });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: "Failed", msg: error });
    }
});

Testing.delete("/api/delete/:id", [parseUrl, parseJson], async (req, res) => {
    try {
        const reqDoc = db.collection("testingConcept").doc(req.params.id);
        await reqDoc.delete();
        return res.status(200).send({ status: "Success", msg: "Data Removed" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: "Failed", msg: error });
    }
});


module.exports = { Testing };