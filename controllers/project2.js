const { response } = require('express');
const mongodb = require('../data/database');
const ObjectId = require("mongodb").ObjectId;

const getSingle = async (req, res) => {
  try {
    const CarId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db('project2').collection('project2').findOne({ _id: CarId });

    if (!result) {
      res.status(404).json({ message: "Car not found" });
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred while retrieving the car" });
  }
};

const createCar = async (req, res) => {
  try {
    const car = {
      brand: req.body.brand,
      type: req.body.type,
    };

    const response = await mongodb.getDatabase().db('project2').collection('project2').insertOne(car);

    if (!response.acknowledged) {
      throw new Error("Failed to create the car");
    }

    res.status(201).json({ id: response.insertedId, message: "Car created successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred while creating the car" });
  }
};

const updateCar = async (req, res) => {
  try {
    const CarId = new ObjectId(req.params.id);
    const car = {
      brand: req.body.brand,
      type: req.body.type,
    };

    const response = await mongodb.getDatabase().db('project2').collection('project2').replaceOne({ _id: CarId }, car);

    if (response.modifiedCount === 0) {
      throw new Error("Car not found or no updates were made");
    }

    res.status(200).json({ message: "Car updated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred while updating the car" });
  }
};

const deleteCar = async (req, res) => {
  try {
    const CarId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db('project2').collection('project2').deleteOne({ _id: CarId });

    if (response.deletedCount === 0) {
      throw new Error("Car not found");
    }

    res.status(200).json({ message: "Car deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred while deleting the car" });
  }
};

module.exports = {
    getAll,
    getSingle,
    createCar,
    updateCar,
    deleteCar
};