const mongoose = require('mongoose');

mongoose
    .connect('mongodb+srv://daliabelharett:Dalia2023@cluster.ho6b0l7.mongodb.net/')
    .then(() => console.log('Connecté à MongoDB'))
    .catch((err) => console.log("Échec de la connexion à MongoDB :", err));
