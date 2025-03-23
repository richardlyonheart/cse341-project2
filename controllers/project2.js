const { response } = require('express');
const mongodb = require('../data/database');
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db('project2').collection('project2').find();
    result.toArray().then((project2) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(project2);
    });
};

const getSingle = async (req, res) => {
    const CarId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db('project2').collection("project2").find({ _id: CarId });
    result.toArray().then((cars) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(cars[0]);
    });
  };

const createCar = async (req, res) => {
  const car ={
    brand: req.body.brand,
    type: req.body.type,
  };
  const response = await mongodb.getDatabase().db("project2").collection("project2").insertOne({car});
  if (response.acknowledged){
    res.status(200).send();
  } else {
    res.status(500).json(response.error || "there has been an error creating car")
  }
};

const updateCar = async (req, res) => {
  const CarId = new ObjectId(req.params.id);
  const car = {
    brand: req.body.brand,
    type: req.body.type,
  };
  const response = await mongodb.getDatabase().db("project2").collection("project2").replaceOne({ _id: CarId}, car);

  if (response.modifiedCount > 0) {
    res.status(200).send();
  } else { 
    res.status(500).json(response.error || "there has been an error updating car")
  }
};

const deleteCar = async (req, res)=> {
  const CarId = new ObjectId(req.params.id);
  const response = await mongodb.getDatabase().db("project2").collection("project2").deleteOne({ _id: CarId }, true);

  if (response.deletedCount >0) {
    res.status(200).send();
  } else {
    res.status(500).json(response.erros || "could not delete car")
  }
};


module.exports = {
    getAll,
    getSingle,
    createCar,
    updateCar,
    deleteCar
};